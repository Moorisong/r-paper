import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef(({
  className = '',
  label,
  error,
  maxLength,
  currentLength,
  themedClass = '',
  ...props
}, ref) => {
  const baseStyles = 'w-full px-4 py-3 rounded-2xl border-2 bg-white/80 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-4 placeholder:text-gray-400';

  const defaultStyles = 'border-gray-200 focus:border-purple-400 focus:ring-purple-400/20';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          className={cn(
            baseStyles,
            themedClass || defaultStyles,
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
            className
          )}
          maxLength={maxLength}
          {...props}
        />
        {maxLength && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {currentLength || 0}/{maxLength}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
