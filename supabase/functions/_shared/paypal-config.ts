
/**
 * PayPal configuration for edge functions
 * 
 * PRODUCTION TRANSITION:
 * When moving to production, update the following in Supabase Dashboard:
 * - Change PAYPAL_MODE to 'live'
 * - Update PAYPAL_CLIENT_ID and PAYPAL_SECRET with production values
 */

// Get PayPal configuration from environment variables
export function getPayPalConfig() {
  const mode = Deno.env.get('PAYPAL_MODE') || 'sandbox';
  
  // API endpoints based on mode
  const apiUrl = mode === 'sandbox' 
    ? 'https://api-m.sandbox.paypal.com' 
    : 'https://api-m.paypal.com';
  
  return {
    mode,
    apiUrl,
    clientId: Deno.env.get('PAYPAL_CLIENT_ID') || 'AWLqCibRJ6ZC89ARQ8HFCoL9z57Lg0qvbY2HtLKrJwmqjM8C3XRlR2h9b0_g5m3Wb8TRGjP30Kj_td75',
    secret: Deno.env.get('PAYPAL_SECRET') || 'EJeSkREnt3W8iCuLAG2ihBJqfjqThj5YjrCknRt_7TmS0SrppC8cP7_bahYUVt0h0whnwxIaeWDjHG8-'
  };
}

// Get PayPal access token
export async function createAccessToken() {
  const config = getPayPalConfig();
  
  const response = await fetch(`${config.apiUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${config.clientId}:${config.secret}`)}`
    },
    body: 'grant_type=client_credentials'
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('PayPal auth error:', errorData);
    throw new Error(`PayPal authentication failed: ${errorData.error_description || 'Unknown error'}`);
  }
  
  const data = await response.json();
  return data.access_token;
}
