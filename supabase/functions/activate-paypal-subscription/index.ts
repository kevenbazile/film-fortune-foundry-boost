
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
    
    const { body } = await req.json();
    const { subscriptionId } = body;
    
    if (!subscriptionId) {
      throw new Error('Subscription ID is required');
    }
    
    const userId = user.id;
    const config = getPayPalConfig();
    
    // Get access token from PayPal
    const accessToken = await createAccessToken();
    
    if (!accessToken) {
      throw new Error('Failed to get PayPal access token');
    }
    
    // Get subscription details from PayPal
    const subscriptionResponse = await fetch(`${config.apiUrl}/v1/billing/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    
    if (!subscriptionResponse.ok) {
      const errorData = await subscriptionResponse.json();
      console.error('Subscription fetch error:', errorData);
      throw new Error(`Failed to fetch subscription: ${errorData.message || 'Unknown error'}`);
    }
    
    const subscriptionData = await subscriptionResponse.json();
    
    // Update user tier to premium in profiles table
    await supabaseClient
      .from('profiles')
      .update({ tier: 'premium' })
      .eq('id', userId);
    
    // Update subscription status in database
    const { error } = await supabaseClient
      .from('subscriptions')
      .update({
        status: subscriptionData.status,
        updated_at: new Date().toISOString(),
        metadata: subscriptionData
      })
      .eq('subscription_id', subscriptionId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error updating subscription in database:', error);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        status: subscriptionData.status
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
    
  } catch (error) {
    console.error('Error activating PayPal subscription:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to activate subscription' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
