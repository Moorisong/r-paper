'use strict';

const CONFIG = {
  SLUG_LENGTH: 8,
  TTL_DAYS: 10,
  MAX_TITLE_LENGTH: 40,
  MAX_CONTENT_LENGTH: 500,
  SLUG_CHARS: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  MAX_SLUG_RETRY: 10,

  // IP 제한 관련 설정
  DAILY_PAPER_LIMIT: 10, // 하루 최대 롤링페이퍼 생성 수

  // 자동 블랙리스트 기준
  AUTO_BAN_VIOLATIONS_5MIN: 3,   // 5분 내 N회 위반 시 차단
  AUTO_BAN_VIOLATIONS_24H: 5,    // 24시간 내 N회 위반 시 장기 차단
  AUTO_BAN_DURATION_SHORT: 24,   // 단기 차단 시간 (시간 단위)
  AUTO_BAN_DURATION_LONG: 168,   // 장기 차단 시간 (시간 단위, 7일)

  // Admin API 키 (환경변수에서 가져오거나 기본값)
  ADMIN_API_KEY: process.env.ADMIN_API_KEY || 'r-paper-admin-secret-key-2024'
};

const THEMES = [
  'theme_basic'
];

const API_ROUTES = {
  BASE: '/api',
  PAPERS: '/papers',
  MESSAGES: '/messages',
  HEALTH: '/health'
};

module.exports = {
  CONFIG,
  THEMES,
  API_ROUTES
};
