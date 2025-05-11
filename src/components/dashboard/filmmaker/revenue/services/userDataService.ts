
import { supabase } from "@/integrations/supabase/client";

export interface UserFilmData {
  userId: string | null;
  filmId: string | null;
  userTier: 'basic' | 'premium' | 'elite' | null;
}

export async function getUserData(): Promise<UserFilmData> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData?.session?.user?.id) {
    return { userId: null, filmId: null, userTier: null };
  }
  
  const userId = sessionData.session.user.id;
  
  // Get user subscription
  const { data: subscriptionData } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  let userTier: 'basic' | 'premium' | 'elite' = 'basic';
  
  if (subscriptionData) {
    // Extract tier from plan_id
    if (subscriptionData.plan_id.includes('premium')) {
      userTier = 'premium';
    } else if (subscriptionData.plan_id.includes('elite')) {
      userTier = 'elite';
    }
  } else {
    // Check profiles table as fallback
    const { data: profileData } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', userId)
      .single();
    
    if (profileData?.tier) {
      userTier = profileData.tier as 'basic' | 'premium' | 'elite';
    }
  }
  
  // Get most recent film ID
  const { data: filmData } = await supabase
    .from('films')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  return {
    userId,
    filmId: filmData?.id || null,
    userTier
  };
}
