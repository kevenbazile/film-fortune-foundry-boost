
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";

const DistributionTracker = () => {
  const distributionProcess = [
    { stage: "Submission Review", status: "completed", completedOn: "Jan 15, 2024", notes: "Your film has been reviewed and approved for distribution." },
    { stage: "Encoding & Optimization", status: "completed", completedOn: "Jan 22, 2024", notes: "Your film has been encoded to meet platform requirements." },
    { stage: "Metadata Preparation", status: "completed", completedOn: "Jan 28, 2024", notes: "All metadata including descriptions, cast, and technical specs have been prepared." },
    { stage: "Platform Submission", status: "in-progress", completedOn: null, notes: "Your film is being submitted to selected platforms." },
    { stage: "QA & Validation", status: "pending", completedOn: null, notes: "Quality assurance checks will ensure your film displays correctly on all platforms." },
    { stage: "Live Distribution", status: "pending", completedOn: null, notes: "Your film will be publicly available on all selected platforms." }
  ];

  const platformStatus = [
    { platform: "Netflix", status: "submitted", expectedLive: "Mar 15, 2024", notes: "Currently in review queue" },
    { platform: "Amazon Prime", status: "processing", expectedLive: "Mar 10, 2024", notes: "Metadata verification in progress" },
    { platform: "Hulu", status: "submitted", expectedLive: "Mar 20, 2024", notes: "Awaiting content review" },
    { platform: "Apple TV+", status: "queued", expectedLive: "Mar 25, 2024", notes: "Scheduled for submission" },
    { platform: "Disney+", status: "queued", expectedLive: "Apr 5, 2024", notes: "Scheduled for submission" }
  ];

  // Calculate progress percentage based on completed stages
  const completedStages = distributionProcess.filter(stage => stage.status === "completed").length;
  const totalStages = distributionProcess.length;
  const progressPercentage = Math.floor((completedStages / totalStages) * 100);

  const getStatusBadge = (status) => {
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
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Distribution Progress</CardTitle>
          <CardDescription>
            Overall progress: {progressPercentage}% complete
            <Progress value={progressPercentage} className="mt-2" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {distributionProcess.map((stage, index) => (
              <div key={index} className="relative pl-8 pb-8">
                {/* Connecting line */}
                {index < distributionProcess.length - 1 && (
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
              {platformStatus.map((platform, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{platform.platform}</TableCell>
                  <TableCell>{getStatusBadge(platform.status)}</TableCell>
                  <TableCell>{platform.expectedLive}</TableCell>
                  <TableCell className="text-muted-foreground">{platform.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Alert>
        <AlertTitle>Important Distribution Update</AlertTitle>
        <AlertDescription>
          Your film "The Last Journey" is on track for distribution across all platforms by April 5, 2024. 
          Current estimate for first viewership data: April 15, 2024. Please check back regularly for updates.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DistributionTracker;
