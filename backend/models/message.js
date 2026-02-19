'use strict';

const mongoose = require('mongoose');
const { CONFIG } = require('../constants');

const RollingPaper = require('./rolling-paper');

const messageSchema = new mongoose.Schema({
  paperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RollingPaper',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: CONFIG.MAX_CONTENT_LENGTH
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

// 페이징 쿼리 성능을 위한 복합 인덱스
messageSchema.index({ paperId: 1, createdAt: -1 });

messageSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('paperId')) {
    try {
      const paper = await RollingPaper.findById(this.paperId);
      if (!paper) {
        throw new Error('RollingPaper not found');
      }
      // expiresAt이 없는 구형 paper는 createdAt 기준으로 계산
      if (paper.expiresAt) {
        this.expiresAt = paper.expiresAt;
      } else {
        const expirationDate = new Date(paper.createdAt);
        expirationDate.setDate(expirationDate.getDate() + CONFIG.TTL_DAYS);
        this.expiresAt = expirationDate;
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

