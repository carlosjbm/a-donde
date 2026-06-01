'use client'
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { CategoryGrid } from "@/components/sections/category-grid";
import { CTASection } from "@/components/sections/cta-section";
import { useAuth } from "@/contexts/auth-context";

export default function Home() {
  const {user}=useAuth()
  return (
    <>
      <Hero />
      <HowItWorks />
      <CategoryGrid />
      {!user&&<CTASection />}
      
    </>
  );
}
