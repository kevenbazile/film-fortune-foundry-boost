
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
  CLIENT_ID: 'AU9i5m6fo3Z4AOkhgpu_Lkzx75XmV_wdKOPCcjRSXYMI354m0a7Rt5jgtU1Md__10u4JGLOiqZebZecV',
  
  // DO NOT expose client secret in browser code - only use in edge functions
  SECRET: 'EHwLiw7zTCfl-PJACCya-3DRNNiVVm_lPuaKqIY8USCTj6dVnRZn83LmAwH9PUskrrFE2oD1FZvp8hDR',
  
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
