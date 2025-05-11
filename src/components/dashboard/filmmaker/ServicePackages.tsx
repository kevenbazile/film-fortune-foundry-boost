
import React from "react";
import ServicePackageList from "./service-packages/ServicePackageList";
import ServiceStatusAlerts from "./service-packages/ServiceStatusAlerts";
import CustomPackageRequest from "./service-packages/CustomPackageRequest";
import { useServicePackages } from "./service-packages/useServicePackages";

const ServicePackages = () => {
  const {
    services,
    loading,
    selectedPackage,
    subscriptionStatus,
    checkingSubscription,
    handleSelectPackage,
    handleSubscriptionSuccess,
    handleSubscriptionError
  } = useServicePackages();

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-3">Choose Your Distribution Package</h2>
        <p className="text-muted-foreground">
          Select the package that best suits your film's distribution goals. Each package offers different levels of exposure and marketing support.
        </p>
      </div>
      
      <ServiceStatusAlerts
        checkingSubscription={checkingSubscription}
        subscriptionStatus={subscriptionStatus}
      />
      
      <ServicePackageList
        services={services}
        loading={loading}
        selectedPackage={selectedPackage}
        subscriptionStatus={subscriptionStatus}
        onSelectPackage={handleSelectPackage}
        onSubscriptionSuccess={handleSubscriptionSuccess}
        onSubscriptionError={handleSubscriptionError}
      />
      
      <CustomPackageRequest />
    </div>
  );
};

export default ServicePackages;
