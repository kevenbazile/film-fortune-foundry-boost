
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ServicePackageCard from "@/components/ServicePackageCard";
import { SUBSCRIPTION_PLANS } from "@/config/paypal";

// Sample data for service packages
const servicePackages = [
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

const ServicePackages = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Service Packages</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect distribution package for your film and start earning revenue today.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicePackages.map((pkg) => (
            <ServicePackageCard key={pkg.id} package={pkg} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild>
            <Link to="/how-it-works">See Full Package Details</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicePackages;
