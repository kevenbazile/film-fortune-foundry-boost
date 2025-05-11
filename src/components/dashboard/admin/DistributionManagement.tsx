import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertCircle, Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
      case "live":
      case "completed":
        return <Badge className="bg-green-500">{status}</Badge>;
      case "encoding":
        return <Badge className="bg-yellow-500">{status}</Badge>;
      case "metadata":
        return <Badge className="bg-blue-500">{status}</Badge>;
      case "submission":
        return <Badge className="bg-purple-500">{status}</Badge>;
      case "investigating":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">{status}</Badge>;
      case "in progress":
        return <Badge className="bg-blue-500">{status}</Badge>;
      case "resolved":
        return <Badge className="bg-green-500">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const issueForm = useForm({
    defaultValues: {
      platform: "",
      severity: "",
      description: "",
      affectedFilms: ""
    }
  });

  const onSubmitIssue = async (data) => {
    toast({
      title: "Issue reported",
      description: "The platform issue has been reported to the team.",
    });
    
    issueForm.reset();
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
          <Card>
            <CardHeader>
              <CardTitle>Active Film Distributions</CardTitle>
              <CardDescription>Currently active film distribution contracts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Distribution ID</TableHead>
                    <TableHead>Film Title</TableHead>
                    <TableHead>Filmmaker</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeDistributions.length > 0 ? (
                    activeDistributions.map((dist) => (
                      <TableRow key={dist.id}>
                        <TableCell className="font-mono">{dist.id.substring(0, 8)}</TableCell>
                        <TableCell className="font-medium">{dist.films?.title || "Unknown Film"}</TableCell>
                        <TableCell>{dist.films?.director || "Unknown"}</TableCell>
                        <TableCell>{dist.platform}</TableCell>
                        <TableCell>{new Date(dist.submitted_at).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(dist.status)}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              if (dist.platform_url) {
                                window.open(dist.platform_url, '_blank');
                              } else {
                                toast({
                                  description: "No platform URL available for this distribution."
                                });
                              }
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No active distributions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Film Distributions</CardTitle>
              <CardDescription>Films currently in the distribution pipeline</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Distribution ID</TableHead>
                    <TableHead>Film Title</TableHead>
                    <TableHead>Filmmaker</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Current Stage</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDistributions.length > 0 ? (
                    pendingDistributions.map((dist) => (
                      <TableRow key={dist.id}>
                        <TableCell className="font-mono">{dist.id.substring(0, 8)}</TableCell>
                        <TableCell className="font-medium">{dist.films?.title || "Unknown Film"}</TableCell>
                        <TableCell>{dist.films?.director || "Unknown"}</TableCell>
                        <TableCell>{dist.platform}</TableCell>
                        <TableCell>{getStatusBadge(dist.status)}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="outline">Details</Button>
                          <Button 
                            size="sm"
                            onClick={() => {
                              // Advance to next stage
                              let nextStatus;
                              switch (dist.status) {
                                case 'encoding':
                                  nextStatus = 'metadata';
                                  break;
                                case 'metadata':
                                  nextStatus = 'submission';
                                  break;
                                case 'submission':
                                  nextStatus = 'live';
                                  break;
                                default:
                                  nextStatus = 'encoding';
                              }
                              updateDistributionStatus(dist.id, nextStatus);
                            }}
                          >
                            Advance Stage
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No pending distributions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Distribution Pipeline Stages</CardTitle>
              <CardDescription>Overview of the film distribution process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <div className="text-center p-4 rounded-md bg-muted flex-1 mx-1">
                  <div className="font-bold mb-1">1. Encoding</div>
                  <div className="text-xs text-muted-foreground">Format conversion and quality control</div>
                </div>
                <div className="text-center p-4 rounded-md bg-muted flex-1 mx-1">
                  <div className="font-bold mb-1">2. Metadata</div>
                  <div className="text-xs text-muted-foreground">Title, description, artwork preparation</div>
                </div>
                <div className="text-center p-4 rounded-md bg-muted flex-1 mx-1">
                  <div className="font-bold mb-1">3. Submission</div>
                  <div className="text-xs text-muted-foreground">Platform submission and approval</div>
                </div>
                <div className="text-center p-4 rounded-md bg-muted flex-1 mx-1">
                  <div className="font-bold mb-1">4. Live</div>
                  <div className="text-xs text-muted-foreground">Available to viewers</div>
                </div>
                <div className="text-center p-4 rounded-md bg-muted flex-1 mx-1">
                  <div className="font-bold mb-1">5. Performance</div>
                  <div className="text-xs text-muted-foreground">Tracking views and revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="issues" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Distribution Issues</CardTitle>
              <CardDescription>Current technical issues affecting film distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead>Issue Description</TableHead>
                    <TableHead>Affected Films</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {platformIssues.length > 0 ? (
                    platformIssues.map((issue, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{issue.platform}</TableCell>
                        <TableCell>{issue.issue}</TableCell>
                        <TableCell>{issue.affectedFilms}</TableCell>
                        <TableCell>{getStatusBadge(issue.status)}</TableCell>
                        <TableCell>{issue.reportedDate}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="outline">Update Status</Button>
                          <Button size="sm" variant={issue.status === 'resolved' ? 'outline' : 'default'}>
                            {issue.status === 'resolved' ? 'Reopen' : 'Resolve'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No platform issues reported
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Submit Platform Issue Report</CardTitle>
              <CardDescription>Report a new issue affecting film distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...issueForm}>
                <form onSubmit={issueForm.handleSubmit(onSubmitIssue)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={issueForm.control}
                      name="platform"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platform</FormLabel>
                          <FormControl>
                            <select {...field} className="w-full border rounded-md p-2">
                              <option value="">Select Platform</option>
                              <option value="netflix">Netflix</option>
                              <option value="amazon">Amazon Prime</option>
                              <option value="hulu">Hulu</option>
                              <option value="disney">Disney+</option>
                              <option value="apple">Apple TV+</option>
                              <option value="hbo">HBO Max</option>
                              <option value="paramount">Paramount+</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={issueForm.control}
                      name="severity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Severity</FormLabel>
                          <FormControl>
                            <select {...field} className="w-full border rounded-md p-2">
                              <option value="">Select Severity</option>
                              <option value="low">Low - Minor Impact</option>
                              <option value="medium">Medium - Partial Impact</option>
                              <option value="high">High - Major Impact</option>
                              <option value="critical">Critical - Complete Failure</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={issueForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Description</FormLabel>
                        <FormControl>
                          <textarea 
                            {...field} 
                            className="w-full h-24 border rounded-md p-2" 
                            placeholder="Describe the issue in detail..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={issueForm.control}
                    name="affectedFilms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Affected Films</FormLabel>
                        <FormControl>
                          <textarea 
                            {...field} 
                            className="w-full h-16 border rounded-md p-2" 
                            placeholder="List the film IDs affected by this issue..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button type="submit" className="space-x-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>Submit Issue Report</span>
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DistributionManagement;
