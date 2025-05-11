
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
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

        console.log('Starting PayPal SDK initialization process...');
        
        // Try direct loading first with clear error handling
        try {
          console.log('Attempting direct PayPal SDK loading in LIVE mode...');
          await loadPayPalScriptDirectly();
          setSdkReady(true);
          console.log('PayPal SDK loaded successfully via direct method');
          setLoading(false);
          return;
        } catch (directError) {
          console.error('Direct PayPal loading failed with error:', directError);
          
          // Fallback to edge function with improved error handling
          try {
            console.log('Attempting to load PayPal SDK via edge function...');
            await loadPayPalScriptViaEdgeFunction();
            setSdkReady(true);
            console.log('PayPal SDK loaded successfully via edge function');
          } catch (fallbackError) {
            console.error('Edge function PayPal loading failed with error:', fallbackError);
            setScriptError(new Error('Failed to load PayPal SDK. Please try again later.'));
            throw fallbackError;
          }
        }
      } catch (error) {
        console.error('PayPal SDK initialization failed:', error);
        setScriptError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    initializePayPal();
  }, []);

  // Function to load PayPal SDK directly with improved error handling
  const loadPayPalScriptDirectly = (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      try {
        // Check if PayPal SDK is already loaded
        if (window.paypal) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = getPayPalScriptUrl();
        script.async = true;
        
        script.onload = () => {
          console.log('PayPal SDK loaded successfully via direct method (LIVE mode)');
          resolve();
        };
        
        script.onerror = (err) => {
          console.error('Error loading PayPal script directly:', err);
          document.body.removeChild(script);
          reject(new Error('Failed to load PayPal SDK directly'));
        };
        
        document.body.appendChild(script);
      } catch (error) {
        console.error('Exception during direct PayPal script loading:', error);
        reject(error);
      }
    });
  };

  // Function to load PayPal SDK via edge function with improved error handling
  const loadPayPalScriptViaEdgeFunction = (): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        // Call our edge function to get the script URL
        const { data, error } = await supabase.functions.invoke('get-paypal-script');
        
        if (error) {
          console.error('Error from get-paypal-script edge function:', error);
          throw new Error(`Edge function error: ${error.message}`);
        }
        
        if (!data || !data.scriptUrl) {
          throw new Error('Edge function returned invalid data');
        }
        
        // Update mode if returned from edge function
        if (data.mode) {
          setPaypalMode(data.mode);
          console.log(`PayPal mode set from edge function: ${data.mode}`);
        }
        
        // Create script element with the URL from edge function
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = data.scriptUrl;
        script.async = true;
        
        // Promise to wait for script load
        script.onload = () => {
          console.log('PayPal SDK loaded successfully via edge function');
          resolve();
        };
        
        script.onerror = (err) => {
          console.error('Error loading PayPal script via edge function:', err);
          document.body.removeChild(script);
          reject(new Error('Failed to load PayPal SDK via edge function'));
        };
        
        document.body.appendChild(script);
      } catch (error) {
        console.error('Exception during PayPal script loading via edge function:', error);
        reject(error);
      }
    });
  };

  return { loading, sdkReady, scriptError, paypalMode };
};
