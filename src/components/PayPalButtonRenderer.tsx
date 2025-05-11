
import React, { useEffect } from 'react';
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

  useEffect(() => {
    if (!sdkReady || !window.paypal) return;
    
    try {
      // Define handlers for PayPal button actions
      const handleCreateSubscription = async (data: any, actions: any) => {
        try {
          return await createPayPalSubscription(planPrice);
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
          
          await activatePayPalSubscription(data.subscriptionID);
          
          toast({
            title: "Success!",
            description: "Your subscription has been activated successfully.",
          });
          
          if (onSuccess) onSuccess(data.subscriptionID);
          
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

      // Render the PayPal buttons
      renderPayPalButtons(
        containerId, 
        handleCreateSubscription,
        handleApprove,
        handleError,
        handleCancel
      );
    } catch (error) {
      console.error('Error setting up PayPal buttons:', error);
    }
  }, [sdkReady, toast, onSuccess, onError, planPrice]);

  return <div id={containerId} className="w-full" />;
};

export default PayPalButtonRenderer;
