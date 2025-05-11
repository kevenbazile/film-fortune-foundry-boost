
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePayPalSDK } from "@/hooks/usePayPalSDK";
import PayPalButtonRenderer from "@/components/PayPalButtonRenderer";
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
  const { loading, sdkReady, scriptError, paypalMode } = usePayPalSDK();
  const { toast } = useToast();

  const handleRetry = () => {
    toast({
      title: "Retrying",
      description: "Attempting to reload the payment system...",
    });
    window.location.reload();
  };

  // Show detailed error message if script failed to load
  if (scriptError) {
    return (
      <div className="mt-4 w-full text-center space-y-4">
        <div className="flex items-center justify-center text-red-500 gap-2">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">
            Unable to load payment system
          </p>
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          We're experiencing technical difficulties connecting to our payment provider.
          Please try again or contact support if the issue persists.
        </p>
        <Button 
          onClick={handleRetry} 
          variant="outline" 
          className="w-full"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4 w-full">
      {loading ? (
        <div className="space-y-2">
          <Button disabled className="w-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading PayPal...
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            {PAYPAL_CONFIG.MODE === 'live' ? 'Using PayPal Live Production Mode' : 'Using PayPal Sandbox Mode'}
          </p>
        </div>
      ) : (
        <>
          {sdkReady && (
            <div className="text-xs text-right mb-1 text-muted-foreground">
              {PAYPAL_CONFIG.MODE === 'live' ? 'PayPal Live Production Mode' : 'PayPal Sandbox Mode'}
            </div>
          )}
          <PayPalButtonRenderer 
            sdkReady={sdkReady} 
            onSuccess={onSuccess} 
            onError={(err) => {
              console.error('PayPal error in button renderer:', err);
              if (onError) onError(err);
            }} 
            planPrice={planPrice} 
          />
        </>
      )}
    </div>
  );
};

export default PayPalSubscribeButton;
