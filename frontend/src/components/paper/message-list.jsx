import { motion } from 'framer-motion';
import { MessageCard } from './message-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { MESSAGES } from '@/constants';
import { cn } from '@/lib/utils';

export const MessageList = ({
  messages = [],
  isLoading = false,
  cardClass = '',
  textClass = '',
  accentClass = '',
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-6xl mb-4"
        >
          {/* Empty state emoji */}
        </motion.div>
        <p className={cn(
          'text-center text-lg',
          accentClass || 'text-gray-500'
        )}>
          {MESSAGES.noMessages}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <MessageCard
          key={message._id || index}
          message={message}
          index={index}
          cardClass={cardClass}
          textClass={textClass}
        />
      ))}
    </div>
  );
};
