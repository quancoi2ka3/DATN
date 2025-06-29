"use client";

import { lazy, Suspense, ComponentType } from 'react';
import { SectionSkeleton, TestimonialsSkeleton, EventsSkeleton } from '../ui/lazy-skeleton';

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
  () => import('../sections/calisthenics'),
  'CalisthenicsSection',
  <SectionSkeleton />
);

export const StrengthLazy = createLazySection(
  () => import('../sections/strength'),
  'StrengthSection',
  <SectionSkeleton />
);

export const YogaLazy = createLazySection(
  () => import('../sections/yoga'),
  'YogaSection',
  <SectionSkeleton />
);

export const WhyChooseLazy = createLazySection(
  () => import('../sections/why-choose'),
  'WhyChooseSection',
  <SectionSkeleton />
);

export const TestimonialsLazy = createLazySection(
  () => import('../sections/testimonials'),
  'TestimonialsSection',
  <TestimonialsSkeleton />
);

export const EventsLazy = createLazySection(
  () => import('../sections/events'),
  'EventsSection',
  <EventsSkeleton />
);

export const SportswearLazy = createLazySection(
  () => import('../sections/sportswear-preview'),
  'SportswearSection',
  <SectionSkeleton />
);

export const SupplementsLazy = createLazySection(
  () => import('../sections/supplements'),
  'SupplementsSection',
  <SectionSkeleton />
);

export const ContactCTALazy = createLazySection(
  () => import('../sections/contact-cta'),
  'ContactCTASection',
  <SectionSkeleton />
);

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload components that might be needed soon
  import('../sections/testimonials');
  import('../sections/why-choose');
};

// Analytics cho lazy loading
export const trackLazyLoad = (componentName: string) => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(`🎯 Lazy loaded: ${componentName} at ${new Date().toISOString()}`);
  }
};
