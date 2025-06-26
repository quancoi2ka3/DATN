import { OptimizedHeroSection } from "@/components/sections/optimized-hero";
import { CalisthenicsSection } from "@/components/sections/calisthenics";
import { StrengthSection } from "@/components/sections/strength";
import { YogaSection } from "@/components/sections/yoga";
import { WhyChooseSection } from "@/components/sections/why-choose";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { EventsSection } from "@/components/sections/events";
import { SportswearSection as SportswearPreviewSection } from "@/components/sections/sportswear-preview";
import { SupplementsSection } from "@/components/sections/supplements";
import { ContactCTASection } from "@/components/sections/contact-cta";
import { getHomePageData } from "@/lib/home-page-service";
import { AlertCircle } from "lucide-react";
import { SocialProof, FloatingCTA, ExitIntentPopup } from "@/components/ui/conversion-optimized";
import { PerformanceMonitor } from "@/components/ui/performance-monitor";
import { Suspense } from "react";

export default async function Home() {
  // Fetch data for all the product sections
  const homeData = await getHomePageData();
  
  return (
    <>
      <PerformanceMonitor />
      <OptimizedHeroSection />
      
      {/* Social Proof Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <SocialProof />
        </div>
      </section>
      
      <Suspense fallback={<div className="py-16 text-center">Đang tải...</div>}>
        <CalisthenicsSection />
        <StrengthSection />
        <YogaSection />
        <WhyChooseSection />
        <TestimonialsSection />
        <EventsSection />
      </Suspense>

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
    </>
  );
}

