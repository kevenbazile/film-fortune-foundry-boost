
import React from "react";
import SubscriptionManager from "@/components/SubscriptionManager";

const Subscription = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Subscription Plans</h1>
        <p className="text-center text-muted-foreground mb-8">
          Choose a subscription plan to get the most out of our distribution services.
        </p>
        
        <SubscriptionManager />
      </div>
    </div>
  );
};

export default Subscription;
