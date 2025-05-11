
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getStatusBadge } from "./utils";

interface ActiveDistributionsProps {
  distributions: any[];
  onViewDistribution: (url: string) => void;
}

const ActiveDistributions = ({ distributions, onViewDistribution }: ActiveDistributionsProps) => {
  const { toast } = useToast();

  return (
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
            {distributions.length > 0 ? (
              distributions.map((dist) => (
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
                          onViewDistribution(dist.platform_url);
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
  );
};

export default ActiveDistributions;
