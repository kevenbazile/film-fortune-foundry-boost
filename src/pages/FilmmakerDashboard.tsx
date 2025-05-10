
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectSubmission from "@/components/dashboard/filmmaker/ProjectSubmission";
import ServicePackages from "@/components/dashboard/filmmaker/ServicePackages";
import RevenueTracking from "@/components/dashboard/filmmaker/RevenueTracking";
import PaymentStatus from "@/components/dashboard/filmmaker/PaymentStatus";
import CommissionBreakdown from "@/components/dashboard/filmmaker/CommissionBreakdown";
import DistributionTracker from "@/components/dashboard/filmmaker/DistributionTracker";
import { ensureStorageBuckets } from "@/integrations/supabase/storage";

const FilmmakerDashboard = () => {
  const [activeTab, setActiveTab] = useState("submission");

  useEffect(() => {
    // Ensure storage buckets exist when dashboard loads
    ensureStorageBuckets();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Filmmaker Dashboard</h1>
      
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
