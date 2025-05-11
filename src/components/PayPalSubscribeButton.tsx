
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// This is declared as a global interface to work with the PayPal SDK
declare global {
  interface Window {
    paypal?: any;
  }
}

interface PayPalSubscribeButtonProps {
  onSuccess?: (subscriptionId: string) => void;
  onError?: (error: any) => void;
}

const PayPalSubscribeButton = ({ onSuccess, onError }: PayPalSubscribeButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const addPayPalScript = async () => {
      setLoading(true);
      try {
        // Check if PayPal SDK is already loaded
        if (window.paypal) {
          setSdkReady(true);
          setLoading(false);
          return;
        }

        // Get script URL from our edge function
        const { data, error } = await supabase.functions.invoke('get-paypal-script');
        
        if (error) {
          console.error('Error fetching PayPal script URL:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load PayPal. Please try again later.",
          });
          setLoading(false);
          return;
        }

        // Create script element
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = data.scriptUrl;
        script.async = true;
        script.onload = () => {
          setSdkReady(true);
          setLoading(false);
        };
        script.onerror = () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load PayPal SDK. Please try again later.",
          });
          setLoading(false);
        };
        document.body.appendChild(script);
      } catch (error) {
        console.error('Error loading PayPal SDK:', error);
        setLoading(false);
      }
    };

    addPayPalScript();
  }, [toast]);

  useEffect(() => {
    if (!sdkReady) return;
    
    // Render PayPal buttons once SDK is loaded
    try {
      window.paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'blue',
          layout: 'vertical',
          label: 'subscribe'
        },
        createSubscription: async (data: any, actions: any) => {
          try {
            // Call our edge function to create a subscription
            const response = await supabase.functions.invoke('create-paypal-subscription', {
              body: {
                userAction: 'SUBSCRIBE_NOW'
              }
            });
            
            if (response.error) {
              throw new Error(response.error.message || 'Failed to create subscription');
            }
            
            return response.data.subscriptionId;
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
        },
        onApprove: async (data: any) => {
          try {
            // Data contains subscriptionID
            console.log('Subscription approved:', data);
            
            // Call our edge function to handle subscription activation
            const response = await supabase.functions.invoke('activate-paypal-subscription', {
              body: { 
                subscriptionId: data.subscriptionID 
              }
            });
            
            if (response.error) {
              throw new Error(response.error.message || 'Failed to activate subscription');
            }
            
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
        },
        onError: (err: any) => {
          console.error('PayPal Error:', err);
          toast({
            variant: "destructive",
            title: "PayPal Error",
            description: "There was a problem with PayPal. Please try again later.",
          });
          if (onError) onError(err);
        },
        onCancel: () => {
          toast({
            title: "Cancelled",
            description: "Subscription process was cancelled.",
          });
        }
      }).render('#paypal-button-container');
    } catch (error) {
      console.error('Error rendering PayPal buttons:', error);
    }
  }, [sdkReady, toast, onSuccess, onError]);

  return (
    <div className="mt-4 w-full">
      {loading ? (
        <Button disabled className="w-full">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading PayPal...
        </Button>
      ) : (
        <div id="paypal-button-container" className="w-full" />
      )}
    </div>
  );
};

export default PayPalSubscribeButton;
