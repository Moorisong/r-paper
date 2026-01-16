'use strict';

const { CONFIG } = require('../constants');

const generateSlug = () => {
  const { SLUG_LENGTH, SLUG_CHARS } = CONFIG;
  let slug = '';

  for (let i = 0; i < SLUG_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * SLUG_CHARS.length);
    slug += SLUG_CHARS[randomIndex];
  }

  return slug;
};

module.exports = {
  generateSlug
};
