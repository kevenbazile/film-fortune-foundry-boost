
/**
 * PayPal Configuration
 * 
 * IMPORTANT: When switching to production:
 * 1. Change PAYPAL_MODE to 'live'
 * 2. Update CLIENT_ID and SECRET with your production credentials
 */
export const PAYPAL_CONFIG = {
  // Change to 'live' for production
  MODE: 'sandbox',
  
  // Sandbox credentials (replace with production credentials for live)
  CLIENT_ID: 'AWLqCibRJ6ZC89ARQ8HFCoL9z57Lg0qvbY2HtLKrJwmqjM8C3XRlR2h9b0_g5m3Wb8TRGjP30Kj_td75',
  
  // DO NOT expose client secret in browser code - only use in edge functions
  SECRET: 'EJeSkREnt3W8iCuLAG2ihBJqfjqThj5YjrCknRt_7TmS0SrppC8cP7_bahYUVt0h0whnwxIaeWDjHG8-',
  
  // API URLs
  API_URL: 'https://api-m.sandbox.paypal.com', // Change to https://api-m.paypal.com for production
};

// Plan details for monthly subscription
export const MONTHLY_PLAN = {
  name: "Monthly Subscription",
  price: "9.99",
  currency: "USD",
  frequency: "MONTH",
  interval: 1,
  description: "Monthly distribution service subscription"
};

// PayPal SDK script URL
export const getPayPalScriptUrl = () => {
  return `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CONFIG.CLIENT_ID}&currency=${MONTHLY_PLAN.currency}&intent=subscription`;
};
