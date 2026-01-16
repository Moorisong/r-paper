'use strict';

const mongoose = require('mongoose');
const { CONFIG } = require('../constants');

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
  }
});

// 페이징 쿼리 성능을 위한 복합 인덱스
messageSchema.index({ paperId: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

