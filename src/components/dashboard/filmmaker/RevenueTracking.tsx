
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RevenueAnalytics from "./revenue/RevenueAnalytics";
import EarningsHistory from "./revenue/EarningsHistory";
import { useRevenueData } from "./revenue/useRevenueData";

const RevenueTracking = () => {
  const {
    revenue,
    earnings,
    loading,
    userTier,
    filmId,
    userId,
    handleDispute,
    exportToCSV,
    refreshData
  } = useRevenueData();

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-3">Revenue Tracking</h2>
        <p className="text-muted-foreground">
          Track your film's revenue across distribution platforms and manage your earnings history.
        </p>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="history">Earnings History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="mt-6">
          <RevenueAnalytics 
            revenue={revenue} 
            loading={loading} 
            userTier={userTier}
          />
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <EarningsHistory 
            earnings={earnings} 
            loading={loading}
            onDispute={handleDispute}
            onExportCSV={exportToCSV}
            onRefresh={refreshData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RevenueTracking;
