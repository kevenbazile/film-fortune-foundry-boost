
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PAYPAL_CONFIG } from "@/config/paypal";

// This is declared as a global interface to work with the PayPal SDK
declare global {
  interface Window {
    paypal?: any;
  }
}

interface PayPalSubscribeButtonProps {
  onSuccess?: (subscriptionId: string) => void;
  onError?: (error: any) => void;
  planPrice?: string;
}

const PayPalSubscribeButton = ({ onSuccess, onError, planPrice }: PayPalSubscribeButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [scriptError, setScriptError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Function to load PayPal SDK directly
  const loadPayPalScript = () => {
    return new Promise<void>((resolve, reject) => {
      // Check if PayPal SDK is already loaded
      if (window.paypal) {
        resolve();
        return;
      }

      console.log('Loading PayPal SDK directly...');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CONFIG.CLIENT_ID}&currency=USD&intent=subscription`;
      script.async = true;
      
      script.onload = () => {
        console.log('PayPal SDK loaded successfully');
        resolve();
      };
      
      script.onerror = (err) => {
        console.error('Error loading PayPal script:', err);
        reject(new Error('Failed to load PayPal SDK'));
      };
      
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const initializePayPal = async () => {
      try {
        setLoading(true);
        setScriptError(null);
        
        // First try loading directly
        await loadPayPalScript();
        setSdkReady(true);
      } catch (directError) {
        console.error('Direct load failed:', directError);
        
        // Fallback to loading via edge function
        try {
          // Get script URL from our edge function
          const { data, error } = await supabase.functions.invoke('get-paypal-script');
          
          if (error) {
            throw new Error(`Error fetching PayPal script URL: ${error.message}`);
          }
          
          // Create script element
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = data.scriptUrl;
          script.async = true;
          
          // Promise to wait for script load
          await new Promise<void>((resolve, reject) => {
            script.onload = () => {
              console.log('PayPal SDK loaded successfully via edge function');
              resolve();
            };
            
            script.onerror = (err) => {
              console.error('Error loading PayPal script via edge function:', err);
              reject(new Error('Failed to load PayPal SDK via edge function'));
            };
            
            document.body.appendChild(script);
          });
          
          setSdkReady(true);
        } catch (fallbackError) {
          console.error('All PayPal SDK loading methods failed:', fallbackError);
          setScriptError(fallbackError as Error);
          toast({
            variant: "destructive",
            title: "PayPal Error",
            description: "Could not load PayPal. Please try again later or contact support.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    initializePayPal();
  }, [toast]);

  useEffect(() => {
    if (!sdkReady || !window.paypal) return;
    
    const containerElement = document.getElementById('paypal-button-container');
    if (!containerElement) {
      console.error('PayPal button container not found');
      return;
    }
    
    // Clear any existing buttons
    containerElement.innerHTML = '';
    
    // Render PayPal buttons once SDK is loaded
    try {
      console.log('Rendering PayPal buttons');
      window.paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'blue',
          layout: 'vertical',
          label: 'subscribe'
        },
        createSubscription: async (data: any, actions: any) => {
          console.log('Creating subscription', { planPrice });
          try {
            // Call our edge function to create a subscription
            const response = await supabase.functions.invoke('create-paypal-subscription', {
              body: {
                userAction: 'SUBSCRIBE_NOW',
                planPrice: planPrice
              }
            });
            
            if (response.error) {
              console.error('Error from create-paypal-subscription:', response.error);
              throw new Error(response.error.message || 'Failed to create subscription');
            }
            
            console.log('Subscription created:', response.data);
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
  }, [sdkReady, toast, onSuccess, onError, planPrice]);

  // Show error message if script failed to load
  if (scriptError) {
    return (
      <div className="mt-4 w-full text-center">
        <p className="text-sm text-red-500 mb-2">
          Unable to load payment system. Please try again later.
        </p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline" 
          className="w-full"
        >
          Refresh Page
        </Button>
      </div>
    );
  }

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
