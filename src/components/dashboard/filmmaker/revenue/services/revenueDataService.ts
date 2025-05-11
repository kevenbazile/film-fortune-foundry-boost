
import { supabase } from "@/integrations/supabase/client";
import { RevenueData } from "../types";

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
