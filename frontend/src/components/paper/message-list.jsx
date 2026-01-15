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
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 px-4"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4"
        >
          <span className="text-3xl">💭</span>
        </motion.div>
        <p className={cn(
          'text-center text-lg font-bold text-gray-600',
          accentClass
        )}>
          {MESSAGES.noMessages}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          첫 번째 메시지를 남겨보세요
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
