
import React, { useEffect, useRef } from 'react';
import { SUBSCRIPTION_PLANS } from '@/config/paypal';
import { Loader2 } from 'lucide-react';

// Define the global window with PayPal types
declare global {
  interface Window {
    paypal?: {
      HostedButtons: (options: { hostedButtonId: string }) => {
        render: (selector: string) => Promise<void>;
      };
    };
  }
}

interface PayPalHostedButtonProps {
  plan: 'BASIC' | 'PREMIUM' | 'ELITE';
  onError?: (error: any) => void;
  className?: string;
}

const PayPalHostedButton: React.FC<PayPalHostedButtonProps> = ({ 
  plan, 
  onError,
  className = '' 
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = React.useState(true);
  const [renderError, setRenderError] = React.useState<string | null>(null);
  const buttonId = SUBSCRIPTION_PLANS[plan].buttonId;
  const containerId = `paypal-hosted-button-${plan}-${buttonId}`;

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;
    
    // Clear any existing content in the container
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
    }
    
    // Function to render PayPal button
    const renderButton = () => {
      if (attempts >= maxAttempts) {
        console.error('Failed to load PayPal Hosted Buttons after maximum attempts');
        setRenderError('Failed to load PayPal payment system. Please try again later.');
        setIsRendering(false);
        if (onError) onError(new Error('Failed to load PayPal Hosted Buttons'));
        return;
      }
      
      // Check if PayPal SDK and HostedButtons are available
      if (window.paypal?.HostedButtons) {
        console.log(`Rendering PayPal hosted button for plan: ${plan} with ID: ${buttonId}`);
        
        try {
          window.paypal.HostedButtons({
            hostedButtonId: buttonId
          })
          .render(`#${containerId}`)
          .then(() => {
            console.log(`PayPal hosted button rendered successfully for plan: ${plan}`);
            setIsRendering(false);
          })
          .catch((err: any) => {
            console.error('PayPal hosted button render error:', err);
            setRenderError('Failed to display PayPal button. Please refresh the page or try again later.');
            setIsRendering(false);
            if (onError) onError(err);
          });
        } catch (error) {
          console.error('Error when trying to render PayPal hosted button:', error);
          setRenderError('An error occurred with PayPal integration. Please try again later.');
          setIsRendering(false);
          if (onError) onError(error);
        }
      } else {
        // Retry after 300ms if PayPal not loaded yet
        attempts++;
        console.log(`PayPal SDK not ready yet, attempt ${attempts}/${maxAttempts}`);
        setTimeout(renderButton, 300);
      }
    };

    // Start rendering process
    renderButton();
    
    // Cleanup function
    return () => {
      // Nothing specific to clean up for hosted buttons
    };
  }, [buttonId, containerId, plan, onError]);

  if (renderError) {
    return (
      <div className={`text-center p-4 bg-red-50 rounded-md ${className}`}>
        <p className="text-red-600 mb-2">{renderError}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {isRendering && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span className="text-sm text-gray-600">Loading payment options...</span>
        </div>
      )}
      <div 
        id={containerId} 
        className={isRendering ? 'opacity-0' : 'opacity-100'} 
        data-plan={plan} 
        data-button-id={buttonId}
      ></div>
    </div>
  );
};

export default PayPalHostedButton;
