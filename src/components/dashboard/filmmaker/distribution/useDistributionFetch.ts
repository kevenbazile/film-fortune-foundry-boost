
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Distribution } from "./types";
import { getDistributionNotes, getExpectedLiveDate } from "./helpers";

export function useDistributionFetch() {
  const [distributions, setDistributions] = useState<Distribution[]>([]);
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
          .select('id, title')
          .eq('user_id', session.session.user.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (filmData && filmData.length > 0) {
          setFilmId(filmData[0].id);
          
          // Fetch distribution data
          await fetchDistributionData(filmData[0].id);
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
    
    // Set up realtime subscription for distribution updates
    const channel = supabase
      .channel('distribution-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'distributions',
          filter: `film_id=eq.${filmId}`
        },
        () => {
          if (filmId) fetchDistributionData(filmId);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [filmId]);

  const fetchDistributionData = async (filmId: string) => {
    try {
      const { data, error } = await supabase
        .from('distributions')
        .select(`
          id,
          film_id,
          platform,
          platform_url,
          status,
          submitted_at,
          completed_at,
          films!inner(title)
        `)
        .eq('film_id', filmId);
        
      if (error) throw error;
      
      if (data) {
        const formattedData: Distribution[] = data.map((item) => ({
          id: item.id,
          filmId: item.film_id,
          filmTitle: item.films.title,
          platform: item.platform,
          platformUrl: item.platform_url,
          status: item.status,
          submittedAt: item.submitted_at,
          completedAt: item.completed_at,
          expectedLiveDate: getExpectedLiveDate(item.status, item.submitted_at),
          notes: getDistributionNotes(item.status)
        }));
        
        setDistributions(formattedData);
      }
    } catch (error) {
      console.error("Error fetching distribution data:", error);
      toast({
        title: "Error",
        description: "Could not load distribution data. Please try again later.",
        variant: "destructive"
      });
    }
  };

  return {
    distributions,
    loading,
    userTier,
    filmId,
    userId
  };
}
