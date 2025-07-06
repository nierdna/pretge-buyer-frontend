import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border border-opensea-darkBorder px-2.5 py-0.5 text-xs font-semibold transition-colors focus:border-opensea-blue disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-opensea-error transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-opensea-blue text-white',
        secondary: 'border-transparent bg-opensea-darkBlue text-white',
        destructive: 'border-transparent bg-opensea-error text-white bg-opensea-error/60',
        outline: 'text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
