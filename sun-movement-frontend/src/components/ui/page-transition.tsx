"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LoadingSpinner } from './enhanced-animations';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [displayContent, setDisplayContent] = useState(children);

  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setDisplayContent(children);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, children]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center space-y-4">
          <div className="relative">
            <LoadingSpinner size="lg" className="text-red-500" />
            <div className="absolute inset-0 animate-ping">
              <LoadingSpinner size="lg" className="text-red-500 opacity-30" />
            </div>
          </div>
          <p className="text-white text-lg font-medium">Đang tải trang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in-up animate">
      {displayContent}
    </div>
  );
}

// Smooth scroll to top when page changes
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

// Performance monitoring component
export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV === 'development') {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
          }
          if (entry.entryType === 'first-input') {
            console.log('FID:', (entry as any).processingStart - entry.startTime);
          }
          if (entry.entryType === 'layout-shift') {
            console.log('CLS:', (entry as any).value);
          }
        });
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

      return () => observer.disconnect();
    }
  }, []);

  return null;
}

// Preload critical resources
export function ResourcePreloader() {
  useEffect(() => {
    // Preload critical fonts
    const fontUrls = [
      '/fonts/SF-Pro-Display/SF-Pro-Display-Regular.otf',
      '/fonts/SF-Pro-Display/SF-Pro-Display-Semibold.otf',
    ];

    fontUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = 'font';
      link.type = 'font/otf';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Preload critical images
    const criticalImages = [
      '/images/logo-white.svg',
    ];

    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return null;
}
