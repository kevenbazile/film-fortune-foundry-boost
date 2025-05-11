
/**
 * PayPal Configuration
 * 
 * PRODUCTION MODE ENABLED
 * Using PayPal Hosted Button approach for subscriptions
 */

// PayPal configuration object
export const PAYPAL_CONFIG = {
  // API URLs - using production URLs
  API_URL: 'https://api-m.paypal.com', // Production URL
  MODE: 'live',
  CLIENT_ID: 'AWLqCibRJ6ZC89ARQ8HFCoL9z57Lg0qvbY2HtLKrJwmqjM8C3XRlR2h9b0_g5m3Wb8TRGjP30Kj_td75'
};

// Plan details mapping to hosted button IDs
export const SUBSCRIPTION_PLANS = {
  BASIC: {
    name: "Basic Distribution",
    buttonId: "37FUCCV57PC92",
    price: "250",
    currency: "USD",
  },
  PREMIUM: {
    name: "Premium Distribution",
    buttonId: "93PKADEJPRP5U", // Correct Premium button ID
    price: "500",
    currency: "USD",
  },
  ELITE: {
    name: "Elite Distribution",
    buttonId: "Y9NLPW24N8TUS", // Correct Elite button ID
    price: "1000",
    currency: "USD",
  }
};

// Adding this for backwards compatibility with other components
export const MONTHLY_PLAN = {
  BASIC: SUBSCRIPTION_PLANS.BASIC,
  PREMIUM: SUBSCRIPTION_PLANS.PREMIUM, 
  ELITE: SUBSCRIPTION_PLANS.ELITE
};

// PayPal SDK script URL for hosted buttons
export const getPayPalScriptUrl = () => {
  return `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CONFIG.CLIENT_ID}&components=hosted-buttons&enable-funding=venmo&currency=USD`;
};
