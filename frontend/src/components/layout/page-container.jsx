import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const PageContainer = ({
  children,
  className = '',
  backgroundClass = '',
  centered = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'min-h-screen w-full',
        backgroundClass || 'bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100',
        className
      )}
    >
      <div
        className={cn(
          'min-h-screen w-full px-4 py-8',
          centered && 'flex flex-col items-center justify-center'
        )}
      >
        {children}
      </div>
    </motion.div>
  );
};
