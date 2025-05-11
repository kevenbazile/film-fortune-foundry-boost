
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { PAYPAL_CONFIG } from "@/config/paypal";

export const usePayPalSDK = () => {
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [scriptError, setScriptError] = useState<Error | null>(null);

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
        }
      } finally {
        setLoading(false);
      }
    };

    initializePayPal();
  }, []);

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

  return { loading, sdkReady, scriptError };
};
