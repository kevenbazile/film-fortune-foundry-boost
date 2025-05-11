
import React from "react";
import { Card } from "@/components/ui/card";
import ServicePackageItem from "./ServicePackageItem";

interface ServicePackage {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  platforms: string[];
  timeline: string;
  highlighted: boolean;
  commission_rate: number;
}

interface ServicePackageListProps {
  services: ServicePackage[];
  loading: boolean;
  selectedPackage: string | null;
  subscriptionStatus: string | null;
  onSelectPackage: (packageId: string) => void;
  onSubscriptionSuccess: (subscriptionId: string) => void;
  onSubscriptionError: (error: any) => void;
}

const ServicePackageList = ({
  services,
  loading,
  selectedPackage,
  subscriptionStatus,
  onSelectPackage,
  onSubscriptionSuccess,
  onSubscriptionError,
}: ServicePackageListProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full h-96 animate-pulse"></Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {services.map((service) => (
        <ServicePackageItem
          key={service.id}
          service={service}
          selectedPackage={selectedPackage}
          subscriptionStatus={subscriptionStatus}
          onSelectPackage={onSelectPackage}
          onSubscriptionSuccess={onSubscriptionSuccess}
          onSubscriptionError={onSubscriptionError}
        />
      ))}
    </div>
  );
};

export default ServicePackageList;
