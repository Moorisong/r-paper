'use strict';

const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const RollingPaper = require('../models/rolling-paper');
const Message = require('../models/message');
const IpActivity = require('../models/ip-activity');
const IpBlacklist = require('../models/ip-blacklist');
const { generateSlug } = require('../utils/slug-generator');
const { containsProfanity } = require('../utils/profanity-filter');
const { ERROR_CODES, CONFIG, THEMES } = require('../constants');

// 인메모리 레이트 리밋 저장소 (단기 제한용)
const rateLimitStore = new Map();

// 레이트 리밋 정리 (10분마다 오래된 데이터 삭제)
setInterval(() => {
  const now = Date.now();
  const fiveMinutesAgo = now - 5 * 60 * 1000;
  for (const [ip, data] of rateLimitStore.entries()) {
    data.timestamps = data.timestamps.filter(ts => ts > fiveMinutesAgo);
    if (data.timestamps.length === 0) {
      rateLimitStore.delete(ip);
    }
  }
}, 10 * 60 * 1000);

const generateCreatorToken = () => {
  return crypto.randomUUID();
};

const sendError = (res, statusCode, errorCode) => {
  return res.status(statusCode).json({
    success: false,
    error: errorCode
  });
};

const getRandomTheme = () => {
  const randomIndex = Math.floor(Math.random() * THEMES.length);
  return THEMES[randomIndex];
};

// 오늘 날짜를 YYYY-MM-DD 형식으로 반환
const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

// IP 블랙리스트 체크
const checkBlacklist = async (ip) => {
  const blacklistEntry = await IpBlacklist.findOne({ ip });
  return !!blacklistEntry;
};

// 일일 제한 체크
const checkDailyLimit = async (ip) => {
  const today = getTodayDateString();
  const activity = await IpActivity.findOne({ ip, date: today });

  if (!activity) {
    return { allowed: true, count: 0 };
  }

  if (activity.paperCount >= CONFIG.DAILY_PAPER_LIMIT) {
    return { allowed: false, count: activity.paperCount };
  }

  return { allowed: true, count: activity.paperCount };
};

// 레이트 리밋 위반 기록 및 자동 블랙리스트 체크
const recordViolation = async (ip) => {
  const today = getTodayDateString();
  const now = new Date();

  // 오늘 활동 기록 업데이트
  const activity = await IpActivity.findOneAndUpdate(
    { ip, date: today },
    {
      $inc: { rateLimitViolations: 1 },
      $set: { lastViolationAt: now }
    },
    { upsert: true, new: true }
  );

  // 자동 블랙리스트 조건 체크
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // 최근 5분 내 위반 횟수 계산 (현재 시간 기준으로 최근 위반 추적)
  // 단순화를 위해 오늘 총 위반 횟수로 판단
  const recentViolations = activity.rateLimitViolations;

  // 24시간 내 총 위반 횟수 (여러 날에 걸친 경우)
  const recentActivities = await IpActivity.find({
    ip,
    createdAt: { $gte: twentyFourHoursAgo }
  });
  const totalViolations24h = recentActivities.reduce((sum, a) => sum + a.rateLimitViolations, 0);

  // 자동 차단 조건
  let banDuration = 0;
  let banReason = null;

  if (totalViolations24h >= CONFIG.AUTO_BAN_VIOLATIONS_24H) {
    // 24시간 내 5회 이상 위반 → 7일 차단
    banDuration = CONFIG.AUTO_BAN_DURATION_LONG;
    banReason = 'AUTO_RATE_LIMIT';
  } else if (recentViolations >= CONFIG.AUTO_BAN_VIOLATIONS_5MIN) {
    // 오늘 3회 이상 위반 → 24시간 차단
    banDuration = CONFIG.AUTO_BAN_DURATION_SHORT;
    banReason = 'AUTO_RATE_LIMIT';
  }

  if (banDuration > 0) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + banDuration);

    await IpBlacklist.findOneAndUpdate(
      { ip },
      {
        ip,
        reason: banReason,
        description: `자동 차단: ${totalViolations24h}회 레이트 리밋 위반`,
        violationCount: totalViolations24h,
        expiresAt
      },
      { upsert: true }
    );

    console.log(`[AUTO-BAN] IP ${ip} 차단됨 - ${banDuration}시간, 사유: ${totalViolations24h}회 위반`);
  }
};

// 롤링페이퍼 생성 레이트 리밋 체크 (단기)
const checkPaperRateLimit = (ip) => {
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;
  const fiveMinutesAgo = now - 5 * 60 * 1000;

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { timestamps: [] });
  }

  const data = rateLimitStore.get(ip);

  // 오래된 타임스탬프 정리
  data.timestamps = data.timestamps.filter(ts => ts > fiveMinutesAgo);

  // 1분 내 요청 수 체크 (3개 이상이면 차단)
  const recentOneMin = data.timestamps.filter(ts => ts > oneMinuteAgo);
  if (recentOneMin.length >= 3) {
    return { allowed: false, error: ERROR_CODES.PAPER_RATE_LIMIT_1MIN };
  }

  // 5분 내 요청 수 체크 (6개 이상이면 차단)
  if (data.timestamps.length >= 6) {
    return { allowed: false, error: ERROR_CODES.PAPER_RATE_LIMIT_5MIN };
  }

  return { allowed: true };
};

