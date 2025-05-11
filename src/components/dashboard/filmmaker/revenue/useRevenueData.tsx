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
          
          // Get user tier
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('tier')
            .eq('id', sessionData.session.user.id)
            .single();
          
          if (profileData?.tier) {
            setUserTier(profileData.tier as 'basic' | 'premium' | 'elite');
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
          }
          
          // Now fetch revenue and earnings data
          await Promise.all([
            fetchRevenueData(filmData?.id),
            fetchEarningsData(sessionData.session.user.id)
          ]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    getUserData();
  }, []);

  const fetchRevenueData = async (filmId: string | null | undefined) => {
    if (!filmId) return;
    
    try {
      // Get revenue data from Supabase
      // Note: In a real app, you'd fetch actual data from revenue_shares or similar tables
      
      // For our implementation, we'll simulate revenue data
      const mockRevenueData: RevenueData = {
        totalRevenue: 5280.50,
        growthRate: 16.7,
        daysSinceRelease: 78,
        platformRevenue: [
          { name: "YouTube", revenue: 1250 },
          { name: "Amazon Prime", revenue: 2380 },
          { name: "Netflix", revenue: 1650 }
        ],
        growthTimeline: [
          { month: "Jan", revenue: 450 },
          { month: "Feb", revenue: 950 },
          { month: "Mar", revenue: 1800 },
          { month: "Apr", revenue: 2650 },
          { month: "May", revenue: 3980 },
          { month: "Jun", revenue: 5280 }
        ]
      };
      
      setRevenue(mockRevenueData);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      toast({
        title: "Error",
        description: "Could not load revenue data. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const fetchEarningsData = async (userId: string | null | undefined) => {
    if (!userId) return;
    
    try {
      // Get earnings data from Supabase
      // Note: In a real app, you'd fetch actual data from earnings or similar tables
      
      // For our implementation, we'll simulate earnings data
      setEarnings([
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
      ]);
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
      // const { error } = await supabase
      //   .from('earnings_disputes')
      //   .insert({
      //     earning_id: earningId,
      //     user_id: userId,
      //     reason,
      //     status: 'pending',
      //     created_at: new Date().toISOString()
      //   });
      
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
        fetchRevenueData(filmId),
        fetchEarningsData(userId)
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
