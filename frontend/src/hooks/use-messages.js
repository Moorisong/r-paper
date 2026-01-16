import { useState, useEffect, useCallback } from 'react';
import { paperApi, messageApi } from '@/services/api';

export const useMessages = (slug) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    if (!slug) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await paperApi.getMessages(slug);
      setMessages(response.data.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || '메시지를 불러올 수 없습니다.';
      setError(errorMessage);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  const sendMessage = async (content) => {
    if (!slug || !content.trim()) return;

    setIsSending(true);
    setError(null);

    try {
      const response = await messageApi.create(slug, content);
      // 최신 메시지가 맨 위로 오도록 배열 앞에 추가
      setMessages((prev) => [response.data.data.message, ...prev]);
      return response.data.data.message;
    } catch (err) {
      // 백엔드 에러 구조: { error: { code, message } }
      const errorMessage = err.response?.data?.error?.message || '메시지 전송에 실패했습니다.';
      setError(errorMessage);
      // 에러 메시지를 포함한 에러 객체로 다시 throw
      const errorWithMessage = new Error(errorMessage);
      errorWithMessage.originalError = err;
      throw errorWithMessage;
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
    refetch: fetchMessages,
  };
};
