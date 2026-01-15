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
      setMessages((prev) => [...prev, response.data.data.message]);
      return response.data.data.message;
    } catch (err) {
      const errorMessage = err.response?.data?.message || '메시지 전송에 실패했습니다.';
      setError(errorMessage);
      throw err;
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
