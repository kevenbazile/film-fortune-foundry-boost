
import React, { useEffect, useId } from 'react';

interface PayPalDirectButtonProps {
  buttonId: string;
  className?: string;
}

// This component renders a direct PayPal hosted button using dangerouslySetInnerHTML
const PayPalDirectButton: React.FC<PayPalDirectButtonProps> = ({ buttonId, className = '' }) => {
  const uniqueId = useId().replace(/:/g, '-');
  const containerId = `paypal-button-${buttonId}-${uniqueId}`;
  
  useEffect(() => {
    // Check if PayPal SDK is available
    if (window.paypal?.HostedButtons) {
      try {
        window.paypal.HostedButtons({
          hostedButtonId: buttonId,
        }).render(`#${containerId}`);
      } catch (error) {
        console.error("Error rendering PayPal button:", error);
      }
    } else {
      console.error("PayPal SDK not loaded properly");
    }
  }, [buttonId, containerId]);

  return <div id={containerId} className={className}></div>;
};

export default PayPalDirectButton;
