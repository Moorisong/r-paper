import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LIMITS, MESSAGES } from '@/constants';

export const MessageForm = ({
  onSubmit,
  isLoading = false,
  buttonClass = '',
  inputClass = '',
}) => {
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    setErrorMessage('');

    try {
      await onSubmit(content);
      setContent('');
    } catch (err) {
      // 에러 메시지 표시
      setErrorMessage(err.message || '메시지 전송에 실패했습니다.');
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    // 붙여넣기 시에도 500자까지만 잘라서 입력
    setContent(value.slice(0, LIMITS.messageMaxLength));
    // 입력 시 에러 메시지 초기화
    if (errorMessage) setErrorMessage('');
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="w-full flex flex-col"
      style={{ gap: '20px' }}
    >
      <div className="relative">
        <textarea
          value={content}
          onChange={handleChange}
          placeholder={MESSAGES.messagePlaceholder}
          rows={5}
          className={cn(
            'input-modern w-full resize-none pr-16',
            inputClass,
            errorMessage && 'border-red-300 focus:border-red-400 focus:ring-red-100'
          )}
          disabled={isLoading}
        />
        <span className="absolute right-4 bottom-4 text-xs text-gray-400 font-medium">
          {content.length}/{LIMITS.messageMaxLength}
        </span>
      </div>

      {/* 에러 메시지 표시 */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium"
          >
            ⚠️ {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        variant={buttonClass ? 'themed' : 'primary'}
        themedClass={buttonClass}
        isLoading={isLoading}
        disabled={!content.trim()}
        size="lg"
        className="w-full"
      >
        💌 메시지 보내기
      </Button>
    </motion.form>
  );
};

