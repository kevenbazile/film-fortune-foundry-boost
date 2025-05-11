
/**
 * PayPal Configuration
 * 
 * PRODUCTION MODE ENABLED
 * Using PayPal Hosted Button approach for subscriptions
 */

  
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


// PayPal SDK script URL for hosted buttons
export const getPayPalScriptUrl = () => {
  return `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CONFIG.CLIENT_ID}&components=hosted-buttons&enable-funding=venmo&currency=USD`;
};
