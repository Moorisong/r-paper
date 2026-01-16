import { useState, useEffect, useCallback } from 'react';
import { paperApi } from '@/services/api';

export const usePaper = (slug) => {
  const [paper, setPaper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPaper = useCallback(async () => {
    if (!slug) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await paperApi.get(slug);
      setPaper(response.data.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || '롤링페이퍼를 불러올 수 없습니다.';
      setError(errorMessage);
      setPaper(null);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPaper();
  }, [fetchPaper]);

  return {
    paper,
    isLoading,
    error,
    refetch: fetchPaper,
  };
};
