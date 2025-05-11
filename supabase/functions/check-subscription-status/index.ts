
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.17.0';
import { corsHeaders } from '../_shared/cors.ts';

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
    
    // Check if user has a premium tier
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('tier')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      throw new Error('Failed to fetch user profile');
    }
    
    // Check for active subscription
    const { data: subscriptions, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (subError) {
      console.error('Error fetching subscription:', subError);
    }
    
    // Determine subscription status
    let status = 'INACTIVE';
    
    if (profile.tier === 'premium') {
      status = 'ACTIVE';
    } else if (subscriptions && subscriptions.length > 0) {
      status = subscriptions[0].status;
    }
    
    return new Response(
      JSON.stringify({
        status,
        isPremium: profile.tier === 'premium',
        subscription: subscriptions && subscriptions.length > 0 ? subscriptions[0] : null
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
    
  } catch (error) {
    console.error('Error checking subscription status:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to check subscription status' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
