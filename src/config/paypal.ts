
/**
 * PayPal Configuration
 * 
 * PRODUCTION MODE ENABLED
 * Using PayPal Hosted Button approach for subscriptions
 */
export const PAYPAL_CONFIG = {
  // Set to 'live' for production
  MODE: 'live',
  
  // Live production client ID for hosted buttons
  CLIENT_ID: 'BAAJ93SyUTbgMkPraeoWUDgvEGhsuyuv4Wb3f3tEG0xHGlLx4aQTHISnLclkg7WxNMJNZA1oDYMPwEPq1Y',
  
  // No longer need client secret for hosted buttons approach
  
  // API URLs - using production URLs
  API_URL: 'https://api-m.paypal.com', // Production URL
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
    buttonId: "93PKADEJPRP5U",
    price: "500",
    currency: "USD",
  },
  ELITE: {
    name: "Elite Distribution",
    buttonId: "Y9NLPW24N8TUS",
    price: "1000",
    currency: "USD",
  }
};

// Monthly plan (kept for backward compatibility)
export const MONTHLY_PLAN = {
  name: "Monthly Subscription",
  price: "9.99",
  currency: "USD",
  frequency: "MONTH",
  interval: 1,
  description: "Monthly distribution service subscription"
};

// PayPal SDK script URL for hosted buttons
export const getPayPalScriptUrl = () => {
  return `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CONFIG.CLIENT_ID}&components=hosted-buttons&enable-funding=venmo&currency=USD`;
};
