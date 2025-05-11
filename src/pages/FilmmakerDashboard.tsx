
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectSubmission from "@/components/dashboard/filmmaker/ProjectSubmission";
import ServicePackages from "@/components/dashboard/filmmaker/ServicePackages";
import RevenueTracking from "@/components/dashboard/filmmaker/RevenueTracking";
import PaymentStatus from "@/components/dashboard/filmmaker/PaymentStatus";
import CommissionBreakdown from "@/components/dashboard/filmmaker/CommissionBreakdown";
import DistributionTracker from "@/components/dashboard/filmmaker/DistributionTracker";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

const FilmmakerDashboard = () => {
  const [activeTab, setActiveTab] = useState("submission");
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setLoading(true);
        
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase.functions.invoke('check-subscription-status');
        
        if (error) {
          console.error('Error checking subscription:', error);
        } else {
          setSubscriptionStatus(data.status);
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSubscription();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Filmmaker Dashboard</h1>
      
      {!loading && subscriptionStatus !== 'ACTIVE' && (
        <Alert variant="default" className="mb-6 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            Upgrade to our premium plan for enhanced distribution features.
            <Link to="/subscription" className="ml-2 text-blue-700 font-medium underline underline-offset-4">
              View Subscription Options
            </Link>
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="submission" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <TabsTrigger value="submission">Project Submission</TabsTrigger>
          <TabsTrigger value="packages">Service Packages</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Tracking</TabsTrigger>
          <TabsTrigger value="payment">Payment Status</TabsTrigger>
          <TabsTrigger value="commission">Commission</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="submission" className="mt-6">
          <ProjectSubmission />
        </TabsContent>
        
        <TabsContent value="packages" className="mt-6">
          <ServicePackages />
        </TabsContent>
        
        <TabsContent value="revenue" className="mt-6">
          <RevenueTracking />
        </TabsContent>
        
        <TabsContent value="payment" className="mt-6">
          <PaymentStatus />
        </TabsContent>
        
        <TabsContent value="commission" className="mt-6">
          <CommissionBreakdown />
        </TabsContent>
        
        <TabsContent value="distribution" className="mt-6">
          <DistributionTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FilmmakerDashboard;
