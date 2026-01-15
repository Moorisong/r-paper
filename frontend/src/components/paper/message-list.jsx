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
  gridClass = '',
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
        className="flex flex-col items-center justify-center py-8 px-4"
        style={{ marginTop: '5px' }}
      >
        <p className={cn(
          'text-center text-sm font-medium text-gray-500',
          accentClass
        )}>
          {MESSAGES.noMessages}
        </p>
      </motion.div>
    );
  }

  return (
    <div className={cn("grid w-[90%] mx-auto place-items-center justify-center", gridClass || "grid-cols-1 sm:grid-cols-2 gap-5")}>
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
