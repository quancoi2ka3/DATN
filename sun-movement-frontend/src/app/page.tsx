import { OptimizedHeroSection } from "@/components/sections/optimized-hero";
import { ContactCTASection } from "@/components/sections/contact-cta";
import { getHomePageData } from "@/lib/home-page-service";
import { AlertCircle } from "lucide-react";
import { SocialProof, FloatingCTA, ExitIntentPopup } from "@/components/ui/conversion-optimized";
import { PerformanceMonitor } from "@/components/ui/performance-monitor";
import { ScrollAnimation } from "@/components/ui/enhanced-animations";
import { RealtimeNotifications } from "@/components/ui/engagement-boosters";
import { HomePageTracker } from "@/components/tracking/home-page-tracker";
import { Suspense } from "react";

// Lazy loaded components with dynamic imports for better performance
import { 
  CalisthenicsLazy, 
  StrengthLazy, 
  YogaLazy, 
  WhyChooseLazy, 
  TestimonialsLazy, 
  EventsLazy 
} from "@/components/ui/lazy-sections";
import { LazyOnScroll } from "@/components/ui/lazy-skeleton";
import { ComponentPreloader } from "@/components/ui/lazy-preloader";

export default async function Home() {
  // Fetch data for all the product sections
  const homeData = await getHomePageData();
  
  return (
    <>
      <HomePageTracker />
      <PerformanceMonitor />
      <ComponentPreloader />
      <OptimizedHeroSection />
      
      {/* Lazy loaded Social Proof Section */}
      <LazyOnScroll fallback={<div className="py-8 bg-gray-50 animate-pulse"><div className="container mx-auto px-4 h-16"></div></div>}>
        <ScrollAnimation animation="fade-in-up" delay={0.2}>
          <section className="py-8 bg-gray-50">
            <div className="container mx-auto px-4">
              <Suspense fallback={<div className="h-16 animate-pulse bg-gray-200 rounded"></div>}>
                <SocialProof />
              </Suspense>
            </div>
          </section>
        </ScrollAnimation>
      </LazyOnScroll>
      
      {/* Lazy loaded sections with IntersectionObserver for better performance */}
      <LazyOnScroll>
        <ScrollAnimation animation="fade-in-up" delay={0.3}>
          <CalisthenicsLazy />
        </ScrollAnimation>
      </LazyOnScroll>
        
      <LazyOnScroll>
        <ScrollAnimation animation="fade-in-left" delay={0.1}>
          <StrengthLazy />
        </ScrollAnimation>
      </LazyOnScroll>
        
      <LazyOnScroll>
        <ScrollAnimation animation="fade-in-right" delay={0.1}>
          <YogaLazy />
        </ScrollAnimation>
      </LazyOnScroll>
        
      <LazyOnScroll>
        <ScrollAnimation animation="fade-in-up" delay={0.2}>
          <WhyChooseLazy />
        </ScrollAnimation>
      </LazyOnScroll>
        
      <LazyOnScroll>
        <ScrollAnimation animation="fade-in-up" delay={0.3}>
          <TestimonialsLazy />
        </ScrollAnimation>
      </LazyOnScroll>
        
      <LazyOnScroll>
        <ScrollAnimation animation="fade-in-up" delay={0.1}>
          <EventsLazy />
        </ScrollAnimation>
      </LazyOnScroll>

      {/* Display API error messages if any */}
      {(homeData.sportswear.error || homeData.supplements.error) && (
        <div className="container py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-semibold">Lỗi tải dữ liệu</h3>
            </div>
            {homeData.sportswear.error && (
              <p className="text-red-700 text-sm mt-1">Sportswear: {homeData.sportswear.error}</p>
            )}
            {homeData.supplements.error && (
              <p className="text-red-700 text-sm mt-1">Supplements: {homeData.supplements.error}</p>
            )}
          </div>
        </div>
      )}
      
      <ContactCTASection />
      
      {/* Conversion Optimization Components - Loaded asynchronously */}
      <Suspense fallback={null}>
        <FloatingCTA />
      </Suspense>
      <Suspense fallback={null}>
        <ExitIntentPopup />
      </Suspense>
      
      {/* Real-time Engagement Components - Loaded asynchronously */}
      <Suspense fallback={null}>
        <RealtimeNotifications />
      </Suspense>
    </>
  );
}

