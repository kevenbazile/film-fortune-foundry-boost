
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActiveDistributions from './distribution/ActiveDistributions';
import PendingDistributions from './distribution/PendingDistributions';
import PlatformIssues from './distribution/PlatformIssues';
import SupportChatPanel from './SupportChatPanel';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const tabData = [
  { id: 'active', label: 'Active Distributions' },
  { id: 'pending', label: 'Pending Distributions' },
  { id: 'issues', label: 'Platform Issues' },
  { id: 'support', label: 'Support Chats' },
];

const DistributionManagement = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [activeDistributions, setActiveDistributions] = useState([]);
  const [pendingDistributions, setPendingDistributions] = useState([]);
  const [platformIssues, setPlatformIssues] = useState([]);
  const { toast } = useToast();

  // Fetch distributions when component mounts
  useEffect(() => {
    fetchDistributions();
  }, []);

  const fetchDistributions = async () => {
    try {
      // Fetch active distributions - using only the allowed enum values 'live' (not 'performance')
      const { data: activeData } = await supabase
        .from('distributions')
        .select('*, films(*)')
        .eq('status', 'live');

      // Fetch pending distributions
      const { data: pendingData } = await supabase
        .from('distributions')
        .select('*, films(*)')
        .in('status', ['encoding', 'metadata', 'submission']);

      setActiveDistributions(activeData || []);
      setPendingDistributions(pendingData || []);
      
      // Mock platform issues for now
      setPlatformIssues([
        {
          platform: 'Netflix',
          issue: 'API rate limiting issues',
          affectedFilms: '3 films',
          status: 'investigating',
          reportedDate: '2025-05-10'
        },
        {
          platform: 'Amazon Prime',
          issue: 'Metadata validation failures',
          affectedFilms: '2 films',
          status: 'resolved',
          reportedDate: '2025-05-09'
        }
      ]);
    } catch (error) {
      console.error('Error fetching distributions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load distribution data',
        variant: 'destructive',
      });
    }
  };

  const handleViewDistribution = (url: string) => {
    window.open(url, '_blank');
  };

  const handleAdvanceStage = async (id: string, status: "encoding" | "metadata" | "submission" | "live" | "completed") => {
    try {
      await supabase
        .from('distributions')
        .update({ status })
        .eq('id', id);
        
      toast({
        title: 'Status Updated',
        description: `Distribution moved to ${status} stage`,
      });
      
      fetchDistributions();
    } catch (error) {
      console.error('Error updating distribution:', error);
      toast({
        title: 'Error',
        description: 'Failed to update distribution status',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitIssue = (data: any) => {
    // In a real app, this would submit to the database
    setPlatformIssues(prevIssues => [...prevIssues, {
      platform: data.platform,
      issue: data.description,
      affectedFilms: data.affectedFilms,
      status: 'investigating',
      reportedDate: new Date().toISOString().split('T')[0]
    }]);
    
    toast({
      title: 'Issue Reported',
      description: 'Platform issue has been logged',
    });
  };

  return (
    <div className="space-y-6 p-6 pb-16">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Distribution Management</h2>
        <p className="text-muted-foreground mt-2">
          Manage film distribution across platforms and handle customer support.
        </p>
      </div>

      <Tabs
        defaultValue="active"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          {tabData.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <ActiveDistributions 
            distributions={activeDistributions} 
            onViewDistribution={handleViewDistribution} 
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <PendingDistributions 
            distributions={pendingDistributions}
            onAdvanceStage={handleAdvanceStage}
          />
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <PlatformIssues 
            issues={platformIssues}
            onSubmitIssue={handleSubmitIssue}
          />
        </TabsContent>
        
        <TabsContent value="support" className="space-y-4">
          <SupportChatPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DistributionManagement;
