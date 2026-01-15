import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const cardColors = [
  'card-purple',
  'card-pink',
  'card-blue',
  'card-green',
  'card-orange',
  'card-teal',
];

export const MessageCard = ({
  message,
  index = 0,
  cardClass = '',
  textClass = '',
}) => {
  const colorClass = cardColors[index % cardColors.length];

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: 'easeOut',
      }}
      className={cn(
        'message-card p-6 rounded-2xl',
        cardClass || colorClass
      )}
    >
      <p className={cn(
        'text-base leading-relaxed whitespace-pre-wrap break-words',
        textClass || 'text-gray-800'
      )}>
        {message.content}
      </p>
      <p className="mt-4 text-xs text-gray-400 text-right">
        {formatDate(message.createdAt)}
      </p>
    </motion.div>
  );
};
