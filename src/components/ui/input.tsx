import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'file:text-foreground flex h-9 w-full rounded-md border border-line bg-input px-3 py-1 text-base text-secondary shadow-sm outline-none ring-0 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-content focus:border-info focus:bg-transparent focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
