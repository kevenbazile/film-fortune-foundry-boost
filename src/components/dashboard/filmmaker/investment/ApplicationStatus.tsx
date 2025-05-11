
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Application } from "./types";
import { fetchUserApplications } from "./services/investmentService";

const getStatusColor = (status: string) => {
  const colors = {
    draft: "bg-gray-100 text-gray-800",
    submitted: "bg-blue-100 text-blue-800",
    under_review: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    denied: "bg-red-100 text-red-800",
    funded: "bg-purple-100 text-purple-800",
  };
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const ApplicationStatus = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getApplications = async () => {
      try {
        setLoading(true);
        
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          toast({
            title: "Authentication required",
            description: "Please log in to view your applications",
            variant: "destructive"
          });
          return;
        }

        const apps = await fetchUserApplications(session.session.user.id);
        setApplications(apps);
      } catch (error: any) {
        console.error("Error fetching applications:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load your applications",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getApplications();
  }, [toast]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Applications</CardTitle>
          <CardDescription>Loading application status...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Applications</CardTitle>
        <CardDescription>
          Track the status of your investment applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="border rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <div>
                    <h3 className="font-medium">{app.project_title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(app.status)}>
                        {app.status.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {app.project_type?.charAt(0).toUpperCase() + app.project_type?.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${app.requested_amount?.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      Submitted {formatDistanceToNow(new Date(app.submission_date), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {app.review_date && (
                  <div className="mt-3 text-sm">
                    <p className="font-medium">Review Date:</p>
                    <p>{new Date(app.review_date).toLocaleDateString()}</p>
                  </div>
                )}

                {app.review_notes && (
                  <div className="mt-3 text-sm">
                    <p className="font-medium">Review Notes:</p>
                    <p className="bg-gray-50 p-2 rounded mt-1">{app.review_notes}</p>
                  </div>
                )}

                {app.funding_date && (
                  <div className="mt-3 text-sm">
                    <p className="font-medium text-green-600">Funding Date:</p>
                    <p>{new Date(app.funding_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>You haven't submitted any applications yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationStatus;
