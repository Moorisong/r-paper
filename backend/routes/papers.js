'use strict';

const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const RollingPaper = require('../models/rolling-paper');
const Message = require('../models/message');
const { generateSlug } = require('../utils/slug-generator');
const { ERROR_CODES, CONFIG, THEMES } = require('../constants');

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

    const rollingPaper = await RollingPaper.findOne({ slug });

    if (!rollingPaper) {
      return sendError(res, 404, ERROR_CODES.PAPER_NOT_FOUND);
    }

    const now = new Date();
    if (rollingPaper.expiresAt < now) {
      return sendError(res, 404, ERROR_CODES.PAPER_EXPIRED);
    }

    const messages = await Message.find({ paperId: rollingPaper._id })
      .sort({ createdAt: -1 })
      .select('content createdAt');

    return res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return sendError(res, 500, ERROR_CODES.SERVER_ERROR);
  }
});

module.exports = router;
