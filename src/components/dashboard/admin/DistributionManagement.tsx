
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertCircle } from "lucide-react";

const DistributionManagement = () => {
  const activeDistributions = [
    { id: "D-001", film: "The Last Journey", filmmaker: "Maria Rodriguez", platforms: "Netflix, Amazon, Hulu", startDate: "2023-11-15", endDate: "2024-11-15", status: "active" },
    { id: "D-002", film: "Neon Dreams", filmmaker: "James Wilson", platforms: "Netflix, Disney+", startDate: "2023-12-01", endDate: "2024-12-01", status: "active" },
    { id: "D-003", film: "The Silent Voice", filmmaker: "Emma Chen", platforms: "Amazon, Apple TV+", startDate: "2024-01-10", endDate: "2025-01-10", status: "active" },
    { id: "D-004", film: "Beyond Tomorrow", filmmaker: "David Patel", platforms: "Netflix, Hulu", startDate: "2024-01-25", endDate: "2025-01-25", status: "active" },
    { id: "D-005", film: "Forgotten Shores", filmmaker: "Michael Thompson", platforms: "Amazon, Disney+", startDate: "2024-02-05", endDate: "2025-02-05", status: "active" },
  ];

  const pendingDistributions = [
    { id: "D-006", film: "City Lights", filmmaker: "Sarah Johnson", platforms: "Netflix, Amazon, Hulu, HBO Max", status: "encoding", estimatedCompletion: "2024-03-10" },
    { id: "D-007", film: "Midnight Run", filmmaker: "Carlos Garcia", platforms: "Netflix, Disney+, Apple TV+", status: "metadata", estimatedCompletion: "2024-03-15" },
    { id: "D-008", film: "The Mountain", filmmaker: "Lisa Wong", platforms: "Amazon, Hulu, Paramount+", status: "submission", estimatedCompletion: "2024-03-20" },
  ];

  const platformIssues = [
    { platform: "Netflix", issue: "Metadata format changes", affectedFilms: 3, status: "investigating", reportedDate: "2024-02-28" },
    { platform: "Amazon Prime", issue: "Encoding specification update", affectedFilms: 5, status: "resolved", reportedDate: "2024-02-25" },
    { platform: "Hulu", issue: "API connection failure", affectedFilms: 2, status: "in progress", reportedDate: "2024-02-27" },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
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
                    <TableHead>Platforms</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeDistributions.map((dist) => (
                    <TableRow key={dist.id}>
                      <TableCell className="font-mono">{dist.id}</TableCell>
                      <TableCell className="font-medium">{dist.film}</TableCell>
                      <TableCell>{dist.filmmaker}</TableCell>
                      <TableCell>{dist.platforms}</TableCell>
                      <TableCell>{dist.startDate}</TableCell>
                      <TableCell>{dist.endDate}</TableCell>
                      <TableCell>{getStatusBadge(dist.status)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Performance</Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
                    <TableHead>Target Platforms</TableHead>
                    <TableHead>Current Stage</TableHead>
                    <TableHead>Estimated Completion</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDistributions.map((dist) => (
                    <TableRow key={dist.id}>
                      <TableCell className="font-mono">{dist.id}</TableCell>
                      <TableCell className="font-medium">{dist.film}</TableCell>
                      <TableCell>{dist.filmmaker}</TableCell>
                      <TableCell>{dist.platforms}</TableCell>
                      <TableCell>{getStatusBadge(dist.status)}</TableCell>
                      <TableCell>{dist.estimatedCompletion}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm">Advance Stage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
                  {platformIssues.map((issue, index) => (
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
                  ))}
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="platform" className="text-sm font-medium">Platform</label>
                    <select id="platform" className="w-full border rounded-md p-2">
                      <option value="">Select Platform</option>
                      <option value="netflix">Netflix</option>
                      <option value="amazon">Amazon Prime</option>
                      <option value="hulu">Hulu</option>
                      <option value="disney">Disney+</option>
                      <option value="apple">Apple TV+</option>
                      <option value="hbo">HBO Max</option>
                      <option value="paramount">Paramount+</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="severity" className="text-sm font-medium">Severity</label>
                    <select id="severity" className="w-full border rounded-md p-2">
                      <option value="">Select Severity</option>
                      <option value="low">Low - Minor Impact</option>
                      <option value="medium">Medium - Partial Impact</option>
                      <option value="high">High - Major Impact</option>
                      <option value="critical">Critical - Complete Failure</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="issue-description" className="text-sm font-medium">Issue Description</label>
                  <textarea id="issue-description" className="w-full h-24 border rounded-md p-2" placeholder="Describe the issue in detail..."></textarea>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="affected-films" className="text-sm font-medium">Affected Films</label>
                  <textarea id="affected-films" className="w-full h-16 border rounded-md p-2" placeholder="List the film IDs affected by this issue..."></textarea>
                </div>
                
                <div className="flex justify-end">
                  <Button className="space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Submit Issue Report</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DistributionManagement;
