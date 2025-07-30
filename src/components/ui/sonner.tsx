'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-primary-foreground group-[.toaster]:text-foreground group-[.toaster]:border-line group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-content',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-content group-[.toast]:text-content',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
