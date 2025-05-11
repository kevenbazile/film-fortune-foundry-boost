
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRevenueAnalytics } from "./hooks/useRevenueAnalytics";
import RevenueMetrics from "./components/RevenueMetrics";
import PlatformRevenueChart from "./components/PlatformRevenueChart";
import RevenueAnalyticsState from "./components/RevenueAnalyticsState";

interface RevenueAnalyticsProps {
  revenue?: any;
  loading?: boolean;
  userTier: string | null;
}

const RevenueAnalytics = ({ loading: initialLoading = false, userTier }: RevenueAnalyticsProps) => {
  const {
    loading,
    platformRevenue,
    totalRevenue,
    growthRate,
    hasRevenueData
  } = useRevenueAnalytics(initialLoading, userTier);

  // First check if we're in a loading or empty state
  const stateComponent = (
    <RevenueAnalyticsState 
      loading={loading} 
      hasRevenueData={hasRevenueData}
      userTier={userTier}
    />
  );

  if (loading || !hasRevenueData) {
    return stateComponent;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Revenue Analytics</CardTitle>
        <CardDescription>Overview of your film's revenue performance.</CardDescription>
      </CardHeader>
      <CardContent>
        <RevenueMetrics totalRevenue={totalRevenue} growthRate={growthRate} />
        <PlatformRevenueChart platformRevenue={platformRevenue} />
      </CardContent>
    </Card>
  );
};

export default RevenueAnalytics;
