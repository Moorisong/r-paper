import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const MessageCard = ({
  message,
  index = 0,
  cardClass = '',
  textClass = '',
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={cn(
        'p-5 rounded-3xl border shadow-lg transition-shadow duration-200 hover:shadow-xl',
        cardClass || 'bg-white/80 backdrop-blur-sm border-pink-200'
      )}
    >
      <p className={cn(
        'text-base leading-relaxed whitespace-pre-wrap break-words',
        textClass || 'text-gray-700'
      )}>
        {message.content}
      </p>
      <p className="mt-3 text-xs text-gray-400 text-right">
        {formatDate(message.createdAt)}
      </p>
    </motion.div>
  );
};
