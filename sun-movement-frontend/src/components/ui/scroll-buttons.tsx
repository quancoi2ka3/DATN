"use client";

import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ScrollButtons() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      // Show buttons if scrolled more than 300px
      setIsVisible(scrolled > 300);
      
      // Check if near bottom (within 100px)
      setIsAtBottom(scrolled >= maxScroll - 100);
    };

    window.addEventListener('scroll', toggleVisibility);
    
    // Check initial state
    toggleVisibility();
    
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed right-6 bottom-20 z-40 flex flex-col gap-2">
      {/* Scroll to Top Button */}
      <Button
        onClick={scrollToTop}
        size="sm"
        className={cn(
          "h-12 w-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
          "bg-slate-800 hover:bg-slate-900 text-white",
          "border-2 border-white dark:border-gray-700"
        )}
        title="Lên đầu trang"
      >
        <ChevronUp className="h-5 w-5" />
      </Button>

      {/* Scroll to Bottom Button - only show if not at bottom */}
      {!isAtBottom && (
        <Button
          onClick={scrollToBottom}
          size="sm"
          className={cn(
            "h-12 w-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
            "bg-slate-600 hover:bg-slate-700 text-white",
            "border-2 border-white dark:border-gray-700"
          )}
          title="Xuống cuối trang"
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
