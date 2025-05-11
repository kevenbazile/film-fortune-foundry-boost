
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type DistributionStatus = 'encoding' | 'metadata' | 'submission' | 'live' | 'completed';

export type Distribution = {
  id: string;
  filmId: string;
  filmTitle: string;
  platform: string;
  platformUrl: string | null;
  status: DistributionStatus;
  submittedAt: string;
  completedAt: string | null;
  expectedLiveDate?: string;
  notes?: string;
};

export type DistributionStage = {
  stage: string;
  status: 'completed' | 'in-progress' | 'pending';
  completedOn: string | null;
  notes: string;
};

export type PlatformStatus = {
  platform: string;
  status: 'queued' | 'submitted' | 'processing' | 'live';
  expectedLiveDate: string;
  notes: string;
};

export function useDistributionData() {
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
  
  // Helper function to estimate a live date based on status and submission date
  const getExpectedLiveDate = (status: string, submittedAt: string): string => {
    const submissionDate = new Date(submittedAt);
    
    // Different statuses have different lead times
    const daysToAdd = 
      status === 'encoding' ? 7 : 
      status === 'metadata' ? 5 : 
      status === 'submission' ? 3 :
      status === 'live' ? 0 : 1;
      
    submissionDate.setDate(submissionDate.getDate() + daysToAdd);
    return submissionDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  // Helper function to generate contextual notes based on status
  const getDistributionNotes = (status: string): string => {
    switch(status) {
      case 'encoding':
        return 'Your film is being encoded to meet platform requirements.';
      case 'metadata':
        return 'Preparing metadata including descriptions, cast, and technical specs.';
      case 'submission':
        return 'Your film is being submitted to the platform.';
      case 'live':
        return 'Your film is now live and available to viewers.';
      case 'completed':
        return 'Distribution is complete and your film is available to viewers.';
      default:
        return 'Processing your film for distribution.';
    }
  };

  // Transform distribution data to progress stages for the UI
  const getDistributionStages = (): DistributionStage[] => {
    const latestDistribution = distributions[0];
    
    // If no distribution data, return default stages
    if (!latestDistribution) {
      return [
        { stage: "Submission Review", status: "pending", completedOn: null, notes: "Your film will be reviewed for distribution." },
        { stage: "Encoding & Optimization", status: "pending", completedOn: null, notes: "Your film will be encoded to meet platform requirements." },
        { stage: "Metadata Preparation", status: "pending", completedOn: null, notes: "All metadata including descriptions, cast, and technical specs will be prepared." },
        { stage: "Platform Submission", status: "pending", completedOn: null, notes: "Your film will be submitted to selected platforms." },
        { stage: "QA & Validation", status: "pending", completedOn: null, notes: "Quality assurance checks will ensure your film displays correctly on all platforms." },
        { stage: "Live Distribution", status: "pending", completedOn: null, notes: "Your film will be publicly available on all selected platforms." }
      ];
    }
    
    const currentStatus = latestDistribution.status;
    const submittedAt = new Date(latestDistribution.submittedAt);
    const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    
    // Map status to stages
    return [
      { 
        stage: "Submission Review", 
        status: "completed", 
        completedOn: submittedAt.toLocaleDateString('en-US', dateOptions),
        notes: "Your film has been reviewed and approved for distribution."
      },
      { 
        stage: "Encoding & Optimization", 
        status: currentStatus === 'encoding' ? 'in-progress' : 
               (currentStatus === 'metadata' || currentStatus === 'submission' || currentStatus === 'live' || currentStatus === 'completed') ? 'completed' : 'pending',
        completedOn: (currentStatus === 'metadata' || currentStatus === 'submission' || currentStatus === 'live' || currentStatus === 'completed') ? 
                    new Date(submittedAt.getTime() + 2*24*60*60*1000).toLocaleDateString('en-US', dateOptions) : null,
        notes: "Your film is being encoded to meet platform requirements."
      },
      { 
        stage: "Metadata Preparation", 
        status: currentStatus === 'metadata' ? 'in-progress' : 
               (currentStatus === 'submission' || currentStatus === 'live' || currentStatus === 'completed') ? 'completed' : 'pending',
        completedOn: (currentStatus === 'submission' || currentStatus === 'live' || currentStatus === 'completed') ? 
                    new Date(submittedAt.getTime() + 4*24*60*60*1000).toLocaleDateString('en-US', dateOptions) : null,
        notes: "All metadata including descriptions, cast, and technical specs are being prepared."
      },
      { 
        stage: "Platform Submission", 
        status: currentStatus === 'submission' ? 'in-progress' : 
               (currentStatus === 'live' || currentStatus === 'completed') ? 'completed' : 'pending',
        completedOn: (currentStatus === 'live' || currentStatus === 'completed') ? 
                    new Date(submittedAt.getTime() + 6*24*60*60*1000).toLocaleDateString('en-US', dateOptions) : null,
        notes: "Your film is being submitted to selected platforms."
      },
      { 
        stage: "QA & Validation", 
        status: currentStatus === 'live' && !latestDistribution.completedAt ? 'in-progress' : 
               (currentStatus === 'completed' || (currentStatus === 'live' && latestDistribution.completedAt)) ? 'completed' : 'pending',
        completedOn: (currentStatus === 'completed' || (currentStatus === 'live' && latestDistribution.completedAt)) ? 
                    new Date(submittedAt.getTime() + 8*24*60*60*1000).toLocaleDateString('en-US', dateOptions) : null,
        notes: "Quality assurance checks ensure your film displays correctly on all platforms."
      },
      { 
        stage: "Live Distribution", 
        status: currentStatus === 'completed' ? 'completed' : 'pending',
        completedOn: currentStatus === 'completed' ? latestDistribution.completedAt : null,
        notes: "Your film is publicly available on all selected platforms."
      }
    ];
  };
  
  // Get platform status information for display
  const getPlatformStatuses = (): PlatformStatus[] => {
    if (distributions.length === 0) {
      return [];
    }
    
    return distributions.map(dist => ({
      platform: dist.platform,
      status: dist.status === 'live' || dist.status === 'completed' ? 'live' : 
              dist.status === 'submission' ? 'submitted' : 
              dist.status === 'metadata' ? 'processing' : 'queued',
      expectedLiveDate: dist.expectedLiveDate || 'TBD',
      notes: dist.notes || 'Processing'
    }));
  };

  // Calculate progress percentage based on completed stages
  const calculateProgress = (): number => {
    const stages = getDistributionStages();
    const completedStages = stages.filter(stage => stage.status === "completed").length;
    return Math.floor((completedStages / stages.length) * 100);
  };

  return {
    distributions,
    distributionStages: getDistributionStages(),
    platformStatuses: getPlatformStatuses(),
    progress: calculateProgress(),
    loading,
    userTier,
    filmId,
    userId
  };
}
