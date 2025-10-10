import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-4xl whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary-text text-inverse shadow hover:bg-primary-text/90',
        primary: 'bg-primary text-inverse shadow hover:bg-primary/90',

        outline: 'border border-border bg-card shadow-sm hover:bg-foreground/60',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'text-primary-text',
        link: 'text-primary underline-offset-4 hover:underline',
        success: 'bg-success text-inverse hover:bg-success/90',
        danger: 'bg-danger text-inverse hover:bg-danger/90',
      },
      size: {
        default: 'h-9 px-4 text-sm',
        sm: 'h-8 rounded-4xl px-3 text-xs',
        lg: 'h-10 rounded-4xl px-8 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
