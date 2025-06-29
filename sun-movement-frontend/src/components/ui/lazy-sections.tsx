"use client";

import { lazy, Suspense, ComponentType } from 'react';
import { SectionSkeleton, TestimonialsSkeleton, EventsSkeleton } from './lazy-skeleton';

// Type cho sections
type SectionComponent = ComponentType<any>;

// Helper để tạo lazy section với error handling
const createLazySection = (
  importFunc: () => Promise<any>, 
  componentName: string,
  fallback: React.ReactElement = <SectionSkeleton />
) => {
  const LazyComponent = lazy(async () => {
    try {
      const module = await importFunc();
      return { default: module[componentName] };
    } catch (error) {
      console.error(`Failed to load ${componentName}:`, error);
      // Fallback component
      return { 
        default: () => (
          <div className="py-16 bg-red-50 text-center">
            <p className="text-red-600">Failed to load {componentName}</p>
          </div>
        )
      };
    }
  });

  return () => (
    <Suspense fallback={fallback}>
      <LazyComponent />
    </Suspense>
  );
};

// Export lazy components
export const CalisthenicsLazy = createLazySection(
  () => import('@/components/sections/calisthenics'),
  'CalisthenicsSection',
  <SectionSkeleton />
);

export const StrengthLazy = createLazySection(
  () => import('@/components/sections/strength'),
  'StrengthSection',
  <SectionSkeleton />
);

export const YogaLazy = createLazySection(
  () => import('@/components/sections/yoga'),
  'YogaSection',
  <SectionSkeleton />
);

export const WhyChooseLazy = createLazySection(
  () => import('@/components/sections/why-choose'),
  'WhyChooseSection',
  <SectionSkeleton />
);

export const TestimonialsLazy = createLazySection(
  () => import('@/components/sections/testimonials'),
  'TestimonialsSection',
  <TestimonialsSkeleton />
);

export const EventsLazy = createLazySection(
  () => import('@/components/sections/events'),
  'EventsSection',
  <EventsSkeleton />
);

// Generic lazy section wrapper
interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

export const LazySection = ({ 
  children, 
  className,
  threshold = 0.1,
  rootMargin = '50px'
}: LazySectionProps) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};
