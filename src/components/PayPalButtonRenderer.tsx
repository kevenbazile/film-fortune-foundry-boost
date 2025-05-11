
import React, { useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { renderPayPalButtons, createPayPalSubscription, activatePayPalSubscription } from "@/utils/paypal-utils";

interface PayPalButtonRendererProps {
  sdkReady: boolean;
  onSuccess?: (subscriptionId: string) => void;
  onError?: (error: any) => void;
  planPrice?: string;
}

const PayPalButtonRenderer = ({ 
  sdkReady, 
  onSuccess, 
  onError, 
  planPrice 
}: PayPalButtonRendererProps) => {
  const { toast } = useToast();
  const containerId = 'paypal-button-container';
  const renderAttemptedRef = useRef(false);

  useEffect(() => {
    if (!sdkReady || !window.paypal) {
      console.log('PayPal SDK not ready or not loaded yet');
      return;
    }
    
    if (renderAttemptedRef.current) {
      console.log('Render already attempted, skipping');
      return;
    }

    renderAttemptedRef.current = true;
    console.log('Rendering PayPal buttons now that SDK is ready');
    
    try {
      // Define handlers for PayPal button actions
      const handleCreateSubscription = async (data: any, actions: any) => {
        try {
          console.log('Creating subscription with price:', planPrice);
          // For direct SDK approach, use actions to create subscription
          if (actions && actions.subscription && actions.subscription.create) {
            return actions.subscription.create({
              plan_id: 'P-5ML4271244454362WXNWU5NQ' // This is normally fetched from your backend
            });
          } else {
            // Fallback to our API method if direct creation isn't available
            return await createPayPalSubscription(planPrice);
          }
        } catch (error) {
          console.error('Error creating subscription:', error);
          toast({
            variant: "destructive",
            title: "Subscription Error",
            description: "Failed to create subscription. Please try again.",
          });
          if (onError) onError(error);
          throw error;
        }
      };

      const handleApprove = async (data: any) => {
        try {
          // Data contains subscriptionID
          console.log('Subscription approved:', data);
          
          if (data.subscriptionID) {
            await activatePayPalSubscription(data.subscriptionID);
            
            toast({
              title: "Success!",
              description: "Your subscription has been activated successfully.",
            });
            
            if (onSuccess) onSuccess(data.subscriptionID);
          } else {
            throw new Error('No subscription ID returned from PayPal');
          }
          
        } catch (error) {
          console.error('Error handling subscription approval:', error);
          toast({
            variant: "destructive",
            title: "Activation Error",
            description: "There was a problem activating your subscription.",
          });
          if (onError) onError(error);
        }
      };

      const handleError = (err: any) => {
        console.error('PayPal Error:', err);
        toast({
          variant: "destructive",
          title: "PayPal Error",
          description: "There was a problem with PayPal. Please try again later.",
        });
        if (onError) onError(err);
      };

      const handleCancel = () => {
        toast({
          title: "Cancelled",
          description: "Subscription process was cancelled.",
        });
      };

      // Make sure container exists before rendering buttons
      const containerElement = document.getElementById(containerId);
      if (!containerElement) {
        console.error('PayPal button container not found');
        return;
      }

      console.log('Container found, rendering PayPal buttons');
      
      // Clear any existing buttons
      containerElement.innerHTML = '';

      // Render the PayPal buttons - try direct rendering first
      try {
        if (window.paypal && window.paypal.Buttons) {
          window.paypal.Buttons({
            style: {
              shape: 'rect',
              color: 'blue',
              layout: 'vertical',
              label: 'subscribe'
            },
            createSubscription: handleCreateSubscription,
            onApprove: handleApprove,
            onError: handleError,
            onCancel: handleCancel
          }).render(`#${containerId}`);
        } else {
          // Fallback to our utility function
          renderPayPalButtons(
            containerId, 
            handleCreateSubscription,
            handleApprove,
            handleError,
            handleCancel
          );
        }
      } catch (error) {
        console.error('Error rendering PayPal buttons:', error);
        if (onError) onError(error);
      }
    } catch (error) {
      console.error('Error setting up PayPal buttons:', error);
      if (onError) onError(error);
    }
  }, [sdkReady, toast, onSuccess, onError, planPrice]);

  return (
    <div>
      <div id={containerId} className="w-full" />
      {!sdkReady && (
        <div className="text-sm text-center text-muted-foreground mt-2">
          Loading payment system...
        </div>
      )}
    </div>
  );
};

export default PayPalButtonRenderer;
