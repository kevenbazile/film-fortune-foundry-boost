
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PayPalSubscribeButton from "@/components/PayPalSubscribeButton";
import { supabase } from "@/integrations/supabase/client";
import { MONTHLY_PLAN } from "@/config/paypal";
import { Check } from "lucide-react";

const SubscriptionManager = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setLoading(true);
        
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase.functions.invoke('check-subscription-status');
        
        if (error) {
          console.error('Error checking subscription:', error);
        } else {
          setSubscriptionStatus(data.status);
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSubscription();
  }, []);

  const handleSubscriptionSuccess = (subscriptionId: string) => {
    console.log('Subscription successful:', subscriptionId);
    setSubscriptionStatus('ACTIVE');
    toast({
      title: "Subscription Active",
      description: "Your monthly subscription is now active!",
    });
    
    // Refresh the page after a short delay to update UI
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleSubscriptionError = (error: any) => {
    console.error('Subscription error:', error);
    toast({
      variant: "destructive",
      title: "Subscription Error",
      description: "There was a problem with your subscription. Please try again.",
    });
  };

  const renderSubscriptionStatus = () => {
    if (loading) {
      return <p>Loading subscription status...</p>;
    }

    if (subscriptionStatus === 'ACTIVE') {
      return (
        <div className="bg-green-50 p-4 rounded-md border border-green-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Active Subscription</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your monthly subscription is active. You have full access to all premium features.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          You don't have an active subscription. Subscribe to get access to all premium features.
        </p>
        <PayPalSubscribeButton 
          onSuccess={handleSubscriptionSuccess} 
          onError={handleSubscriptionError} 
        />
      </div>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Monthly Subscription</CardTitle>
        <CardDescription>
          Get access to all premium features for ${MONTHLY_PLAN.price} per month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-2xl font-bold">
            ${MONTHLY_PLAN.price}<span className="text-sm font-normal text-muted-foreground">/month</span>
          </div>
          
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>Premium distribution options</span>
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>Priority film review</span>
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>Advanced analytics</span>
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>Dedicated support</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>{renderSubscriptionStatus()}</CardFooter>
    </Card>
  );
};

export default SubscriptionManager;
