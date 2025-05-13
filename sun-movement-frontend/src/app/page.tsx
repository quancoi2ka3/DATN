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

export default function Home() {
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
      <SportswearPreviewSection />
      <SupplementsSection />
      <ContactCTASection />
    </>
  );
}
