'use strict';

const express = require('express');
const router = express.Router();
const RollingPaper = require('../models/rolling-paper');
const Message = require('../models/message');
const { containsProfanity } = require('../utils/profanity-filter');
const { ERROR_CODES, CONFIG } = require('../constants');

// 인메모리 레이트 리밋 저장소
const rateLimitStore = new Map();

// 레이트 리밋 정리 (10분마다 오래된 데이터 삭제)
setInterval(() => {
  const now = Date.now();
  const fiveMinutesAgo = now - 5 * 60 * 1000;
  for (const [ip, data] of rateLimitStore.entries()) {
    // 5분 이상 지난 요청 기록 삭제
    data.timestamps = data.timestamps.filter(ts => ts > fiveMinutesAgo);
    if (data.timestamps.length === 0) {
      rateLimitStore.delete(ip);
    }
  }
}, 10 * 60 * 1000);

const sendError = (res, statusCode, errorCode) => {
  return res.status(statusCode).json({
    success: false,
    error: errorCode
  });
};

// 메시지 레이트 리밋 체크
const checkMessageRateLimit = (ip) => {
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;
  const fiveMinutesAgo = now - 5 * 60 * 1000;

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { timestamps: [], lastContent: null });
  }

  const data = rateLimitStore.get(ip);

  // 오래된 타임스탬프 정리
  data.timestamps = data.timestamps.filter(ts => ts > fiveMinutesAgo);

  // 1분 내 요청 수 체크
  const recentOneMin = data.timestamps.filter(ts => ts > oneMinuteAgo);
  if (recentOneMin.length >= 3) {
    return { allowed: false, error: ERROR_CODES.MESSAGE_RATE_LIMIT_1MIN };
  }

  // 5분 내 요청 수 체크
  if (data.timestamps.length >= 5) {
    return { allowed: false, error: ERROR_CODES.MESSAGE_RATE_LIMIT_5MIN };
  }

  return { allowed: true };
};

// 레이트 리밋 기록 추가
const recordRequest = (ip, content) => {
  const data = rateLimitStore.get(ip);
  data.timestamps.push(Date.now());
  data.lastContent = content;
};

// 중복 내용 체크
const checkDuplicateContent = (ip, content) => {
  if (!rateLimitStore.has(ip)) {
    return { allowed: true };
  }

  const data = rateLimitStore.get(ip);
  if (data.lastContent && data.lastContent === content) {
    return { allowed: false, error: ERROR_CODES.DUPLICATE_CONTENT };
  }

  return { allowed: true };
};

// POST /api/messages - Create new message
router.post('/', async (req, res) => {
  try {
    const { slug, content, creatorToken } = req.body;
    const clientIp = req.ip;

    // 생성자 메시지 작성 제한: creatorToken이 포함된 경우 거부
    if (creatorToken) {
      return sendError(res, 403, ERROR_CODES.CREATOR_NOT_ALLOWED);
    }

    if (!slug) {
      return sendError(res, 400, ERROR_CODES.SLUG_REQUIRED);
    }

    if (!content || content.trim().length === 0) {
      return sendError(res, 400, ERROR_CODES.CONTENT_REQUIRED);
    }

    if (content.length > CONFIG.MAX_CONTENT_LENGTH) {
      return sendError(res, 400, ERROR_CODES.CONTENT_TOO_LONG);
    }

    const trimmedContent = content.trim();

    // 비속어 필터링 체크
    if (containsProfanity(trimmedContent)) {
      return sendError(res, 400, ERROR_CODES.PROFANITY_DETECTED);
    }

    // 레이트 리밋 체크
    const rateLimitResult = checkMessageRateLimit(clientIp);
    if (!rateLimitResult.allowed) {
      return sendError(res, 429, rateLimitResult.error);
    }

    // 중복 내용 체크
    const duplicateResult = checkDuplicateContent(clientIp, trimmedContent);
    if (!duplicateResult.allowed) {
      return sendError(res, 400, duplicateResult.error);
    }

    const rollingPaper = await RollingPaper.findOne({ slug });

    if (!rollingPaper) {
      return sendError(res, 404, ERROR_CODES.PAPER_NOT_FOUND);
    }

    const now = new Date();
    if (rollingPaper.expiresAt < now) {
      return sendError(res, 404, ERROR_CODES.PAPER_EXPIRED);
    }

    const message = new Message({
      paperId: rollingPaper._id,
      content: trimmedContent,
      createdAt: new Date()
    });

    await message.save();

    // 성공 시 레이트 리밋 기록
    recordRequest(clientIp, trimmedContent);

    return res.status(201).json({
      success: true,
      data: {
        message: {
          _id: message._id,
          content: message.content,
          createdAt: message.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return sendError(res, 500, ERROR_CODES.SERVER_ERROR);
  }
});

module.exports = router;

