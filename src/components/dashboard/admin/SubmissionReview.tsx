
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Check, X } from "lucide-react";

const SubmissionReview = () => {
  const pendingSubmissions = [
    { id: "SUB-001", title: "The Last Journey", director: "Maria Rodriguez", submitted: "2024-02-15", genre: "Drama", runtime: "118 min" },
    { id: "SUB-002", title: "Neon Dreams", director: "James Wilson", submitted: "2024-02-14", genre: "Sci-Fi", runtime: "92 min" },
    { id: "SUB-003", title: "The Silent Voice", director: "Emma Chen", submitted: "2024-02-13", genre: "Thriller", runtime: "104 min" },
    { id: "SUB-004", title: "Beyond Tomorrow", director: "David Patel", submitted: "2024-02-10", genre: "Documentary", runtime: "87 min" },
    { id: "SUB-005", title: "Forgotten Shores", director: "Michael Thompson", submitted: "2024-02-09", genre: "Adventure", runtime: "126 min" },
  ];

  const recentlyReviewed = [
    { id: "SUB-006", title: "City Lights", director: "Sarah Johnson", submitted: "2024-02-08", status: "approved", reviewer: "John Doe", reviewDate: "2024-02-12" },
    { id: "SUB-007", title: "Midnight Run", director: "Carlos Garcia", submitted: "2024-02-07", status: "rejected", reviewer: "Jane Smith", reviewDate: "2024-02-11" },
    { id: "SUB-008", title: "The Mountain", director: "Lisa Wong", submitted: "2024-02-05", status: "approved", reviewer: "John Doe", reviewDate: "2024-02-10" },
    { id: "SUB-009", title: "Ocean's Breath", director: "Mark Stevens", submitted: "2024-02-03", status: "approved", reviewer: "Jane Smith", reviewDate: "2024-02-09" },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">{status}</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">{status}</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Submission Review Queue</h2>
          <p className="text-muted-foreground">Review and manage filmmaker submissions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Input 
            placeholder="Search submissions..." 
            className="w-64" 
            type="search" 
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search submissions</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Review <Badge className="ml-2 bg-primary">{pendingSubmissions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="reviewed">
            Recently Reviewed <Badge className="ml-2">{recentlyReviewed.length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Films Awaiting Review</CardTitle>
              <CardDescription>Films submitted by filmmakers awaiting approval or rejection</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Submission ID</TableHead>
                    <TableHead>Film Title</TableHead>
                    <TableHead>Director</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Runtime</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.id}</TableCell>
                      <TableCell>{submission.title}</TableCell>
                      <TableCell>{submission.director}</TableCell>
                      <TableCell>{submission.genre}</TableCell>
                      <TableCell>{submission.runtime}</TableCell>
                      <TableCell>{submission.submitted}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="default">
                          <Check className="mr-1 h-3 w-3" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <X className="mr-1 h-3 w-3" />
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviewed" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recently Reviewed Films</CardTitle>
              <CardDescription>Films that have completed the review process</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Submission ID</TableHead>
                    <TableHead>Film Title</TableHead>
                    <TableHead>Director</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reviewed By</TableHead>
                    <TableHead>Review Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentlyReviewed.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.id}</TableCell>
                      <TableCell>{submission.title}</TableCell>
                      <TableCell>{submission.director}</TableCell>
                      <TableCell>{submission.submitted}</TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell>{submission.reviewer}</TableCell>
                      <TableCell>{submission.reviewDate}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-center border-t p-4">
              <Button variant="outline">Load More</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Submission Review Guidelines</CardTitle>
          <CardDescription>Criteria for approving or rejecting submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-bold">Approval Criteria</h3>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li>Technical quality meets minimum standards (1080p resolution or higher)</li>
                <li>Content complies with platform policies and legal requirements</li>
                <li>Proper documentation and rights clearances provided</li>
                <li>Film has a complete beginning, middle, and end</li>
                <li>Audio quality is clear and properly mixed</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-bold">Rejection Reasons</h3>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li>Poor technical quality that would impact viewer experience</li>
                <li>Content that violates platform guidelines or legal requirements</li>
                <li>Incomplete or missing documentation</li>
                <li>Uncleared music, imagery, or other copyrighted material</li>
                <li>Incomplete film or significant narrative issues</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionReview;
