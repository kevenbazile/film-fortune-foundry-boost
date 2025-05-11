
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCommissionData } from "./commission/useCommissionData";
import CommissionAnalytics from "./commission/CommissionAnalytics";
import PaymentHistory from "./commission/PaymentHistory";

const CommissionBreakdown = () => {
  const {
    commissions,
    payments,
    loading,
    userTier,
    filmId,
    userId,
    handleDispute,
    exportToCSV,
    refreshData
  } = useCommissionData();

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-3">Commission Breakdown</h2>
        <p className="text-muted-foreground">
          Track your revenue share, commission rates, and payment history.
        </p>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics">Commission Analytics</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="mt-6">
          <CommissionAnalytics 
            commissions={commissions} 
            loading={loading} 
            userTier={userTier}
          />
        </TabsContent>
        
        <TabsContent value="payments" className="mt-6">
          <PaymentHistory 
            payments={payments} 
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

export default CommissionBreakdown;
