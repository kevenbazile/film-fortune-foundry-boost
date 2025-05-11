import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ActiveDistributions from "./distribution/ActiveDistributions";
import PendingDistributions from "./distribution/PendingDistributions";
import PlatformIssues from "./distribution/PlatformIssues";

const DistributionManagement = () => {
  const [activeDistributions, setActiveDistributions] = useState([]);
  const [pendingDistributions, setPendingDistributions] = useState([]);
  const [platformIssues, setPlatformIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDistributions();
    setupRealtimeSubscription();
  }, []);

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('distribution-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'distributions'
        },
        () => {
          fetchDistributions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchDistributions = async () => {
    setLoading(true);
    try {
      // Fetch active distributions
      const { data: activeData, error: activeError } = await supabase
        .from('distributions')
        .select(`
          id,
          film_id,
          platform,
          platform_url,
          status,
          submitted_at,
          completed_at,
          films (title, director)
        `)
        .in('status', ['live', 'completed'])
        .order('submitted_at', { ascending: false });

      if (activeError) throw activeError;
      setActiveDistributions(activeData || []);

      // Fetch pending distributions
      const { data: pendingData, error: pendingError } = await supabase
        .from('distributions')
        .select(`
          id,
          film_id,
          platform,
          status,
          submitted_at,
          films (title, director)
        `)
        .in('status', ['encoding', 'metadata', 'submission'])
        .order('submitted_at', { ascending: false });

      if (pendingError) throw pendingError;
      setPendingDistributions(pendingData || []);

      // For now, we'll keep platform issues static as they might be managed differently
      // In a real implementation, this would also come from the database
    } catch (error) {
      console.error('Error fetching distributions:', error);
      toast({
        variant: "destructive",
        title: "Failed to load distribution data",
        description: "Please try again or contact support if the problem persists.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDistributionStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('distributions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString(),
          ...(newStatus === 'completed' ? { completed_at: new Date().toISOString() } : {})
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Distribution updated",
        description: `Status changed to ${newStatus}.`,
      });

      fetchDistributions();
    } catch (error) {
      console.error('Error updating distribution:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Could not update distribution status.",
      });
    }
  };

  const handleViewDistribution = (url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast({
        description: "No platform URL available for this distribution."
      });
    }
  };

  const onSubmitIssue = async (data) => {
    toast({
      title: "Issue reported",
      description: "The platform issue has been reported to the team.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading distribution data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Distributions</TabsTrigger>
          <TabsTrigger value="pending">Pending Distributions</TabsTrigger>
          <TabsTrigger value="issues">Platform Issues</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-6">
          <ActiveDistributions 
            distributions={activeDistributions} 
            onViewDistribution={handleViewDistribution} 
          />
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          <PendingDistributions 
            distributions={pendingDistributions} 
            onAdvanceStage={updateDistributionStatus} 
          />
        </TabsContent>
        
        <TabsContent value="issues" className="mt-6">
          <PlatformIssues 
            issues={platformIssues} 
            onSubmitIssue={onSubmitIssue} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DistributionManagement;
