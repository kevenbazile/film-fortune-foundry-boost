import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  getUserData, 
  fetchRevenueData, 
  fetchEarningsData, 
  setupRealtimeSubscriptions,
  exportEarningsToCSV
} from "./revenueDataService";
import { useDisputeHandling } from "./useDisputeHandling";

// Fix the re-export to use 'export type'
export type { RevenueData, Earning } from "./types";

export function useRevenueData() {
  const [revenue, setRevenue] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [userTier, setUserTier] = useState<'basic' | 'premium' | 'elite' | null>(null);
  const [filmId, setFilmId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { earnings, setEarnings, handleDispute } = useDisputeHandling([]);
  const { toast } = useToast();

  useEffect(() => {
    // Check user authentication and get user ID
    const initializeUserData = async () => {
      try {
        const userData = await getUserData();
        setUserId(userData.userId);
        setFilmId(userData.filmId);
        setUserTier(userData.userTier);
        
        if (userData.userId && userData.filmId) {
          // Now fetch revenue and earnings data
          await Promise.all([
            fetchAndSetRevenueData(userData.filmId),
            fetchAndSetEarningsData(userData.userId)
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

  // Set up realtime subscriptions when filmId is available
  useEffect(() => {
    if (!filmId) return;
    
    const cleanup = setupRealtimeSubscriptions(filmId, refreshData);
    
    return cleanup;
  }, [filmId]);

  const fetchAndSetRevenueData = async (filmId: string) => {
    if (!filmId) return;
    
    try {
      const data = await fetchRevenueData(filmId);
      setRevenue(data);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      toast({
        title: "Error",
        description: "Could not load revenue data. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const fetchAndSetEarningsData = async (userId: string) => {
    if (!userId) return;
    
    try {
      const data = await fetchEarningsData(userId);
      setEarnings(data);
    } catch (error) {
      console.error("Error fetching earnings data:", error);
      toast({
        title: "Error",
        description: "Could not load earnings history. Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  const exportToCSV = () => {
    try {
      exportEarningsToCSV(earnings);
      
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
      if (filmId && userId) {
        await Promise.all([
          fetchAndSetRevenueData(filmId),
          fetchAndSetEarningsData(userId)
        ]);
      }
      
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
