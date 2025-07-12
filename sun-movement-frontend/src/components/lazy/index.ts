"use client";

import { lazy } from 'react';

// Lazy load các sections không critical với named exports
export const LazyCalisthenicsSection = lazy(() => 
  import('@/components/sections/calisthenics').then(module => ({ 
    default: module.CalisthenicsSection 
  }))
);

export const LazyStrengthSection = lazy(() => 
  import('@/components/sections/strength').then(module => ({ 
    default: module.StrengthSection 
  }))
);

export const LazyYogaSection = lazy(() => 
  import('@/components/sections/yoga').then(module => ({ 
    default: module.YogaSection 
  }))
);

export const LazyWhyChooseSection = lazy(() => 
  import('@/components/sections/why-choose').then(module => ({ 
    default: module.WhyChooseSection 
  }))
);

export const LazyTestimonialsSection = lazy(() => 
  import('@/components/sections/testimonials').then(module => ({ 
    default: module.TestimonialsSection 
  }))
);

export const LazyEventsSection = lazy(() => 
  import('@/components/sections/events').then(module => ({ 
    default: module.EventsSection 
  }))
);

// Update the import path below to the correct file if it is different, for example:
// import('@/components/sections/sportswear') or the actual file name that exists.
export const LazySportswearSection = lazy(() => 
  import('@/components/sections/sportswear').then(module => ({ 
    default: module.SportswearSection 
  }))
);

export const LazySupplementsSection = lazy(() => 
  import('@/components/sections/supplements').then(module => ({ 
    default: module.SupplementsSection 
  }))
);

export const LazyContactCTASection = lazy(() => 
  import('@/components/sections/contact-cta').then(module => ({ 
    default: module.ContactCTASection 
  }))
);

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload components that might be needed soon
  import('@/components/sections/testimonials');
  import('@/components/sections/why-choose');
  import('@/components/ui/conversion-optimized');
};

// Analytics cho lazy loading
export const trackLazyLoad = (componentName: string) => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(`🎯 Lazy loaded: ${componentName} at ${new Date().toISOString()}`);
  }
};
