"use client";

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Prefetch strategy configuration
interface PrefetchConfig {
  routes: string[];
  priority: 'high' | 'medium' | 'low';
  delay?: number;
  condition?: () => boolean;
}

// Strategic prefetch hook
export const useStrategicPrefetch = (config: PrefetchConfig) => {
  const router = useRouter();
  const prefetchedRef = useRef<Set<string>>(new Set());

  const prefetchRoute = useCallback((route: string) => {
    if (!prefetchedRef.current.has(route)) {
      router.prefetch(route);
      prefetchedRef.current.add(route);
    }
  }, [router]);

  useEffect(() => {
    const { routes, priority, delay = 0, condition } = config;

    // Check condition if provided
    if (condition && !condition()) return;

    const prefetchWithDelay = () => {
      routes.forEach(route => {
        setTimeout(() => {
          prefetchRoute(route);
        }, delay);
      });
    };

    // Priority-based prefetch timing
    switch (priority) {
      case 'high':
        // Immediate prefetch for critical routes
        prefetchWithDelay();
        break;
      case 'medium':
        // Prefetch after a short delay
        setTimeout(prefetchWithDelay, 500);
        break;
      case 'low':
        // Prefetch on idle or after longer delay
        const timeoutId = setTimeout(prefetchWithDelay, 2000);
        
        // Use requestIdleCallback if available
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            clearTimeout(timeoutId);
            prefetchWithDelay();
          });
        }
        break;
    }
  }, [config, prefetchRoute]);
};

// Intersection-based prefetch component
interface IntersectionPrefetchProps {
  children: React.ReactNode;
  routes: string[];
  threshold?: number;
  rootMargin?: string;
}

export const IntersectionPrefetch = ({ 
  children, 
  routes, 
  threshold = 0.1,
  rootMargin = '100px'
}: IntersectionPrefetchProps) => {
  const router = useRouter();
  const elementRef = useRef<HTMLDivElement>(null);
  const prefetchedRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefetchedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !prefetchedRef.current) {
            prefetchedRef.current = true;
            routes.forEach(route => {
              router.prefetch(route);
            });
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [routes, router, threshold, rootMargin]);

  return (
    <div ref={elementRef}>
      {children}
    </div>
  );
};

// Critical route prefetch component
export const CriticalRoutesPrefetch = () => {
  // Define critical routes that should be prefetched immediately
  const criticalRoutes = [
    '/dich-vu',
    '/lien-he',
    '/checkout'
  ];

  useStrategicPrefetch({
    routes: criticalRoutes,
    priority: 'high',
    condition: () => {
      // Only prefetch if user seems engaged (has scrolled or interacted)
      return window.scrollY > 100 || document.hasFocus();
    }
  });

  return null;
};

// User behavior based prefetch
export const BehaviorBasedPrefetch = () => {
  const router = useRouter();

  useEffect(() => {
    let mouseMovements = 0;
    let userEngaged = false;

    const handleMouseMove = () => {
      mouseMovements++;
      if (mouseMovements > 5 && !userEngaged) {
        userEngaged = true;
        // User seems engaged, prefetch secondary routes
        const secondaryRoutes = [
          '/gioi-thieu',
          '/su-kien',
          '/profile',
          '/settings'
        ];
        secondaryRoutes.forEach(route => {
          router.prefetch(route);
        });
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 200 && !userEngaged) {
        userEngaged = true;
        // User is scrolling, likely interested
        router.prefetch('/checkout');
      }
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [router]);

  return null;
};
