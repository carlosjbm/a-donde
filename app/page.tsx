import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { CategoryGrid } from "@/components/sections/category-grid";
import { CTASection } from "@/components/sections/cta-section";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <CategoryGrid />
      <CTASection />
    </>
  );
}
