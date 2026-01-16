'use strict';

const ERROR_CODES = {
  PAPER_NOT_FOUND: {
    code: 'PAPER_NOT_FOUND',
    message: '롤링페이퍼를 찾을 수 없습니다'
  },
  PAPER_EXPIRED: {
    code: 'PAPER_EXPIRED',
    message: '만료된 롤링페이퍼입니다'
  },
  INVALID_INPUT: {
    code: 'INVALID_INPUT',
    message: '입력값이 올바르지 않습니다'
  },
  TITLE_TOO_LONG: {
    code: 'TITLE_TOO_LONG',
    message: '제목은 40자를 초과할 수 없습니다'
  },
  CONTENT_TOO_LONG: {
    code: 'CONTENT_TOO_LONG',
    message: '내용은 500자를 초과할 수 없습니다'
  },
  CONTENT_REQUIRED: {
    code: 'CONTENT_REQUIRED',
    message: '내용을 입력해주세요'
  },
  SLUG_REQUIRED: {
    code: 'SLUG_REQUIRED',
    message: 'slug를 입력해주세요'
  },
  SERVER_ERROR: {
    code: 'SERVER_ERROR',
    message: '서버 오류가 발생했습니다'
  },
  RATE_LIMIT_EXCEEDED: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요'
  },
  CREATOR_NOT_ALLOWED: {
    code: 'CREATOR_NOT_ALLOWED',
    message: '롤링페이퍼 생성자는 메시지를 작성할 수 없습니다'
  },
  MESSAGE_RATE_LIMIT_1MIN: {
    code: 'MESSAGE_RATE_LIMIT_1MIN',
    message: '1분에 3개까지만 메시지를 작성할 수 있습니다. 잠시 후 다시 시도해주세요'
  },
  MESSAGE_RATE_LIMIT_5MIN: {
    code: 'MESSAGE_RATE_LIMIT_5MIN',
    message: '5분에 5개까지만 메시지를 작성할 수 있습니다. 잠시 후 다시 시도해주세요'
  },
  DUPLICATE_CONTENT: {
    code: 'DUPLICATE_CONTENT',
    message: '동일한 내용의 메시지는 작성할 수 없습니다'
  },
  PAPER_RATE_LIMIT_1MIN: {
    code: 'PAPER_RATE_LIMIT_1MIN',
    message: '1분에 3개까지만 롤링페이퍼를 만들 수 있습니다. 잠시 후 다시 시도해주세요'
  },
  PAPER_RATE_LIMIT_5MIN: {
    code: 'PAPER_RATE_LIMIT_5MIN',
    message: '5분에 6개까지만 롤링페이퍼를 만들 수 있습니다. 잠시 후 다시 시도해주세요'
  },
  PROFANITY_DETECTED: {
    code: 'PROFANITY_DETECTED',
    message: '부적절한 표현이 포함되어 있습니다'
  }
};

module.exports = ERROR_CODES;
