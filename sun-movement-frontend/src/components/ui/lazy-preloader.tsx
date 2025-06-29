"use client";

import { useEffect } from 'react';

// Component để preload các components quan trọng
export function ComponentPreloader() {
  useEffect(() => {
    // Preload các components sau 2 giây để không ảnh hưởng đến LCP
    const timer = setTimeout(() => {
      // Preload testimonials và why-choose sections
      import('@/components/sections/testimonials');
      import('@/components/sections/why-choose');
      import('@/components/ui/conversion-optimized');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return null; // Component này không render gì
}

// Hook để tracking lazy loading performance
export function useLazyLoadingAnalytics() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 
        typeof window.performance !== 'undefined' && 
        'PerformanceObserver' in window) {
      // Theo dõi bundle chunks được tải
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('chunks/')) {
            console.log(`📦 Chunk loaded: ${entry.name} in ${entry.duration.toFixed(2)}ms`);
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ['resource'] });
      } catch (error) {
        console.warn('PerformanceObserver not supported:', error);
      }
      
      return () => observer.disconnect();
    }
  }, []);
}

// Utility để measure component load time
export function measureComponentLoad(componentName: string) {
  if (typeof window !== 'undefined' && 
      typeof window.performance !== 'undefined' && 
      'now' in window.performance) {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      console.log(`⚡ ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
      
      // Có thể gửi analytics data ở đây
      if (typeof window !== 'undefined' && 
          typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'lazy_component_load', {
          component_name: componentName,
          load_time: Math.round(loadTime)
        });
      }
    };
  }
  
  return () => {};
}
