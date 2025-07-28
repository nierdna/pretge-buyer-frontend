import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-2xl px-2 py-0.5 pt-0.5 shadow text-xs font-normal transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-primary border border-secondary/20',
        success: 'bg-success text-secondary border border-success/20',
        danger: 'bg-danger text-secondary border border-danger/20',
        'danger-outline': 'text-danger bg-danger/30 border border-danger/30',
        info: 'bg-info text-secondary border border-info/20',
        warning: 'bg-warning text-secondary border border-warning/20',
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
