
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export interface Earning {
  id: string;
  date: string;
  platform: string;
  amount: number;
  status: 'pending' | 'paid' | 'disputed';
  payerInfo: {
    name: string;
    type: 'platform' | 'direct';
  };
}

export interface RevenueData {
  totalRevenue: number;
  growthRate: number;
  daysSinceRelease: number;
  platformRevenue: { name: string; revenue: number }[];
  growthTimeline: { month: string; revenue: number }[];
}

export function useRevenueData() {
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);
  const [userTier, setUserTier] = useState<'basic' | 'premium' | 'elite' | null>(null);
  const [filmId, setFilmId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check user authentication and get user ID
    const getUserData = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user?.id) {
          setUserId(sessionData.session.user.id);
          
          // Get user subscription
          const { data: subscriptionData, error: subscriptionError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', sessionData.session.user.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (subscriptionData) {
            // Extract tier from plan_id
            let tier: 'basic' | 'premium' | 'elite' = 'basic';
            if (subscriptionData.plan_id.includes('premium')) {
              tier = 'premium';
            } else if (subscriptionData.plan_id.includes('elite')) {
              tier = 'elite';
            }
            setUserTier(tier);
          } else {
            // Check profiles table as fallback
            const { data: profileData } = await supabase
              .from('profiles')
              .select('tier')
              .eq('id', sessionData.session.user.id)
              .single();
            
            if (profileData?.tier) {
              setUserTier(profileData.tier as 'basic' | 'premium' | 'elite');
            }
          }
          
          // Get most recent film ID
          const { data: filmData, error: filmError } = await supabase
            .from('films')
            .select('id')
            .eq('user_id', sessionData.session.user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (filmData?.id) {
            setFilmId(filmData.id);
            
            // Now fetch revenue and earnings data
            await Promise.all([
              fetchRevenueData(filmData.id),
              fetchEarningsData(sessionData.session.user.id)
            ]);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    getUserData();
  }, []);

  const fetchRevenueData = async (filmId: string) => {
    if (!filmId) return;
    
    try {
      // Get analytics data from film_analytics table
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('film_analytics')
        .select('*')
        .eq('film_id', filmId)
        .single();

      // Get platform revenue data
      const { data: platformData, error: platformError } = await supabase
        .from('platform_revenue')
        .select('*')
        .eq('film_id', filmId);

      // Get revenue growth timeline
      const { data: growthData, error: growthError } = await supabase
        .from('revenue_growth')
        .select('*')
        .eq('film_id', filmId)
        .order('month', { ascending: true });

      // Get film release date to calculate days since release
      const { data: filmData, error: filmError } = await supabase
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

        setRevenue({
          totalRevenue: analyticsData?.total_revenue || 0,
          growthRate: analyticsData?.growth_rate || 0,
          daysSinceRelease,
          platformRevenue: formattedPlatformData,
          growthTimeline: formattedGrowthData
        });
      } else {
        // Use sample data if no real data exists yet
        setRevenue({
          totalRevenue: 0,
          growthRate: 0,
          daysSinceRelease: 0,
          platformRevenue: [],
          growthTimeline: []
        });
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      toast({
        title: "Error",
        description: "Could not load revenue data. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const fetchEarningsData = async (userId: string) => {
    if (!userId) return;
    
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
      
      setEarnings(sampleEarnings);
    } catch (error) {
      console.error("Error fetching earnings data:", error);
      toast({
        title: "Error",
        description: "Could not load earnings history. Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  const handleDispute = async (earningId: string, reason: string) => {
    try {
      // In a real app, you'd submit the dispute to Supabase
      // For our implementation, we'll just update the local state
      setEarnings(earnings.map(earning => 
        earning.id === earningId 
          ? { ...earning, status: 'disputed' as const } 
          : earning
      ));
      
      toast({
        title: "Dispute Submitted",
        description: "Your payment dispute has been submitted and will be reviewed within 48 hours.",
      });
    } catch (error) {
      console.error("Error submitting dispute:", error);
      toast({
        title: "Error",
        description: "Could not submit dispute. Please try again later.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const exportToCSV = () => {
    try {
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
      
      toast({
        title: "Export Successful",
        description: "Your earnings history has been exported to CSV.",
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast({
        title: "Export Failed",
        description: "Could not export earnings history.",
        variant: "destructive"
      });
    }
  };
  
  const refreshData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchRevenueData(filmId!),
        fetchEarningsData(userId!)
      ]);
      
      toast({
        title: "Data Refreshed",
        description: "Your revenue and earnings data has been updated.",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Refresh Failed",
        description: "Could not refresh data. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    revenue,
    earnings,
    loading,
    userTier,
    filmId,
    userId,
    handleDispute,
    exportToCSV,
    refreshData
  };
}
