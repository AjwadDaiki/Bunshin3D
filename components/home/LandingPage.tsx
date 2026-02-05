"use client";

import { useEffect } from "react";
import HeroSection from "@/components/landing/Hero/HeroSection";
import ShowcaseSection from "@/components/landing/Showcase/ShowcaseSection";
import FeatureGrid from "@/components/landing/Features/FeatureGrid";
import ReferralPromoSection from "@/components/referral/ReferralPromoSection";
import StepsSection from "@/components/landing/Steps/StepsSection";
import CTASection from "@/components/landing/CTA/CTASection";

export default function LandingPage() {
  // Capture referral code from URL and persist to localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref")?.trim();
    if (ref) {
      try { localStorage.setItem("bunshin_ref", ref); } catch {}
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-white overflow-hidden">
      <HeroSection />
      <hr className="section-hr" />
      <ShowcaseSection />
      <hr className="section-hr" />
      <FeatureGrid />
      <hr className="section-hr" />
      <StepsSection />
      <hr className="section-hr" />
      <ReferralPromoSection />
      <hr className="section-hr" />
      <CTASection />
    </div>
  );
}
