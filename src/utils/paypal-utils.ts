
// This file may no longer be used with the hosted buttons approach,
// but let's fix the type error to ensure the build succeeds

/**
 * PayPal utility functions
 * 
 * Note: With hosted buttons, most of these utilities are no longer needed,
 * but we're keeping them for backward compatibility.
 */

// Define proper PayPal window type for hosted buttons
declare global {
  interface Window {
    paypal?: {
      HostedButtons: (options: { hostedButtonId: string }) => {
        render: (selector: string) => Promise<void>;
      };
    };
  }
}

/**
 * Loads the PayPal SDK dynamically
 * @deprecated Use the hosted buttons approach directly instead
 */
export const loadPayPalSDK = async (clientId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if PayPal is already loaded
    if (window.paypal) {
      console.log('PayPal SDK already loaded');
      resolve(true);
      return;
    }

    // Create script element for PayPal SDK
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=hosted-buttons&currency=USD`;
    script.async = true;

    script.onload = () => {
      console.log('PayPal SDK loaded successfully');
      resolve(true);
    };

    script.onerror = () => {
      console.error('Failed to load PayPal SDK');
      resolve(false);
    };

    // Add script to document
    document.body.appendChild(script);
  });
};

/**
 * Creates a subscription using a hosted button
 * @deprecated Use hosted buttons directly
 */
export const createHostedButtonSubscription = async (
  buttonId: string, 
  containerId: string
): Promise<any> => {
  if (!window.paypal?.HostedButtons) {
    throw new Error('PayPal SDK not loaded or HostedButtons not available');
  }

  try {
    await window.paypal.HostedButtons({
      hostedButtonId: buttonId
    }).render(`#${containerId}`);
    return true;
  } catch (error) {
    console.error('Error creating hosted button subscription:', error);
    throw error;
  }
};
