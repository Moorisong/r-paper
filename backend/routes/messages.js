'use strict';

const express = require('express');
const router = express.Router();
const RollingPaper = require('../models/rolling-paper');
const Message = require('../models/message');
const { ERROR_CODES, CONFIG } = require('../constants');

const sendError = (res, statusCode, errorCode) => {
  return res.status(statusCode).json({
    success: false,
    error: errorCode
  });
};

// POST /api/messages - Create new message
router.post('/', async (req, res) => {
  try {
    const { slug, content, creatorToken } = req.body;

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
      content: content.trim(),
      createdAt: new Date()
    });

    await message.save();

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
