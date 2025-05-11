
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useDistributionData } from "./distribution/useDistributionData";

const DistributionTracker = () => {
  const { 
    distributionStages, 
    platformStatuses, 
    progress,
    loading, 
    userTier 
  } = useDistributionData();
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-muted-foreground">Pending</Badge>;
      case "submitted":
        return <Badge className="bg-purple-500">Submitted</Badge>;
      case "processing":
        return <Badge className="bg-yellow-500">Processing</Badge>;
      case "queued":
        return <Badge variant="outline" className="text-muted-foreground">Queued</Badge>;
      case "live":
        return <Badge className="bg-green-500">Live</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading your distribution data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Distribution Progress</CardTitle>
          <CardDescription>
            Overall progress: {progress}% complete
            <Progress value={progress} className="mt-2" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {distributionStages.map((stage, index) => (
              <div key={index} className="relative pl-8 pb-8">
                {/* Connecting line */}
                {index < distributionStages.length - 1 && (
                  <div className={`absolute left-[15px] top-[30px] h-full w-0.5 ${stage.status === 'completed' ? 'bg-primary' : 'bg-muted-foreground/20'}`}></div>
                )}
                
                {/* Status indicator */}
                <div className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 ${stage.status === 'completed' ? 'border-primary bg-primary text-primary-foreground' : stage.status === 'in-progress' ? 'border-blue-500 bg-blue-500/20' : 'border-muted-foreground/20 bg-background'}`}>
                  {stage.status === 'completed' && <Check className="h-4 w-4" />}
                  {stage.status === 'in-progress' && <div className="h-2 w-2 rounded-full bg-blue-500"></div>}
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center">
                    <h3 className="font-medium leading-none">{stage.stage}</h3>
                    <div className="ml-auto">{getStatusBadge(stage.status)}</div>
                  </div>
                  {stage.completedOn && (
                    <p className="text-xs text-muted-foreground">Completed on: {stage.completedOn}</p>
                  )}
                  <p className="text-sm text-muted-foreground">{stage.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform Distribution Status</CardTitle>
          <CardDescription>Current status of your film on each platform</CardDescription>
        </CardHeader>
        <CardContent>
          {platformStatuses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expected Live Date</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {platformStatuses.map((platform, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{platform.platform}</TableCell>
                    <TableCell>{getStatusBadge(platform.status)}</TableCell>
                    <TableCell>{platform.expectedLiveDate}</TableCell>
                    <TableCell className="text-muted-foreground">{platform.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Info className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No platform distribution information available yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Your film will appear here once the distribution process begins.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {platformStatuses.length > 0 && (
        <Alert>
          <AlertTitle>Important Distribution Update</AlertTitle>
          <AlertDescription>
            Your film is on track for distribution across all platforms.
            First viewership data will be available approximately 14 days after your film goes live. 
            Please check back regularly for updates.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DistributionTracker;
