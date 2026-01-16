'use strict';

const CONFIG = {
  SLUG_LENGTH: 8,
  TTL_DAYS: 10,
  MAX_TITLE_LENGTH: 40,
  MAX_CONTENT_LENGTH: 500,
  SLUG_CHARS: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  MAX_SLUG_RETRY: 10
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
