import axios from 'axios';
import { API_BASE, API_ENDPOINTS } from '@/constants';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const paperApi = {
  create: (title) => apiClient.post(API_ENDPOINTS.papers.create, { title }),
  get: (slug) => apiClient.get(API_ENDPOINTS.papers.get(slug)),
  getMessages: (slug) => apiClient.get(API_ENDPOINTS.papers.messages(slug)),
};

export const messageApi = {
  create: (slug, content) => apiClient.post(API_ENDPOINTS.messages.create, { slug, content }),
};
