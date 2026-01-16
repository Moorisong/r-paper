import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paperApi } from '@/services/api';
import { ROUTES } from '@/constants';

export const useCreatePaper = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const createPaper = async (title = '') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await paperApi.create(title || undefined);
      const { slug, creatorToken } = response.data.data;

      // creatorToken을 LocalStorage에 저장 (slug별로 저장)
      if (creatorToken) {
        localStorage.setItem(`creator_token_${slug}`, creatorToken);
      }

      navigate(`${ROUTES.paperView(slug)}?new=true`);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || '롤링페이퍼 생성에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPaper,
    isLoading,
    error,
  };
};
