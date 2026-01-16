import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const LoadingSpinner = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <motion.div
        className={cn(
          'relative',
          sizes[size]
        )}
      >
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-400 border-r-purple-400"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.15,
            }}
            style={{
              scale: 1 - i * 0.15,
              opacity: 1 - i * 0.2,
            }}
          />
        ))}
        <motion.div
          className="absolute inset-2 rounded-full bg-gradient-to-br from-pink-200 to-purple-200"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </div>
  );
};
