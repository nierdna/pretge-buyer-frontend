import { useState } from 'react';

export interface useCopyProps {
  timeout?: number;
}

export function useCopy(params?: useCopyProps) {
  const timeout = params?.timeout || 3000;
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = (value: string) => {
    if (typeof window === 'undefined' || !navigator.clipboard?.writeText) {
      return;
    }

    if (!value) {
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    });
  };

  return { isCopied, handleCopy };
}
