'use strict';

const express = require('express');
const router = express.Router();
const IpBlacklist = require('../models/ip-blacklist');
const IpActivity = require('../models/ip-activity');
const RollingPaper = require('../models/rolling-paper');
const { ERROR_CODES, CONFIG } = require('../constants');

// Admin API 키 인증 미들웨어
const adminAuth = (req, res, next) => {
    const apiKey = req.headers['x-admin-api-key'];

    if (!apiKey || apiKey !== CONFIG.ADMIN_API_KEY) {
        return res.status(401).json({
            success: false,
            error: ERROR_CODES.ADMIN_UNAUTHORIZED
        });
    }

    next();
};

// 모든 admin 라우트에 인증 적용
router.use(adminAuth);

// GET /api/admin/blacklist - 블랙리스트 조회
router.get('/blacklist', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const blacklist = await IpBlacklist.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalCount = await IpBlacklist.countDocuments();

        return res.json({
            success: true,
            data: {
                blacklist,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalCount,
                    hasMore: skip + blacklist.length < totalCount
                }
            }
        });
    } catch (error) {
        console.error('Error fetching blacklist:', error);
        return res.status(500).json({
            success: false,
            error: ERROR_CODES.SERVER_ERROR
        });
    }
});

// POST /api/admin/blacklist - IP 수동 차단
router.post('/blacklist', async (req, res) => {
    try {
        const { ip, description, durationHours = 24 } = req.body;

        if (!ip) {
            return res.status(400).json({
                success: false,
                error: { code: 'IP_REQUIRED', message: 'IP 주소가 필요합니다' }
            });
        }

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + parseInt(durationHours));

        // 이미 존재하면 업데이트, 없으면 생성
        const blacklistEntry = await IpBlacklist.findOneAndUpdate(
            { ip },
            {
                ip,
                reason: 'MANUAL',
                description: description || '관리자에 의한 수동 차단',
                expiresAt
            },
            { upsert: true, new: true }
        );

        return res.status(201).json({
            success: true,
            data: blacklistEntry
        });
    } catch (error) {
        console.error('Error adding to blacklist:', error);
        return res.status(500).json({
            success: false,
            error: ERROR_CODES.SERVER_ERROR
        });
    }
});

// DELETE /api/admin/blacklist/:ip - IP 차단 해제
router.delete('/blacklist/:ip', async (req, res) => {
    try {
        const { ip } = req.params;

        const result = await IpBlacklist.findOneAndDelete({ ip });

        if (!result) {
            return res.status(404).json({
                success: false,
                error: { code: 'IP_NOT_FOUND', message: '해당 IP가 블랙리스트에 없습니다' }
            });
        }

        return res.json({
            success: true,
            message: `${ip} 차단이 해제되었습니다`
        });
    } catch (error) {
        console.error('Error removing from blacklist:', error);
        return res.status(500).json({
            success: false,
            error: ERROR_CODES.SERVER_ERROR
        });
    }
});

// GET /api/admin/stats - 통계 조회
router.get('/stats', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // 오늘 활동 통계
        const todayActivities = await IpActivity.find({ date: today });
        const totalPapersToday = todayActivities.reduce((sum, a) => sum + a.paperCount, 0);
        const totalViolationsToday = todayActivities.reduce((sum, a) => sum + a.rateLimitViolations, 0);
        const uniqueIpsToday = todayActivities.length;

        // 현재 블랙리스트 수
        const blacklistCount = await IpBlacklist.countDocuments();

        // 최근 위반자 (오늘 위반 1회 이상)
        const recentViolators = await IpActivity.find({
            date: today,
            rateLimitViolations: { $gte: 1 }
        }).sort({ rateLimitViolations: -1 }).limit(10);

        // 헤비 유저 (오늘 5개 이상 생성)
        const heavyUsers = await IpActivity.find({
            date: today,
            paperCount: { $gte: 5 }
        }).sort({ paperCount: -1 }).limit(10);

        return res.json({
            success: true,
            data: {
                today: {
                    totalPapers: totalPapersToday,
                    totalViolations: totalViolationsToday,
                    uniqueIps: uniqueIpsToday
                },
                blacklistCount,
                recentViolators,
                heavyUsers
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return res.status(500).json({
            success: false,
            error: ERROR_CODES.SERVER_ERROR
        });
    }
});

// GET /api/admin/ip/:ip - 특정 IP 상세 정보
router.get('/ip/:ip', async (req, res) => {
    try {
        const { ip } = req.params;

        // 블랙리스트 상태
        const blacklistEntry = await IpBlacklist.findOne({ ip });

        // 최근 7일 활동 기록
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const dateStr = sevenDaysAgo.toISOString().split('T')[0];

        const recentActivity = await IpActivity.find({
            ip,
            date: { $gte: dateStr }
        }).sort({ date: -1 });

        // 이 IP가 생성한 롤링페이퍼 수
        const paperCount = await RollingPaper.countDocuments({ creatorIp: ip });

        return res.json({
            success: true,
            data: {
                ip,
                isBlacklisted: !!blacklistEntry,
                blacklistEntry,
                recentActivity,
                totalPapersCreated: paperCount
            }
        });
    } catch (error) {
        console.error('Error fetching IP info:', error);
        return res.status(500).json({
            success: false,
            error: ERROR_CODES.SERVER_ERROR
        });
    }
});

module.exports = router;
