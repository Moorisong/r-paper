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
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      className={cn(
        'relative bg-white border border-gray-100 px-10 rounded-2xl shadow-sm hover:shadow transition-all duration-300 hover:-translate-y-1 w-full',
        cardClass
      )}
      style={{ paddingTop: '10px', paddingBottom: '10px' }}
    >
      <p
        className={cn(
          'text-[13px] leading-relaxed whitespace-pre-wrap break-words font-medium text-gray-700',
          textClass
        )}
        style={{ paddingLeft: '10px' }}
      >
        {message.content}
      </p>

      <div
        className="mt-6 pt-4 flex justify-end"
        style={{ paddingRight: '10px' }}
      >
        <span className="text-xs font-medium text-gray-400">
          {formatDate(message.createdAt)}
        </span>
      </div>
    </motion.div>
  );
};
