import type { Metadata } from "next";

import HeroSection from "@/components/sections/HeroSection";
import AboutThriveFusionSection from "@/components/sections/AboutThriveFusionSection";
import MissionSection from "@/components/sections/MissionSection";
import FocusAreasSection from "@/components/sections/FocusAreasSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import AIFeatureSection from "@/components/sections/AIFeatureSection";
import ImpactSection from "@/components/sections/ImpactSection";
import VolunteerCTASection from "@/components/sections/VolunteerCTASection";
import PartnerCTASection from "@/components/sections/PartnerCTASection";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "ThriveFusion Alliance Foundation — Empowering Every Ability",
  description:
    "ThriveFusion Alliance Foundation empowers persons with disabilities through accessibility, inclusive education, assistive technology, skill development, and employment in India.",
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutThriveFusionSection />
      <MissionSection />
      <FocusAreasSection />
      <ProjectsSection />
      <AIFeatureSection />
      <ImpactSection />
      <VolunteerCTASection />
      <PartnerCTASection />
      <ContactSection />
    </>
  );
}