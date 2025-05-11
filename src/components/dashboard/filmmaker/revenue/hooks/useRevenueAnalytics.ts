
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { setupRealtimeSubscriptions } from "../services/revenueRealtimeService";

export function useRevenueAnalytics(initialLoading = false, userTier: string | null) {
  const [loading, setLoading] = useState(initialLoading);
  const [filmId, setFilmId] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any | null>(null);
  const [platformRevenue, setPlatformRevenue] = useState<any[]>([]);
  const [revenueGrowth, setRevenueGrowth] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserFilm = async () => {
      try {
        // Get user's most recent film
        const { data: userData } = await supabase.auth.getSession();
        if (!userData.session?.user) {
          return;
        }

        const { data: films, error: filmError } = await supabase
          .from('films')
          .select('id')
          .eq('user_id', userData.session.user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (filmError) {
          console.error('Error fetching films:', filmError);
          return;
        }

        if (films && films.length > 0) {
          setFilmId(films[0].id);
          fetchRevenueData(films[0].id);
        }
      } catch (error) {
        console.error('Error fetching user film:', error);
      }
    };

    fetchUserFilm();
  }, []);

  const fetchRevenueData = async (filmId: string) => {
    if (!filmId || !userTier) return;
    
    setLoading(true);
    try {
      // Fetch total revenue and growth rate
      const { data: analytics, error: analyticsError } = await supabase
        .from('film_analytics')
        .select('*')
        .eq('film_id', filmId)
        .single();
        
      if (analyticsError && analyticsError.code !== 'PGRST116') {
        console.error('Error fetching analytics:', analyticsError);
      }
      
      // Fetch platform revenue data
      const { data: platforms, error: platformsError } = await supabase
        .from('platform_revenue')
        .select('*')
        .eq('film_id', filmId);
        
      if (platformsError) {
        console.error('Error fetching platform revenue:', platformsError);
      } else if (platforms) {
        setPlatformRevenue(platforms);
      }
      
      // Fetch revenue growth timeline
      const { data: growth, error: growthError } = await supabase
        .from('revenue_growth')
        .select('*')
        .eq('film_id', filmId)
        .order('created_at', { ascending: true });
        
      if (growthError) {
        console.error('Error fetching revenue growth:', growthError);
      } else if (growth) {
        setRevenueGrowth(growth);
      }

      // If we have analytics data, set it
      if (analytics) {
        setAnalyticsData(analytics);
      } else {
        // If no real data exists yet, create a default structure
        setAnalyticsData({
          total_revenue: 0,
          growth_rate: 0
        });
      }

      // Set up real-time subscriptions for updates
      setupRealtimeSubscriptions(filmId);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalRevenue = () => {
    if (!analyticsData) return 0;
    return analyticsData.total_revenue || 0;
  };

  const calculateRevenueGrowth = () => {
    if (!analyticsData) return 0;
    return analyticsData.growth_rate || 0;
  };

  const totalRevenue = calculateTotalRevenue();
  const growthRate = calculateRevenueGrowth();

  // Check if revenue data is available and properly structured
  const hasRevenueData = analyticsData && 
    (analyticsData.total_revenue > 0 || 
    (platformRevenue && platformRevenue.length > 0) || 
    (revenueGrowth && revenueGrowth.length > 0));

  return {
    loading,
    filmId,
    analyticsData,
    platformRevenue,
    revenueGrowth,
    totalRevenue,
    growthRate,
    hasRevenueData
  };
}
