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
        backgroundClass
      )}
      style={{ background: '#f9fafb' }}
    >
      <div
        className={cn(
          'relative min-h-screen w-full py-12 sm:py-20',
          centered && 'flex flex-col items-center justify-center',
          className
        )}
        style={{ paddingLeft: '20px', paddingRight: '20px' }}
      >
        {children}
      </div>
    </motion.div>
  );
};
