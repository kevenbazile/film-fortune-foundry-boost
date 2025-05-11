
import { useEffect, useState } from 'react';
import { getPayPalScriptUrl } from "@/config/paypal";

export const usePayPalSDK = () => {
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [scriptError, setScriptError] = useState<Error | null>(null);
  const [paypalMode, setPaypalMode] = useState<string>('live'); // Default to live mode

  useEffect(() => {
    const initializePayPal = async () => {
      try {
        setLoading(true);
        setScriptError(null);
        
        // Check if PayPal SDK is already loaded
        if (window.paypal) {
          console.log('PayPal SDK already loaded');
          setSdkReady(true);
          setLoading(false);
          return;
        }

        console.log('Starting direct PayPal SDK initialization process...');
        
        // Remove any existing PayPal scripts to avoid conflicts
        const existingScripts = document.querySelectorAll('script[src*="paypal.com/sdk"]');
        existingScripts.forEach(script => script.remove());
        
        // Create new script element with direct URL
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = getPayPalScriptUrl();
        script.async = true;
        script.crossOrigin = 'anonymous';
        
        script.onload = () => {
          console.log('PayPal SDK loaded successfully via direct method');
          setSdkReady(true);
          setLoading(false);
        };
        
        script.onerror = (err) => {
          console.error('Error loading PayPal script directly:', err);
          setScriptError(new Error('Failed to load PayPal SDK. Please try again later.'));
          setLoading(false);
        };
        
        document.body.appendChild(script);
      } catch (error) {
        console.error('PayPal SDK initialization failed:', error);
        setScriptError(error as Error);
        setLoading(false);
      }
    };

    initializePayPal();
  }, []);

  return { loading, sdkReady, scriptError, paypalMode };
};
