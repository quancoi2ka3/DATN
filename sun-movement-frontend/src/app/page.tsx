import { HeroSection } from "@/components/sections/hero";
import { CalisthenicsSection } from "@/components/sections/calisthenics";
import { StrengthSection } from "@/components/sections/strength";
import { YogaSection } from "@/components/sections/yoga";
import { WhyChooseSection } from "@/components/sections/why-choose";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { EventsSection } from "@/components/sections/events";
import { SportswearSection as SportswearPreviewSection } from "@/components/sections/sportswear-preview";
import { SupplementsSection } from "@/components/sections/supplements";
import { ContactCTASection } from "@/components/sections/contact-cta";
import { TailwindLoader } from "@/components/ui/tailwind-loader";
import { getHomePageData } from "@/lib/home-page-service";
import { AlertCircle } from "lucide-react";

export default async function Home() {
  // Fetch data for all the product sections
  const homeData = await getHomePageData();
  
  return (
    <>
      <TailwindLoader />
      <HeroSection />
      <CalisthenicsSection />
      <StrengthSection />
      <YogaSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <EventsSection />

      {/* Display API error messages if any */}
      {(homeData.sportswear.error || homeData.supplements.error) && (
        <div className="container py-4">
          {homeData.sportswear.error && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-center gap-3 text-amber-500 mb-4">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Error loading sportswear products</p>
                <p className="text-sm opacity-80">{homeData.sportswear.error}</p>
              </div>
            </div>
          )}
          {homeData.supplements.error && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-center gap-3 text-amber-500 mb-4">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Error loading supplements products</p>
                <p className="text-sm opacity-80">{homeData.supplements.error}</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Always render components with fallback data */}
      <SportswearPreviewSection products={homeData.sportswear.products || []} />
      <SupplementsSection products={homeData.supplements.products || []} />
      
      {/* Show errors if any */}
      {(homeData.sportswear.error || homeData.supplements.error) && (
        <div className="container py-4">
          {/* Error messages */}
        </div>
      )}
      <ContactCTASection />
    </>
  );
}

