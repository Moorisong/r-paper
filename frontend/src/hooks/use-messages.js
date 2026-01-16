import { useState, useEffect, useCallback } from 'react';
import { paperApi, messageApi } from '@/services/api';

const MESSAGES_PER_PAGE = 30;

export const useMessages = (slug) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchMessages = useCallback(async (pageNum = 1, append = false) => {
    if (!slug) return;

    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await paperApi.getMessages(slug, pageNum, MESSAGES_PER_PAGE);
      const { messages: newMessages, pagination } = response.data.data;

      if (append) {
        setMessages((prev) => [...prev, ...newMessages]);
      } else {
        setMessages(newMessages);
      }

      setPage(pagination.page);
      setHasMore(pagination.hasMore);
      setTotalCount(pagination.totalCount);
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || '메시지를 불러올 수 없습니다.';
      setError(errorMessage);
      if (!append) {
        setMessages([]);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [slug]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchMessages(page + 1, true);
    }
  }, [fetchMessages, page, hasMore, isLoadingMore]);

  const sendMessage = async (content) => {
    if (!slug || !content.trim()) return;

    setIsSending(true);
    setError(null);

    try {
      const response = await messageApi.create(slug, content);
      // 최신 메시지가 맨 위로 오도록 배열 앞에 추가
      setMessages((prev) => [response.data.data.message, ...prev]);
      setTotalCount((prev) => prev + 1);
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
    fetchMessages(1, false);
  }, [fetchMessages]);

  return {
    messages,
    isLoading,
    isLoadingMore,
    isSending,
    error,
    hasMore,
    totalCount,
    sendMessage,
    loadMore,
    refetch: () => fetchMessages(1, false),
  };
};

