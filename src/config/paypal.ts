
// PayPal configuration
export const PAYPAL_CONFIG = {
  PACKAGES: {
    BASIC: {
      name: "Basic Distribution",
      buttonId: "37FUCCV57PC92",
      price: "49.99",
      currency: "USD"
    },
    PREMIUM: {
      name: "Premium Distribution",
      buttonId: "93PKADEJPRP5U",
      price: "99.99",
      currency: "USD"
    },
    ELITE: {
      name: "Elite Distribution",
      buttonId: "Y9NLPW24N8TUS",
      price: "199.99",
      currency: "USD"
    }
  },
  ALACARTE_SERVICES: {
    BUDGET_CONSULT: {
      name: "Budget Breakdown Consultation",
      description: "Get a detailed analysis of your film's distribution budget and ROI projections.",
      price: "75",
      buttonId: "XVLX289JG9JFC"
    },
    PITCH_DECK: {
      name: "Pitch Deck / Investment Call",
      description: "Professional pitch deck creation and investor call preparation.",
      price: "50",
      buttonId: "VF7GHS3UTMX52"
    },
    CASTING_CALL: {
      name: "Casting Call",
      description: "Professional casting call setup and management services.",
      price: "50",
      buttonId: "67JBK3C4Z8NZU"
    },
    FILM_FESTIVAL: {
      name: "Film Festival Submission & Video Review",
      description: "Strategic festival submissions with video review consultation (shorts/trailers only).",
      price: "75",
      buttonId: "5XYMZEFQCN2GW"
    },
    SHARK_TANK: {
      name: "Shark Tank Live-a-thon Entry",
      description: "Entry to our film festival \"Shark Tank\" pitch event.",
      price: "75",
      buttonId: "Q8ANQHXU3MH82"
    }
  },
  MODE: "live" // Default to live mode
};

// Exported aliases for backward compatibility
export const SUBSCRIPTION_PLANS = PAYPAL_CONFIG.PACKAGES;
export const ALACARTE_SERVICES = PAYPAL_CONFIG.ALACARTE_SERVICES;

// Function to get the PayPal script URL
export const getPayPalScriptUrl = () => {
  return "https://www.paypal.com/sdk/js?components=hosted-buttons&client-id=sb";
};
