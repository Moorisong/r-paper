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
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          className={cn(
            'input-modern w-full',
            themedClass,
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
            className
          )}
          maxLength={maxLength}
          {...props}
        />
        {maxLength && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            {currentLength || 0}/{maxLength}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
