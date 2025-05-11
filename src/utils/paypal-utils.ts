
import { supabase } from "@/integrations/supabase/client";

// Creates a PayPal subscription via Supabase Edge Function
export const createPayPalSubscription = async (planPrice?: string) => {
  console.log('Creating subscription', { planPrice });
  
  const response = await supabase.functions.invoke('create-paypal-subscription', {
    body: {
      userAction: 'SUBSCRIBE_NOW',
      planPrice: planPrice
    }
  });
  
  if (response.error) {
    console.error('Error from create-paypal-subscription:', response.error);
    throw new Error(response.error.message || 'Failed to create subscription');
  }
  
  console.log('Subscription created:', response.data);
  return response.data.subscriptionId;
};

// Activates a PayPal subscription via Supabase Edge Function
export const activatePayPalSubscription = async (subscriptionId: string) => {
  const response = await supabase.functions.invoke('activate-paypal-subscription', {
    body: { 
      subscriptionId: subscriptionId 
    }
  });
  
  if (response.error) {
    throw new Error(response.error.message || 'Failed to activate subscription');
  }
  
  return response.data;
};

// Renders PayPal buttons in the specified container
export const renderPayPalButtons = (
  containerId: string, 
  createSubscriptionFn: (data: any, actions: any) => Promise<string>,
  onApproveFn: (data: any) => Promise<void>,
  onErrorFn: (err: any) => void,
  onCancelFn: () => void
) => {
  const containerElement = document.getElementById(containerId);
  if (!containerElement || !window.paypal) {
    console.error('PayPal button container not found or PayPal SDK not loaded');
    return;
  }
  
  // Clear any existing buttons
  containerElement.innerHTML = '';
  
  // Render PayPal buttons
  try {
    console.log('Rendering PayPal buttons');
    window.paypal.Buttons({
      style: {
        shape: 'rect',
        color: 'blue',
        layout: 'vertical',
        label: 'subscribe'
      },
      createSubscription: createSubscriptionFn,
      onApprove: onApproveFn,
      onError: onErrorFn,
      onCancel: onCancelFn
    }).render(`#${containerId}`);
  } catch (error) {
    console.error('Error rendering PayPal buttons:', error);
    throw error;
  }
};
