'use strict';

const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const RollingPaper = require('../models/rolling-paper');
const Message = require('../models/message');
const { generateSlug } = require('../utils/slug-generator');
const { ERROR_CODES, CONFIG, THEMES } = require('../constants');

// 인메모리 레이트 리밋 저장소
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

// 롤링페이퍼 생성 레이트 리밋 체크
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

    // 레이트 리밋 체크
    const rateLimitResult = checkPaperRateLimit(clientIp);
    if (!rateLimitResult.allowed) {
      return sendError(res, 429, rateLimitResult.error);
    }

    if (title && title.length > CONFIG.MAX_TITLE_LENGTH) {
      return sendError(res, 400, ERROR_CODES.TITLE_TOO_LONG);
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
      createdAt,
      expiresAt
    });

    await rollingPaper.save();

    // 성공 시 레이트 리밋 기록
    recordPaperRequest(clientIp);

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
