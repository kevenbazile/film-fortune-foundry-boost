
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.17.0';
import { corsHeaders } from '../_shared/cors.ts';
import { getPayPalConfig, createAccessToken } from '../_shared/paypal-config.ts';

// Create a Supabase client
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { user } = await supabaseClient.auth.getUser(req.headers.get('Authorization')?.split(' ')[1] ?? '');
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const userId = user.id;
    const config = getPayPalConfig();
    
    // Get access token from PayPal
    const accessToken = await createAccessToken();
    
    if (!accessToken) {
      throw new Error('Failed to get PayPal access token');
    }
    
    // Create the subscription product in PayPal
    const productResponse = await fetch(`${config.apiUrl}/v1/catalogs/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: 'Monthly Subscription',
        description: 'Monthly distribution service subscription',
        type: 'SERVICE',
        category: 'DIGITAL_MEDIA_SERVICES'
      })
    });
    
    if (!productResponse.ok) {
      const errorData = await productResponse.json();
      console.error('Product creation error:', errorData);
      throw new Error(`Failed to create product: ${errorData.message || 'Unknown error'}`);
    }
    
    const productData = await productResponse.json();
    const productId = productData.id;
    
    // Create the subscription plan in PayPal
    const planResponse = await fetch(`${config.apiUrl}/v1/billing/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        product_id: productId,
        name: 'Monthly Plan',
        description: 'Monthly distribution service subscription',
        status: 'ACTIVE',
        billing_cycles: [
          {
            frequency: {
              interval_unit: 'MONTH',
              interval_count: 1
            },
            tenure_type: 'REGULAR',
            sequence: 1,
            total_cycles: 0,
            pricing_scheme: {
              fixed_price: {
                value: '9.99',
                currency_code: 'USD'
              }
            }
          }
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee: {
            value: '0',
            currency_code: 'USD'
          },
          setup_fee_failure_action: 'CONTINUE',
          payment_failure_threshold: 3
        },
        taxes: {
          percentage: '0',
          inclusive: false
        }
      })
    });
    
    if (!planResponse.ok) {
      const errorData = await planResponse.json();
      console.error('Plan creation error:', errorData);
      throw new Error(`Failed to create plan: ${errorData.message || 'Unknown error'}`);
    }
    
    const planData = await planResponse.json();
    const planId = planData.id;
    
    // Create the subscription in PayPal
    const { body } = await req.json();
    const userAction = body?.userAction || 'SUBSCRIBE_NOW';
    
    const subscriptionResponse = await fetch(`${config.apiUrl}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        plan_id: planId,
        application_context: {
          brand_name: 'Film Distribution Service',
          locale: 'en-US',
          shipping_preference: 'NO_SHIPPING',
          user_action: userAction,
          payment_method: {
            payer_selected: 'PAYPAL',
            payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
          },
          return_url: `${req.headers.get('origin')}/subscription?success=true`,
          cancel_url: `${req.headers.get('origin')}/subscription?success=false`
        },
        subscriber: {
          name: {
            given_name: 'Subscriber',
            surname: 'User'
          },
          email_address: user.email
        }
      })
    });
    
    if (!subscriptionResponse.ok) {
      const errorData = await subscriptionResponse.json();
      console.error('Subscription creation error:', errorData);
      throw new Error(`Failed to create subscription: ${errorData.message || 'Unknown error'}`);
    }
    
    const subscriptionData = await subscriptionResponse.json();
    
    // Store subscription info in database
    await supabaseClient
      .from('subscriptions')
      .insert({
        user_id: userId,
        subscription_id: subscriptionData.id,
        plan_id: planId,
        product_id: productId,
        status: subscriptionData.status,
        start_date: new Date().toISOString(),
        metadata: subscriptionData
      });
    
    return new Response(
      JSON.stringify({
        subscriptionId: subscriptionData.id,
        status: subscriptionData.status,
        links: subscriptionData.links
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
    
  } catch (error) {
    console.error('Error creating PayPal subscription:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create subscription' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
