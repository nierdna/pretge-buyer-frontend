import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-2xl  px-2 py-0.5 pt-1 shadow text-xs font-normal transition-colors focus:outline-none ring-0',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-primary',
        success: 'bg-success text-secondary',
        danger: 'bg-danger text-secondary',
        'danger-outline': 'text-danger bg-danger/30',
        info: 'bg-info text-secondary',
        warning: 'bg-warning text-secondary',
        outline:
          'border bg-primary-foreground border-line text-secondary hover:bg-primary-hover disabled:bg-transparent',
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
