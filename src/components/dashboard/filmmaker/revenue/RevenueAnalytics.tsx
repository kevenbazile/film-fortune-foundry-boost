
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface RevenueAnalyticsProps {
  revenue?: any;
  loading?: boolean;
  userTier: string | null;
}

const RevenueAnalytics = ({ loading: initialLoading = false, userTier }: RevenueAnalyticsProps) => {
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

  const setupRealtimeSubscriptions = (filmId: string) => {
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
          if (payload.new) {
            setAnalyticsData(payload.new);
          }
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
          // Re-fetch platform revenue data when updates occur
          supabase
            .from('platform_revenue')
            .select('*')
            .eq('film_id', filmId)
            .then(({ data }) => {
              if (data) {
                setPlatformRevenue(data);
              }
            });
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
          // Re-fetch growth data when updates occur
          supabase
            .from('revenue_growth')
            .select('*')
            .eq('film_id', filmId)
            .order('created_at', { ascending: true })
            .then(({ data }) => {
              if (data) {
                setRevenueGrowth(data);
              }
            });
        }
      )
      .subscribe();

    // Return cleanup function
    return () => {
      supabase.removeChannel(analyticsChannel);
      supabase.removeChannel(platformChannel);
      supabase.removeChannel(growthChannel);
    };
  };

  const chartConfig = {
    platforms: {
      label: "Platform Revenue",
      color: "#4f46e5", // Use direct color instead of theme
    },
    growth: {
      label: "Revenue Growth",
      color: "#10b981", // Use direct color instead of theme
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

  const renderTooltipContent = (entry: any) => {
    if (entry && entry.payload && entry.payload.length > 0) {
      const data = entry.payload[0].payload;
      return (
        <div className="p-2 bg-white border rounded-md shadow-md">
          <p className="text-sm font-medium text-gray-800">{data.platform_name}</p>
          <p className="text-xs text-gray-600">
            <span style={{ color: chartConfig.platforms.color }}>●</span>{" "}
            Revenue: ${data.revenue}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Revenue Analytics</CardTitle>
          <CardDescription>Analyzing your revenue data...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Check if revenue data is available and properly structured
  const hasRevenueData = analyticsData && 
    (analyticsData.total_revenue > 0 || 
    (platformRevenue && platformRevenue.length > 0) || 
    (revenueGrowth && revenueGrowth.length > 0));

  if (!hasRevenueData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Revenue Analytics</CardTitle>
          <CardDescription>
            {userTier ? "Not enough data to show analytics yet." : "Subscribe to view analytics."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            {userTier 
              ? "We'll start showing data once your film begins generating revenue."
              : "Purchase a subscription plan to access revenue tracking features."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Revenue Analytics</CardTitle>
        <CardDescription>Overview of your film's revenue performance.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center justify-between p-4 bg-muted rounded-md">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
              <div className="text-2xl font-bold mt-2">
                <DollarSign className="mr-2 h-4 w-4 inline-block" />
                {totalRevenue.toFixed(2)}
              </div>
            </div>
            <ArrowUpRight className="h-6 w-6 text-green-500" />
          </div>
          <div className="flex items-center justify-between p-4 bg-muted rounded-md">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Revenue Growth</span>
              <div className="text-2xl font-bold mt-2">
                <TrendingUp className="mr-2 h-4 w-4 inline-block" />
                {growthRate.toFixed(2)}%
              </div>
            </div>
            {growthRate >= 0 ? (
              <ArrowUpRight className="h-6 w-6 text-green-500" />
            ) : (
              <ArrowDownRight className="h-6 w-6 text-red-500" />
            )}
          </div>
        </div>

        {platformRevenue && platformRevenue.length > 0 && (
          <div className="mb-8">
            <h4 className="text-md font-semibold mb-2">Revenue by Platform</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform_name" />
                <YAxis />
                <Tooltip content={renderTooltipContent} />
                <Legend />
                <Bar 
                  dataKey="revenue" 
                  fill={chartConfig.platforms.color} 
                  name={chartConfig.platforms.label} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueAnalytics;
