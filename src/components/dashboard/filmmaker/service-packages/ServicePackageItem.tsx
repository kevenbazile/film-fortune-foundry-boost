
import React from "react";
import { Button } from "@/components/ui/button";
import ServicePackageCard from "@/components/ServicePackageCard";
import PayPalDirectButton from "@/components/paypal-direct/PayPalDirectButton";
import { SUBSCRIPTION_PLANS } from "@/config/paypal";

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
  // Function to get the PayPal button ID based on the package name
  const getPayPalButtonId = () => {
    if (service.title.toLowerCase().includes('basic')) {
      return SUBSCRIPTION_PLANS.BASIC.buttonId;
    } else if (service.title.toLowerCase().includes('premium')) {
      return SUBSCRIPTION_PLANS.PREMIUM.buttonId;
    } else if (service.title.toLowerCase().includes('elite')) {
      return SUBSCRIPTION_PLANS.ELITE.buttonId;
    }
    // Default to basic if no match
    return SUBSCRIPTION_PLANS.BASIC.buttonId;
  };

  return (
    <div className="flex flex-col">
      <ServicePackageCard package={service} />
      <div className="mt-4">
        {selectedPackage === service.id ? (
          <div className="p-4 border rounded-lg bg-muted">
            <h4 className="text-sm font-medium mb-3">Complete Monthly Subscription</h4>
            <PayPalDirectButton 
              buttonId={getPayPalButtonId()} 
              className="w-full"
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
