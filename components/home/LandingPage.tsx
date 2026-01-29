"use client";

import BackgroundFX from "@/components/landing/BackgroundFX";
import HeroSection from "@/components/landing/Hero/HeroSection";
import ShowcaseSection from "@/components/landing/Showcase/ShowcaseSection";
import FeatureGrid from "@/components/landing/Features/FeatureGrid";
import ReferralPromoSection from "@/components/referral/ReferralPromoSection";
import StepsSection from "@/components/landing/Steps/StepsSection";
import CTASection from "@/components/landing/CTA/CTASection";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white overflow-hidden selection:bg-indigo-500/30">
      <BackgroundFX />
      <HeroSection />
      <ShowcaseSection />
      <FeatureGrid />
      <ReferralPromoSection />
      <StepsSection />
      <CTASection />
    </div>
  );
}
