
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getPayPalConfig } from '../_shared/paypal-config.ts';

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const config = getPayPalConfig();
    
    // Ensure we have a valid client ID
    if (!config.clientId) {
      throw new Error('PayPal client ID is missing');
    }
    
    // Build the script URL with proper parameters
    const scriptUrl = `https://www.paypal.com/sdk/js?client-id=${config.clientId}&currency=USD&intent=subscription`;
    
    console.log('Providing PayPal script URL for mode:', config.mode);
    
    return new Response(
      JSON.stringify({
        scriptUrl,
        mode: config.mode
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error getting PayPal script URL:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to get PayPal script URL',
        errorDetails: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
