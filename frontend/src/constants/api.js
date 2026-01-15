export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  papers: {
    create: '/api/papers',
    get: (slug) => `/api/papers/${slug}`,
    messages: (slug) => `/api/papers/${slug}/messages`,
  },
  messages: {
    create: '/api/messages',
  },
};
