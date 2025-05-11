
import React, { useEffect, useId } from 'react';

interface PayPalDirectButtonProps {
  buttonId: string;
  className?: string;
  onSuccess?: () => void;
}

// This component renders a direct PayPal hosted button using dangerouslySetInnerHTML
const PayPalDirectButton: React.FC<PayPalDirectButtonProps> = ({ 
  buttonId, 
  className = '',
  onSuccess
}) => {
  const uniqueId = useId().replace(/:/g, '-');
  const containerId = `paypal-button-${buttonId}-${uniqueId}`;
  
  useEffect(() => {
    // Check if PayPal SDK is available
    if (window.paypal?.HostedButtons) {
      try {
        window.paypal.HostedButtons({
          hostedButtonId: buttonId,
          onComplete: () => {
            console.log('PayPal transaction completed');
            if (onSuccess) {
              onSuccess();
            }
          }
        }).render(`#${containerId}`);
      } catch (error) {
        console.error("Error rendering PayPal button:", error);
      }
    } else {
      console.error("PayPal SDK not loaded properly");
    }
  }, [buttonId, containerId, onSuccess]);

  return <div id={containerId} className={className}></div>;
};

export default PayPalDirectButton;
