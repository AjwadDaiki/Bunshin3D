import HeroSection from "@/components/landing/Hero/HeroSection";
import ShowcaseSection from "@/components/landing/Showcase/ShowcaseSection";
import FeatureGrid from "@/components/landing/Features/FeatureGrid";
import StepsSection from "@/components/landing/Steps/StepsSection";
import CTASection from "@/components/landing/CTA/CTASection";

export default function LandingPage() {
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
      <CTASection />
    </div>
  );
}
