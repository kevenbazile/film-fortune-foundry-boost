
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ServicePackageCard from "@/components/ServicePackageCard";

const ServicePackages = () => {
  // Use the same package data as the home page to ensure consistency
  const packages = [
    {
      id: "basic",
      title: "Basic Distribution",
      price: "$250",
      features: [
        "Distribution to 3 free platforms",
        "Basic SEO optimization",
        "Standard thumbnail creation",
        "Monthly performance reporting",
        "25% commission on revenue",
      ],
      platforms: ["YouTube", "Tubi", "SceneVox"],
      timeline: "2 weeks",
      highlighted: false,
    },
    {
      id: "premium",
      title: "Premium Distribution",
      price: "$500",
      features: [
        "Distribution to 5 platforms",
        "Custom trailer creation",
        "Press kit development",
        "2 film festival submissions",
        "Social media package (5 posts)",
        "20% commission on revenue",
      ],
      platforms: ["YouTube", "SceneVox", "Tubi", "Pluto TV"],
      timeline: "3 weeks",
      highlighted: true,
    },
    {
      id: "elite",
      title: "Elite Distribution",
      price: "$1,000",
      features: [
        "Distribution to 7 platforms",
        "Comprehensive marketing campaign",
        "5 film festival submissions",
        "Press outreach (10 outlets)",
        "Complete social media campaign",
        "Filmmaker feature interview",
        "15% commission on revenue",
      ],
      platforms: [
        "YouTube",
        "SceneVox",
        "Hulu",
        "Tubi",
        "Pluto TV", 
        "Amazon Prime",
        "Netflix",
      ],
      timeline: "4 weeks",
      highlighted: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-3">Choose Your Distribution Package</h2>
        <p className="text-muted-foreground">
          Select the package that best suits your film's distribution goals. Each package offers different levels of exposure and marketing support.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <ServicePackageCard key={pkg.id} package={pkg} />
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Need a Custom Package?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Have specific distribution needs? We can create a tailored package to match your film's unique requirements.
        </p>
        <Card className="p-4">
          <Button className="w-full">Request Custom Package</Button>
        </Card>
      </div>
    </div>
  );
};

export default ServicePackages;
