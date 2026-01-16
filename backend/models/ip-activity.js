'use strict';

const mongoose = require('mongoose');

/**
 * IP 활동 기록 모델
 * - 일일 롤링페이퍼 생성 제한 추적
 * - 레이트 리밋 위반 횟수 추적 (자동 블랙리스트용)
 */
const ipActivitySchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true,
        index: true
    },
    date: {
        type: String, // YYYY-MM-DD 형식
        required: true,
        index: true
    },
    paperCount: {
        type: Number,
        default: 0
    },
    rateLimitViolations: {
        type: Number,
        default: 0
    },
    lastViolationAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 30 // 30일 후 자동 삭제 (TTL)
    }
});

// 복합 인덱스: IP + 날짜로 빠른 조회
ipActivitySchema.index({ ip: 1, date: 1 }, { unique: true });

const IpActivity = mongoose.model('IpActivity', ipActivitySchema);

module.exports = IpActivity;
