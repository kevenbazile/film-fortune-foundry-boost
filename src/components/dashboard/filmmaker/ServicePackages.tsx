
import React from "react";
import { Card } from "@/components/ui/card";
import ServicePackageCard from "@/components/ServicePackageCard";

const ServicePackages = () => {
  const packages = [
    {
      id: "basic",
      title: "Basic Distribution",
      price: "$499",
      features: [
        "Digital distribution to 3 platforms",
        "Basic marketing materials",
        "Standard film encoding",
        "90-day distribution cycle",
        "Basic performance reports"
      ],
      platforms: ["Amazon Prime", "Tubi", "YouTube Premium"],
      timeline: "30 days",
      highlighted: false
    },
    {
      id: "standard",
      title: "Standard Distribution",
      price: "$999",
      features: [
        "Digital distribution to 5 platforms",
        "Custom trailer production",
        "Professional film encoding",
        "180-day distribution cycle",
        "Monthly performance reports",
        "Social media promotion package"
      ],
      platforms: ["Netflix", "Amazon Prime", "Hulu", "Tubi", "YouTube Premium"],
      timeline: "21 days",
      highlighted: true
    },
    {
      id: "premium",
      title: "Premium Distribution",
      price: "$1,999",
      features: [
        "Digital distribution to 8+ platforms",
        "Film festival submissions (5 included)",
        "Press kit development",
        "Professional trailer production",
        "365-day distribution cycle",
        "Weekly performance reports",
        "Dedicated marketing campaign"
      ],
      platforms: ["Netflix", "Amazon Prime", "Hulu", "HBO Max", "Disney+", "Peacock", "Apple TV+", "Paramount+"],
      timeline: "14 days",
      highlighted: false
    }
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

// Button is not being imported so we add it here to avoid errors
import { Button } from "@/components/ui/button";

export default ServicePackages;
