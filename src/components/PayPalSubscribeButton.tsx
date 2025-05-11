
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePayPalSDK } from "@/hooks/usePayPalSDK";
import PayPalButtonRenderer from "@/components/PayPalButtonRenderer";

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
          <RefreshCw className="mr-2 h-4 w-4" />
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
          Loading PayPal... ({paypalMode === 'live' ? 'Production' : 'Sandbox'})
        </Button>
      ) : (
        <>
          {sdkReady && (
            <div className="text-xs text-right mb-1 text-muted-foreground">
              {paypalMode === 'live' ? 'Live PayPal' : 'Sandbox Mode'}
            </div>
          )}
          <PayPalButtonRenderer 
            sdkReady={sdkReady} 
            onSuccess={onSuccess} 
            onError={onError} 
            planPrice={planPrice} 
          />
        </>
      )}
    </div>
  );
};

export default PayPalSubscribeButton;
