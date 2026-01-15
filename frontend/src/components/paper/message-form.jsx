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
      className="w-full"
    >
      <div className="relative">
        <textarea
          value={content}
          onChange={handleChange}
          placeholder={MESSAGES.messagePlaceholder}
          rows={4}
          className={cn(
            'input-modern w-full resize-none',
            inputClass
          )}
          disabled={isLoading}
        />
        <span className="absolute right-4 bottom-4 text-sm text-gray-400">
          {content.length}/{LIMITS.messageMaxLength}
        </span>
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          type="submit"
          variant={buttonClass ? 'themed' : 'primary'}
          themedClass={buttonClass}
          isLoading={isLoading}
          disabled={!content.trim()}
          size="md"
        >
          보내기
        </Button>
      </div>
    </motion.form>
  );
};
