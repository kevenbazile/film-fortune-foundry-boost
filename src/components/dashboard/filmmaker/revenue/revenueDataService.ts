
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Earning, RevenueData, UserFilmData } from "./types";

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

export async function fetchRevenueData(filmId: string): Promise<RevenueData | null> {
  if (!filmId) return null;
  
  try {
    // Get analytics data from film_analytics table
    const { data: analyticsData } = await supabase
      .from('film_analytics')
      .select('*')
      .eq('film_id', filmId)
      .single();

    // Get platform revenue data
    const { data: platformData } = await supabase
      .from('platform_revenue')
      .select('*')
      .eq('film_id', filmId);

    // Get revenue growth timeline
    const { data: growthData } = await supabase
      .from('revenue_growth')
      .select('*')
      .eq('film_id', filmId)
      .order('month', { ascending: true });

    // Get film release date to calculate days since release
    const { data: filmData } = await supabase
      .from('films')
      .select('created_at')
      .eq('id', filmId)
      .single();

    // Check if we have any real data
    if (analyticsData || (platformData && platformData.length > 0) || (growthData && growthData.length > 0)) {
      // Calculate days since release
      const releaseDate = filmData?.created_at ? new Date(filmData.created_at) : new Date();
      const daysSinceRelease = Math.floor((new Date().getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24));

      // Format platform revenue data
      const formattedPlatformData = platformData?.map(item => ({
        name: item.platform_name,
        revenue: item.revenue
      })) || [];

      // Format growth timeline data
      const formattedGrowthData = growthData?.map(item => ({
        month: item.month,
        revenue: item.revenue
      })) || [];

      return {
        totalRevenue: analyticsData?.total_revenue || 0,
        growthRate: analyticsData?.growth_rate || 0,
        daysSinceRelease,
        platformRevenue: formattedPlatformData,
        growthTimeline: formattedGrowthData
      };
    }
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    throw error;
  }
  
  // Return empty data structure if no real data exists
  return {
    totalRevenue: 0,
    growthRate: 0,
    daysSinceRelease: 0,
    platformRevenue: [],
    growthTimeline: []
  };
}

export async function fetchEarningsData(userId: string): Promise<Earning[]> {
  if (!userId) return [];
  
  try {
    // In a real app, we would fetch from revenue_shares table
    // For now, we'll use sample data since earnings aren't part of our tables yet
    const sampleEarnings: Earning[] = [
      {
        id: '1',
        date: '2025-04-15',
        platform: 'Netflix',
        amount: 1250.00,
        status: 'paid',
        payerInfo: {
          name: 'Netflix Inc.',
          type: 'platform'
        }
      },
      {
        id: '2',
        date: '2025-05-01',
        platform: 'YouTube',
        amount: 750.50,
        status: 'pending',
        payerInfo: {
          name: 'YouTube',
          type: 'platform'
        }
      },
      {
        id: '3',
        date: '2025-05-05',
        platform: 'Amazon Prime',
        amount: 950.75,
        status: 'pending',
        payerInfo: {
          name: 'Amazon Services LLC',
          type: 'platform'
        }
      }
    ];
    
    return sampleEarnings;
  } catch (error) {
    console.error("Error fetching earnings data:", error);
    throw error;
  }
}

export function setupRealtimeSubscriptions(filmId: string, onUpdate: () => void) {
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
      () => {
        console.log('Analytics update received, refreshing data...');
        onUpdate();
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
        onUpdate();
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
        onUpdate();
      }
    )
    .subscribe();

  // Return cleanup function that removes all channels
  return () => {
    supabase.removeChannel(analyticsChannel);
    supabase.removeChannel(platformChannel);
    supabase.removeChannel(growthChannel);
  };
}

export function exportEarningsToCSV(earnings: Earning[]) {
  const csvContent = [
    ['Date', 'Platform', 'Amount', 'Status', 'Payer'],
    ...earnings.map(e => [
      format(new Date(e.date), 'yyyy-MM-dd'),
      e.platform,
      e.amount.toString(),
      e.status,
      e.payerInfo.name
    ])
  ];

  const csvString = csvContent.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `earnings-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
}
