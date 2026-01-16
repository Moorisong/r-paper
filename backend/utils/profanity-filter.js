'use strict';

const Filter = require('badwords-ko');

const filter = new Filter();

/**
 * 비속어 포함 여부 검사
 * @param {string} text - 검사할 텍스트
 * @returns {boolean} - 비속어가 포함되어 있으면 true
 */
const containsProfanity = (text) => {
    if (!text || typeof text !== 'string') {
        return false;
    }

    // 원본과 필터링된 결과가 다르면 비속어 포함
    const cleaned = filter.clean(text);
    return cleaned !== text;
};

/**
 * 비속어를 필터링하여 반환 (별표 처리)
 * @param {string} text - 필터링할 텍스트
 * @returns {string} - 필터링된 텍스트
 */
const cleanProfanity = (text) => {
    if (!text || typeof text !== 'string') {
        return text;
    }

    return filter.clean(text);
};

/**
 * 커스텀 비속어 추가
 * @param {...string} words - 추가할 비속어들
 */
const addCustomWords = (...words) => {
    filter.addWords(...words);
};

module.exports = {
    containsProfanity,
    cleanProfanity,
    addCustomWords
};
