'use strict';

const mongoose = require('mongoose');
const { CONFIG } = require('../constants');

const messageSchema = new mongoose.Schema({
  paperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RollingPaper',
    required: true,
    index: true
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

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
