
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type Commission = {
  id: string;
  filmTitle: string;
  platform: string;
  totalRevenue: number;
  companyCommission: number;
  filmmakerShare: number;
  platformFee: number;
  periodStart: string;
  periodEnd: string;
};

export type Payment = {
  id: string;
  date: string;
  platform: string;
  amount: number;
  status: 'pending' | 'paid' | 'disputed';
  payerInfo: {
    name: string;
    type: 'platform' | 'direct';
  };
};

export function useCommissionData() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userTier, setUserTier] = useState<'basic' | 'premium' | 'elite' | null>(null);
  const [filmId, setFilmId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check user authentication and get user ID
    const initializeUserData = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session?.user) {
          setLoading(false);
          return;
        }
        
        setUserId(session.session.user.id);
        
        // Fetch user tier from profiles
        const { data: profileData } = await supabase
          .from('profiles')
          .select('tier')
          .eq('id', session.session.user.id)
          .single();
          
        if (profileData) {
          setUserTier(profileData.tier);
        }
        
        // Get most recent film
        const { data: filmData } = await supabase
          .from('films')
          .select('id')
          .eq('user_id', session.session.user.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (filmData && filmData.length > 0) {
          setFilmId(filmData[0].id);
          
          // Now fetch commission and payments data
          await Promise.all([
            fetchCommissionData(filmData[0].id),
            fetchPaymentHistory(session.session.user.id)
          ]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeUserData();
  }, []);

  useEffect(() => {
    if (!filmId) return;
    
    const channel = supabase
      .channel('revenue-shares-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'revenue_shares'
        },
        () => {
          if (filmId) fetchCommissionData(filmId);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [filmId]);

  const fetchCommissionData = async (filmId: string) => {
    if (!filmId) return;
    
    try {
      const { data, error } = await supabase
        .from('revenue_shares')
        .select(`
          id,
          platform,
          total_revenue,
          company_commission,
          filmmaker_share,
          platform_fee,
          revenue_period_start,
          revenue_period_end,
          films(title)
        `)
        .eq('film_id', filmId);
        
      if (error) throw error;
      
      if (data) {
        const formattedData: Commission[] = data.map((item) => ({
          id: item.id,
          filmTitle: item.films?.title || 'Unknown Film',
          platform: item.platform,
          totalRevenue: item.total_revenue,
          companyCommission: item.company_commission,
          filmmakerShare: item.filmmaker_share,
          platformFee: item.platform_fee,
          periodStart: item.revenue_period_start,
          periodEnd: item.revenue_period_end
        }));
        
        setCommissions(formattedData);
      }
    } catch (error) {
      console.error("Error fetching commission data:", error);
      toast({
        title: "Error",
        description: "Could not load commission data. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const fetchPaymentHistory = async (userId: string) => {
    if (!userId) return;
    
    try {
      // In a real implementation, this would fetch from a payments table
      // For now, we'll use sample data
      const samplePayments: Payment[] = [
        {
          id: '1',
          date: '2025-04-10',
          platform: 'Netflix',
          amount: 875.25,
          status: 'paid',
          payerInfo: {
            name: 'Netflix Inc.',
            type: 'platform'
          }
        },
        {
          id: '2',
          date: '2025-04-25',
          platform: 'YouTube',
          amount: 452.50,
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
          amount: 623.75,
          status: 'pending',
          payerInfo: {
            name: 'Amazon Services LLC',
            type: 'platform'
          }
        }
      ];
      
      setPayments(samplePayments);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      toast({
        title: "Error",
        description: "Could not load payment history. Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  const handleDispute = async (paymentId: string, reason: string) => {
    try {
      // In a real implementation, this would update a database entry
      toast({
        title: "Dispute Submitted",
        description: "Your payment dispute has been submitted for review.",
      });
      
      // Refresh payments with updated status
      if (userId) {
        await fetchPaymentHistory(userId);
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error submitting dispute:", error);
      toast({
        title: "Error",
        description: "Could not submit dispute. Please try again later.",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };
  
  const exportToCSV = () => {
    try {
      // Create CSV content
      const headers = ['Date', 'Platform', 'Payer', 'Amount', 'Status'];
      const csvRows = [headers];
      
      payments.forEach(payment => {
        const row = [
          payment.date,
          payment.platform,
          payment.payerInfo.name,
          payment.amount,
          payment.status
        ];
        csvRows.push(row);
      });
      
      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'commission_payments.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Your payment history has been exported to CSV.",
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast({
        title: "Export Failed",
        description: "Could not export payment history.",
        variant: "destructive"
      });
    }
  };
  
  const refreshData = async () => {
    setLoading(true);
    try {
      if (filmId && userId) {
        await Promise.all([
          fetchCommissionData(filmId),
          fetchPaymentHistory(userId)
        ]);
      }
      
      toast({
        title: "Data Refreshed",
        description: "Your commission and payment data has been updated.",
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
    commissions,
    payments,
    loading,
    userTier,
    filmId,
    userId,
    handleDispute,
    exportToCSV,
    refreshData
  };
}
