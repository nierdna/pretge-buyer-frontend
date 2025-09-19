'use client';

import { ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-primary p-0 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-primary/90"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6 text-black" />
        </Button>
      )}
    </>
  );
}
