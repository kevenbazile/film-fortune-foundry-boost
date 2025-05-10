
import React from "react";
import HeroSection from "@/components/home/HeroSection";
import SuccessMetrics from "@/components/home/SuccessMetrics";
import ServicePackages from "@/components/home/ServicePackages";
import HowItWorks from "@/components/home/HowItWorks";
import CommissionStructure from "@/components/home/CommissionStructure";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <SuccessMetrics />
      <ServicePackages />
      <HowItWorks />
      <CommissionStructure />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default Index;
