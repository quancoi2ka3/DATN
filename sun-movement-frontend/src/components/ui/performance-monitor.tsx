"use client";

import { useEffect } from 'react';

// Web Vitals tracking
export function PerformanceMonitor() {
  useEffect(() => {
    // Track Core Web Vitals
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Track page load performance
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        // Log performance metrics
        console.log('Performance Metrics:', {
          DNS: navigation.domainLookupEnd - navigation.domainLookupStart,
          Connection: navigation.connectEnd - navigation.connectStart,
          Request: navigation.responseStart - navigation.requestStart,
          Response: navigation.responseEnd - navigation.responseStart,
          DOM: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          Load: navigation.loadEventEnd - navigation.loadEventStart,
        });
      });

      // Track Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
            // Send to analytics if available
            if (typeof gtag !== 'undefined') {
              gtag('event', 'web_vital', {
                name: 'LCP',
                value: Math.round(entry.startTime),
                event_category: 'performance'
              });
            }
          }
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      // Track First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            const fidEntry = entry as any; // Type assertion for FID properties
            const fid = fidEntry.processingStart - entry.startTime;
            console.log('FID:', fid);
            if (typeof gtag !== 'undefined') {
              gtag('event', 'web_vital', {
                name: 'FID',
                value: Math.round(fid),
                event_category: 'performance'
              });
            }
          }
        }
      });

      fidObserver.observe({ entryTypes: ['first-input'] });

      // Track Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift') {
            const layoutShiftEntry = entry as any; // Type assertion for CLS properties
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value;
            }
          }
        }
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Send CLS when page visibility changes
      const sendCLS = () => {
        console.log('CLS:', clsValue);
        if (typeof gtag !== 'undefined') {
          gtag('event', 'web_vital', {
            name: 'CLS',
            value: Math.round(clsValue * 1000) / 1000,
            event_category: 'performance'
          });
        }
      };

      document.addEventListener('visibilitychange', sendCLS);
      window.addEventListener('beforeunload', sendCLS);

      return () => {
        observer.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
        document.removeEventListener('visibilitychange', sendCLS);
        window.removeEventListener('beforeunload', sendCLS);
      };
    }
  }, []);

  return null; // This component doesn't render anything
}

// Google Analytics helper
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

function gtag(command: string, targetId: string | Date, config?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(command, targetId, config);
  }
}
