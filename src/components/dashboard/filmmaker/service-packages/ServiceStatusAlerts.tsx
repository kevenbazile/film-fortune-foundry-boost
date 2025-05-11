
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info, Loader2 } from "lucide-react";

interface ServiceStatusAlertsProps {
  checkingSubscription: boolean;
  subscriptionStatus: string | null;
}

const ServiceStatusAlerts = ({ 
  checkingSubscription, 
  subscriptionStatus 
}: ServiceStatusAlertsProps) => {
  if (checkingSubscription) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Checking subscription status...</span>
      </div>
    );
  }

  if (subscriptionStatus === 'ACTIVE') {
    return (
      <Alert variant="default" className="mb-6 bg-green-50 border-green-200">
        <Info className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          You have an active subscription! You can select any package below with your current subscription.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="default" className="mb-6 bg-blue-50 border-blue-200">
      <AlertCircle className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-700">
        Subscribe to one of our packages below to access our distribution services.
      </AlertDescription>
    </Alert>
  );
};

export default ServiceStatusAlerts;
