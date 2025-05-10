
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubmissionReview from "@/components/dashboard/admin/SubmissionReview";
import FinancialManagement from "@/components/dashboard/admin/FinancialManagement";
import DistributionManagement from "@/components/dashboard/admin/DistributionManagement";
import UserTierManagement from "@/components/dashboard/admin/UserTierManagement";
import AnalyticsReporting from "@/components/dashboard/admin/AnalyticsReporting";
import PaymentControls from "@/components/dashboard/admin/PaymentControls";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("submissions");

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="submissions" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="users">User Tiers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="submissions" className="mt-6">
          <SubmissionReview />
        </TabsContent>
        
        <TabsContent value="financial" className="mt-6">
          <FinancialManagement />
        </TabsContent>
        
        <TabsContent value="distribution" className="mt-6">
          <DistributionManagement />
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <UserTierManagement />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <AnalyticsReporting />
        </TabsContent>
        
        <TabsContent value="payments" className="mt-6">
          <PaymentControls />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
