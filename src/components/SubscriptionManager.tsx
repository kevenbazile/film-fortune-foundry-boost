
import React, { useState, useEffect } from 'react';
import PayPalDirectButton from './paypal-direct/PayPalDirectButton';
import { PAYPAL_CONFIG } from '@/config/paypal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';

interface SubscriptionManagerProps {
  packageType: 'BASIC' | 'PREMIUM' | 'ELITE';
  subscriptionStatus?: string | null;
  onSubscriptionSuccess?: () => void;
  onSubscriptionError?: (error: Error) => void;
}

const SubscriptionManager = ({ 
  packageType, 
  subscriptionStatus, 
  onSubscriptionSuccess,
  onSubscriptionError
}: SubscriptionManagerProps) => {
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const [renderCount, setRenderCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Only rerender once to help the button appear
    if (renderCount < 1) {
      setRenderCount(prevCount => prevCount + 1);
    }
  }, [renderCount]);

  const handleSubscriptionStatus = async (subscriptionId: string) => {
    try {
      setIsCheckingSubscription(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('You must be logged in to purchase a subscription');
      }
      
      const response = await supabase.functions.invoke("check-subscription-status");
      console.log('Subscription status response:', response);

      // Handle subscription status change
      if (response.error) throw new Error(response.error);

      if (response.data.status === 'ACTIVE') {
        if (onSubscriptionSuccess) onSubscriptionSuccess();
        
        toast({
          title: 'Subscription Active',
          description: `Your ${packageType.toLowerCase()} package is now active.`,
        });
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      if (onSubscriptionError) onSubscriptionError(error);
    } finally {
      setIsCheckingSubscription(false);
    }
  };

  // Check if subscription already exists
  if (subscriptionStatus === 'ACTIVE') {
    return <div className="text-center py-2 px-4 text-sm rounded-md bg-green-50 text-green-800 border border-green-200">
      Subscription active
    </div>;
  }

  const buttonId = PAYPAL_CONFIG.PACKAGES[packageType]?.buttonId;
  const price = PAYPAL_CONFIG.PACKAGES[packageType]?.price || "0";
  const packageName = PAYPAL_CONFIG.PACKAGES[packageType]?.name || packageType;

  if (!buttonId) {
    return <div className="text-red-500">Invalid package type</div>;
  }

  return (
    <div>
      <div className="text-sm mb-2">
        Subscribe to {packageName} package for ${price}/month
      </div>
      
      <div id={`paypal-button-${buttonId}`} className="paypal-button-container">
        <PayPalDirectButton
          buttonId={buttonId}
          onSuccess={() => handleSubscriptionStatus(buttonId)}
        />
      </div>
      
      {isCheckingSubscription && (
        <div className="mt-2 text-center text-sm text-muted-foreground">
          Verifying subscription status...
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;
