
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { getStatusBadge } from "./utils";

interface PlatformIssuesProps {
  issues: any[];
  onSubmitIssue: (data: any) => void;
}

const PlatformIssues = ({ issues, onSubmitIssue }: PlatformIssuesProps) => {
  const issueForm = useForm({
    defaultValues: {
      platform: "",
      severity: "",
      description: "",
      affectedFilms: ""
    }
  });

  return (
    <>
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
              {issues.length > 0 ? (
                issues.map((issue, index) => (
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
    </>
  );
};

export default PlatformIssues;
