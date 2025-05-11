
// Remove any references to PayPal Buttons API, since we're only using HostedButtons now
// This file is likely not used anymore with the hosted buttons approach, but we'll fix the errors

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

// Define proper PayPal window types for hosted buttons
declare global {
  interface Window {
    paypal?: {
      HostedButtons: (options: { hostedButtonId: string }) => {
        render: (selector: string) => Promise<void>;
      };
    };
  }
}

interface PayPalButtonRendererProps {
  buttonId: string;
  onApprove?: (data: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

const PayPalButtonRenderer: React.FC<PayPalButtonRendererProps> = ({
  buttonId,
  onApprove,
  onError,
  onCancel
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerId = `paypal-button-container-${buttonId}`;

  useEffect(() => {
    // Check if PayPal SDK is loaded
    if (!window.paypal) {
      setError('PayPal SDK not loaded');
      setLoading(false);
      return;
    }

    try {
      // For hosted buttons, we use HostedButtons API instead of Buttons API
      if (window.paypal.HostedButtons) {
        window.paypal.HostedButtons({
          hostedButtonId: buttonId
        })
        .render(`#${containerId}`)
        .then(() => {
          setLoading(false);
        })
        .catch((err: any) => {
          console.error('PayPal button render error:', err);
          setError('Failed to load PayPal button');
          setLoading(false);
          if (onError) onError(err);
        });
      } else {
        setError('PayPal Hosted Buttons API not available');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error rendering PayPal button:', err);
      setError('Error rendering PayPal button');
      setLoading(false);
      if (onError) onError(err);
    }
  }, [buttonId, containerId, onApprove, onCancel, onError]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="paypal-button-container">
      {loading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Loading PayPal...</span>
        </div>
      )}
      <div 
        id={containerId} 
        className={loading ? 'opacity-0 h-0' : 'opacity-100'}
      ></div>
    </div>
  );
};

export default PayPalButtonRenderer;
