'use strict';

const mongoose = require('mongoose');
const { CONFIG } = require('../constants');

const rollingPaperSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
    minlength: CONFIG.SLUG_LENGTH,
    maxlength: CONFIG.SLUG_LENGTH
  },
  title: {
    type: String,
    maxlength: CONFIG.MAX_TITLE_LENGTH,
    default: null
  },
  theme: {
    type: String,
    required: true
  },
  creatorIp: {
    type: String,
    default: null,
    index: true // IP별 생성 패턴 분석용
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }
  }
});

rollingPaperSchema.pre('save', function () {
  if (!this.expiresAt) {
    const expirationDate = new Date(this.createdAt);
    expirationDate.setDate(expirationDate.getDate() + CONFIG.TTL_DAYS);
    this.expiresAt = expirationDate;
  }
});

const RollingPaper = mongoose.model('RollingPaper', rollingPaperSchema);

module.exports = RollingPaper;
