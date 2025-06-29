"use client";

import { lazy, Suspense, ComponentType, ReactNode } from 'react';
import { SectionSkeleton } from '@/components/ui/skeletons';

// Higher-order component for lazy loading with custom fallback
export function withLazyLoading(
  importFunc: () => Promise<{ default: ComponentType<any> }>,
  fallback?: ReactNode,
  displayName?: string
) {
  const LazyComponent = lazy(importFunc);
  
  const WrappedComponent = (props: any) => (
    <Suspense fallback={fallback || <SectionSkeleton />}>
      <LazyComponent {...props} />
    </Suspense>
  );
  
  WrappedComponent.displayName = displayName || 'LazyComponent';
  
  return WrappedComponent;
}

// IntersectionObserver hook for lazy loading when element comes into view
import { useEffect, useRef, useState } from 'react';

export function useIntersectionObserver(options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting && !hasBeenInView) {
          setHasBeenInView(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasBeenInView, options]);

  return { elementRef, isInView, hasBeenInView };
}

// Component wrapper for intersection-based lazy loading
interface LazyOnScrollProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  triggerOnce?: boolean;
  threshold?: number;
  rootMargin?: string;
}

export function LazyOnScroll({
  children,
  fallback = <SectionSkeleton />,
  className = "",
  triggerOnce = true,
  threshold = 0.1,
  rootMargin = "50px"
}: LazyOnScrollProps) {
  const { elementRef, isInView, hasBeenInView } = useIntersectionObserver({
    threshold,
    rootMargin
  });

  const shouldRender = triggerOnce ? hasBeenInView : isInView;

  return (
    <div ref={elementRef} className={className}>
      {shouldRender ? children : fallback}
    </div>
  );
}

// Preloader for critical components
export function preloadComponent(importFunc: () => Promise<any>) {
  const componentImport = importFunc();
  return componentImport;
}

// Lazy load with prefetch on hover
export function withHoverPrefetch(
  importFunc: () => Promise<{ default: ComponentType<any> }>,
  fallback?: ReactNode
) {
  let componentPromise: Promise<{ default: ComponentType<any> }> | null = null;
  
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
      props.onMouseEnter?.();
    };

    return (
      <div onMouseEnter={handleMouseEnter}>
        <Suspense fallback={fallback || <SectionSkeleton />}>
          <LazyComponent {...props} />
        </Suspense>
      </div>
    );
  };

  return WrappedComponent;
}

// Route-level lazy loading with error boundary
export function LazyRoute({
  children,
  fallback = <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
  </div>
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

// Bundle size analyzer helper
export const bundleAnalytics = {
  logComponentLoad: (componentName: string) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log(`🚀 Lazy loaded: ${componentName} at ${new Date().toISOString()}`);
    }
  },
  
  measureLoadTime: (componentName: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      const startTime = performance.now();
      return () => {
        const endTime = performance.now();
        console.log(`⏱️ ${componentName} load time: ${(endTime - startTime).toFixed(2)}ms`);
      };
    }
    return () => {};
  }
};

// Image lazy loading with priority
export interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export function LazyImage({
  src,
  alt,
  className = "",
  priority = false,
  width,
  height,
  placeholder = 'blur',
  blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
}: LazyImageProps) {
  const { elementRef, hasBeenInView } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '200px'
  });

  return (
    <div ref={elementRef} className={className}>
      {(hasBeenInView || priority) ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-cover"
          loading={priority ? "eager" : "lazy"}
        />
      ) : (
        <div 
          className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
        >
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
    </div>
  );
}
