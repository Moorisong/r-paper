import { useState } from 'react';
import { motion } from 'framer-motion';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    try {
      await onSubmit(content);
      setContent('');
    } catch {
      // Error handled in hook
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= LIMITS.messageMaxLength) {
      setContent(value);
    }
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
            inputClass
          )}
          disabled={isLoading}
        />
        <span className="absolute right-4 bottom-4 text-xs text-gray-400 font-medium">
          {content.length}/{LIMITS.messageMaxLength}
        </span>
      </div>

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
