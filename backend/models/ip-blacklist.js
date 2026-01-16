'use strict';

const mongoose = require('mongoose');

/**
 * IP 블랙리스트 모델
 * - 자동 또는 수동으로 차단된 IP 관리
 * - 만료일이 지나면 자동 삭제됨
 */
const ipBlacklistSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    reason: {
        type: String,
        enum: ['AUTO_RATE_LIMIT', 'AUTO_DAILY_LIMIT', 'MANUAL'],
        required: true
    },
    description: {
        type: String,
        default: null
    },
    violationCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // TTL 인덱스: expiresAt 시점에 자동 삭제
    }
});

const IpBlacklist = mongoose.model('IpBlacklist', ipBlacklistSchema);

module.exports = IpBlacklist;
