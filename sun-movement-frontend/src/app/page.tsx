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

// Lazy loaded components
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
import PersonalRecommendationsWrapper from "@/components/recommendations/PersonalRecommendationsWrapper";

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
      
      {/* Personalized Recommendations Section */}
      <LazyOnScroll>
        <ScrollAnimation animation="fade-in-up" delay={0.3}>
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-10">Dành riêng cho bạn</h2>
              <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded"></div>}>
                <PersonalRecommendationsWrapper count={4} title="Sản phẩm phù hợp với bạn" />
              </Suspense>
            </div>
          </section>
        </ScrollAnimation>
      </LazyOnScroll>
      
      {/* Lazy loaded sections with IntersectionObserver */}
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
      
      {/* Conversion Optimization Components */}
      <FloatingCTA />
      <ExitIntentPopup />
      
      {/* Real-time Engagement Components */}
      <RealtimeNotifications />
      {/* Removed FloatingActionButton to avoid conflict with existing FloatingContactButton */}
    </>
  );
}

