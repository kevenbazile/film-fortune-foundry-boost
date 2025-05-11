
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getStatusBadge } from "./utils";

interface PendingDistributionsProps {
  distributions: any[];
  onAdvanceStage: (id: string, status: string) => void;
}

const PendingDistributions = ({ distributions, onAdvanceStage }: PendingDistributionsProps) => {
  return (
    <>
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
              {distributions.length > 0 ? (
                distributions.map((dist) => (
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
                          onAdvanceStage(dist.id, nextStatus);
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
    </>
  );
};

export default PendingDistributions;
