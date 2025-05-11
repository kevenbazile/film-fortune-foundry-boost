
import { supabase } from "@/integrations/supabase/client";

export function setupRealtimeSubscriptions(filmId: string) {
  // Subscribe to analytics updates
  const analyticsChannel = supabase
    .channel('analytics-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'film_analytics',
        filter: `film_id=eq.${filmId}`
      },
      (payload) => {
        console.log('Analytics update received:', payload);
      }
    )
    .subscribe();

  // Subscribe to platform revenue updates
  const platformChannel = supabase
    .channel('platform-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'platform_revenue',
        filter: `film_id=eq.${filmId}`
      },
      () => {
        console.log('Platform revenue update, refreshing data...');
      }
    )
    .subscribe();

  // Subscribe to growth timeline updates
  const growthChannel = supabase
    .channel('growth-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'revenue_growth',
        filter: `film_id=eq.${filmId}`
      },
      () => {
        console.log('Revenue growth update, refreshing data...');
      }
    )
    .subscribe();

  // Return cleanup function
  return () => {
    supabase.removeChannel(analyticsChannel);
    supabase.removeChannel(platformChannel);
    supabase.removeChannel(growthChannel);
  };
}
