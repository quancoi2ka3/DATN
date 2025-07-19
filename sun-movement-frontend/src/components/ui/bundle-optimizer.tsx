"use client";

import { lazy, Suspense, ComponentType, ReactNode } from 'react';
import { useEffect } from 'react';

// Dynamic import với error boundary
export function withErrorBoundary<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: ReactNode
) {
  const LazyComponent = lazy(async () => {
    try {
      return await importFunc();
    } catch (error) {
      console.error('Failed to load component:', error);
      return {
        default: () => (
          <div className="flex items-center justify-center p-4 text-red-600">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">Lỗi tải component</div>
              <div className="text-sm text-gray-500">Vui lòng thử lại sau</div>
            </div>
          </div>
        )
      } as unknown as { default: T };
    }
  });

  return (props: any) => (
    <Suspense fallback={fallback || <div className="animate-pulse bg-gray-200 h-32 rounded"></div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Preload component khi hover
export function withHoverPreload<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: ReactNode
) {
  let componentPromise: Promise<{ default: T }> | null = null;
  
  const LazyComponent = lazy(() => {
    if (!componentPromise) {
      componentPromise = importFunc();
    }
    return componentPromise;
  });

  const WrappedComponent = (props: any) => {
    const handleMouseEnter = () => {
      if (!componentPromise) {
        componentPromise = importFunc();
      }
    };

    return (
      <div onMouseEnter={handleMouseEnter}>
        <Suspense fallback={fallback || <div className="animate-pulse bg-gray-200 h-32 rounded"></div>}>
          <LazyComponent {...props} />
        </Suspense>
      </div>
    );
  };

  return WrappedComponent;
}

// Bundle analyzer component
export function BundleAnalyzer() {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      // Track bundle chunks
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('chunks/')) {
            // Use decodeBodySize instead of transferSize for better compatibility
            const sizeKB = Math.round((entry as any).decodeBodySize / 1024);
            console.log(`📦 Chunk: ${entry.name} (${sizeKB}KB)`);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['resource'] });
      } catch (error) {
        console.warn('PerformanceObserver not supported');
      }

      return () => observer.disconnect();
    }
  }, []);

  return null;
}

// Code splitting utility
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: {
    fallback?: ReactNode;
    preloadOnHover?: boolean;
    errorBoundary?: boolean;
  } = {}
) {
  const { fallback, preloadOnHover, errorBoundary } = options;

  if (errorBoundary) {
    return withErrorBoundary(importFunc, fallback);
  }

  if (preloadOnHover) {
    return withHoverPreload(importFunc, fallback);
  }

  const LazyComponent = lazy(importFunc);
  
  return (props: any) => (
    <Suspense fallback={fallback || <div className="animate-pulse bg-gray-200 h-32 rounded"></div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Bundle size monitor
export function BundleSizeMonitor() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkBundleSize = () => {
        const scripts = document.querySelectorAll('script[src*="chunks"]');
        let totalSize = 0;
        
        scripts.forEach((script) => {
          const src = script.getAttribute('src');
          if (src) {
            // Estimate size based on URL patterns
            if (src.includes('framework')) totalSize += 150; // ~150KB
            if (src.includes('main')) totalSize += 100; // ~100KB
            if (src.includes('vendors')) totalSize += 200; // ~200KB
          }
        });

        if (totalSize > 500) {
          console.warn(`⚠️ Large bundle detected: ~${totalSize}KB`);
        }
      };

      // Check after page load
      setTimeout(checkBundleSize, 1000);
    }
  }, []);

  return null;
}

// Tree shaking analyzer
export function TreeShakingAnalyzer() {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      // Analyze unused code patterns
      const analyzeUnusedCode = () => {
        const unusedSelectors = [
          '.unused-class',
          '[data-unused]',
          '.deprecated'
        ];

        unusedSelectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            console.warn(`⚠️ Potentially unused elements: ${selector} (${elements.length} found)`);
          }
        });
      };

      setTimeout(analyzeUnusedCode, 2000);
    }
  }, []);

  return null;
}

// Main bundle optimizer
export function MainBundleOptimizer() {
  return (
    <>
      <BundleAnalyzer />
      <BundleSizeMonitor />
      <TreeShakingAnalyzer />
    </>
  );
}

// Import optimization utilities
export const importOptimizer = {
  // Preload critical components
  preloadCritical: () => {
    if (typeof window !== 'undefined') {
      // Preload critical components after initial load
      setTimeout(() => {
        import('@/components/ui/optimized-image');
        import('@/components/ui/lazy-skeleton');
      }, 2000);
    }
  },

  // Preload on route change
  preloadOnRouteChange: (route: string) => {
    if (typeof window !== 'undefined') {
      switch (route) {
        case '/checkout':
          // import('@/components/checkout/checkout-form');
          break;
        case '/products':
          // import('@/components/products/product-grid');
          break;
        case '/profile':
          // import('@/components/profile/profile-dashboard');
          break;
      }
    }
  },

  // Analyze bundle performance
  analyzePerformance: () => {
    if (typeof window !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('📊 Page Load Performance:', {
              DNS: navEntry.domainLookupEnd - navEntry.domainLookupStart,
              TCP: navEntry.connectEnd - navEntry.connectStart,
              TTFB: navEntry.responseStart - navEntry.requestStart,
              DOMContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              Load: navEntry.loadEventEnd - navEntry.loadEventStart,
            });
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['navigation'] });
      } catch (error) {
        console.warn('PerformanceObserver not supported');
      }
    }
  }
}; 