// 레이트 리밋 기록 추가
const recordPaperRequest = (ip) => {
  const data = rateLimitStore.get(ip);
  data.timestamps.push(Date.now());
};

// 일일 생성 횟수 기록
const recordDailyPaper = async (ip) => {
  const today = getTodayDateString();

  await IpActivity.findOneAndUpdate(
    { ip, date: today },
    {
      $inc: { paperCount: 1 }
    },
    { upsert: true }
  );
};

const createUniqueSlug = async () => {
  let attempts = 0;

  while (attempts < CONFIG.MAX_SLUG_RETRY) {
    const slug = generateSlug();
    const existingPaper = await RollingPaper.findOne({ slug });

    if (!existingPaper) {
      return slug;
    }

    attempts++;
  }

  throw new Error('Failed to generate unique slug');
};

// POST /api/papers - Create new rolling paper
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    const clientIp = req.ip;

    // 1. 블랙리스트 체크 (최우선)
    const isBlacklisted = await checkBlacklist(clientIp);
    if (isBlacklisted) {
      return sendError(res, 403, ERROR_CODES.IP_BLACKLISTED);
    }

    // 2. 일일 제한 체크
    const dailyLimitResult = await checkDailyLimit(clientIp);
    if (!dailyLimitResult.allowed) {
      return sendError(res, 429, ERROR_CODES.DAILY_LIMIT_EXCEEDED);
    }

    // 3. 단기 레이트 리밋 체크
    const rateLimitResult = checkPaperRateLimit(clientIp);
    if (!rateLimitResult.allowed) {
      // 레이트 리밋 위반 기록 및 자동 블랙리스트 체크
      await recordViolation(clientIp);
      return sendError(res, 429, rateLimitResult.error);
    }

    if (title && title.length > CONFIG.MAX_TITLE_LENGTH) {
      return sendError(res, 400, ERROR_CODES.TITLE_TOO_LONG);
    }

    // 비속어 필터링 체크
    if (title && containsProfanity(title)) {
      return sendError(res, 400, ERROR_CODES.PROFANITY_DETECTED);
    }

    const slug = await createUniqueSlug();
    const theme = getRandomTheme();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt);
    expiresAt.setDate(expiresAt.getDate() + CONFIG.TTL_DAYS);

    const rollingPaper = new RollingPaper({
      slug,
      title: title || null,
      theme,
      creatorIp: clientIp, // IP 기록
      createdAt,
      expiresAt
    });

    await rollingPaper.save();

    // 성공 시 레이트 리밋 기록 (메모리)
    recordPaperRequest(clientIp);

    // 성공 시 일일 생성 횟수 기록 (DB)
    await recordDailyPaper(clientIp);

    // creatorToken 발급 (클라이언트에서 저장, DB에는 저장하지 않음)
    const creatorToken = generateCreatorToken();

    return res.status(201).json({
      success: true,
      data: {
        slug: rollingPaper.slug,
        title: rollingPaper.title,
        theme: rollingPaper.theme,
        expiresAt: rollingPaper.expiresAt,
        creatorToken
      }
    });
  } catch (error) {
    console.error('Error creating rolling paper:', error);
    return sendError(res, 500, ERROR_CODES.SERVER_ERROR);
  }
});

// GET /api/papers/:slug - Get rolling paper by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const rollingPaper = await RollingPaper.findOne({ slug });

    if (!rollingPaper) {
      return sendError(res, 404, ERROR_CODES.PAPER_NOT_FOUND);
    }

    const now = new Date();
    if (rollingPaper.expiresAt < now) {
      return sendError(res, 404, ERROR_CODES.PAPER_EXPIRED);
    }

    return res.status(200).json({
      success: true,
      data: {
        slug: rollingPaper.slug,
        title: rollingPaper.title,
        theme: rollingPaper.theme,
        expiresAt: rollingPaper.expiresAt,
        createdAt: rollingPaper.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching rolling paper:', error);
    return sendError(res, 500, ERROR_CODES.SERVER_ERROR);
  }
});

// GET /api/papers/:slug/messages - Get messages for a rolling paper
router.get('/:slug/messages', async (req, res) => {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const rollingPaper = await RollingPaper.findOne({ slug });

    if (!rollingPaper) {
      return sendError(res, 404, ERROR_CODES.PAPER_NOT_FOUND);
    }

    const now = new Date();
    if (rollingPaper.expiresAt < now) {
      return sendError(res, 404, ERROR_CODES.PAPER_EXPIRED);
    }

    // 총 메시지 수 조회
    const totalCount = await Message.countDocuments({ paperId: rollingPaper._id });

    // 페이징된 메시지 조회
    const messages = await Message.find({ paperId: rollingPaper._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('content createdAt');

    const hasMore = skip + messages.length < totalCount;

    return res.status(200).json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          totalCount,
          hasMore
        }
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return sendError(res, 500, ERROR_CODES.SERVER_ERROR);
  }
});

module.exports = router;
