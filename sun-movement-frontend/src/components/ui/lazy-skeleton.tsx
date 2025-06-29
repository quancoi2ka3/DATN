"use client";

import { lazy, Suspense, ReactNode, useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

// Base Skeleton Component
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  );
}

// Section Skeleton for large components
export function SectionSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full py-16", className)}>
      <div className="container mx-auto px-4">
        <div className="space-y-8">
          {/* Title skeleton */}
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          
          {/* Content grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Testimonials Skeleton
export function TestimonialsSkeleton() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Events Section Skeleton
export function EventsSkeleton() {
  return (
    <div className="py-16 bg-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <Skeleton className="h-8 w-56 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Skeleton className="h-64 w-full" />
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// IntersectionObserver hook cho lazy loading khi element vào viewport
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
        rootMargin: '100px',
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

// Component wrapper cho intersection-based lazy loading
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
  rootMargin = "100px"
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
