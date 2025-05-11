
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ServicePackageCard from "@/components/ServicePackageCard";
import PayPalSubscribeButton from "@/components/PayPalSubscribeButton";
import { useToast } from "@/hooks/use-toast";

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

interface ServicePackageItemProps {
  service: ServicePackage;
  selectedPackage: string | null;
  subscriptionStatus: string | null;
  onSelectPackage: (packageId: string) => void;
  onSubscriptionSuccess: (subscriptionId: string) => void;
  onSubscriptionError: (error: any) => void;
}

const ServicePackageItem = ({
  service,
  selectedPackage,
  subscriptionStatus,
  onSelectPackage,
  onSubscriptionSuccess,
  onSubscriptionError,
}: ServicePackageItemProps) => {
  // Extract price number for PayPal
  const getPackagePrice = () => {
    return service.price.replace(/[^0-9.]/g, '');
  };

  return (
    <div className="flex flex-col">
      <ServicePackageCard package={service} />
      <div className="mt-4">
        {selectedPackage === service.id ? (
          <div className="p-4 border rounded-lg bg-muted">
            <h4 className="text-sm font-medium mb-3">Complete Monthly Subscription</h4>
            <PayPalSubscribeButton 
              onSuccess={onSubscriptionSuccess}
              onError={onSubscriptionError}
              planPrice={getPackagePrice()}
            />
            <Button 
              variant="outline" 
              className="w-full mt-2" 
              onClick={() => onSelectPackage('')}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full" 
            variant={service.highlighted ? "default" : "outline"}
            onClick={() => onSelectPackage(service.id)}
            disabled={subscriptionStatus === 'ACTIVE'}
          >
            {subscriptionStatus === 'ACTIVE' ? 'Already Subscribed' : `Subscribe to ${service.title}`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ServicePackageItem;
