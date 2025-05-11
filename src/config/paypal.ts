
/**
 * PayPal Configuration
 * 
 * PRODUCTION MODE ENABLED
 * Using live PayPal API endpoints and credentials
 */
export const PAYPAL_CONFIG = {
  // Set to 'live' for production
  MODE: 'live',
  
  // Live production credentials
  CLIENT_ID: 'AWLqCibRJ6ZC89ARQ8HFCoL9z57Lg0qvbY2HtLKrJwmqjM8C3XRlR2h9b0_g5m3Wb8TRGjP30Kj_td75',
  
  // DO NOT expose client secret in browser code - only use in edge functions
  SECRET: 'EJeSkREnt3W8iCuLAG2ihBJqfjqThj5YjrCknRt_7TmS0SrppC8cP7_bahYUVt0h0whnwxIaeWDjHG8-',
  
  // API URLs - using production URLs
  API_URL: 'https://api-m.paypal.com', // Production URL
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
