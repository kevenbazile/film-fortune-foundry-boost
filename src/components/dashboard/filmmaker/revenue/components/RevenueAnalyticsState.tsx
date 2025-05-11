
import React from "react";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface RevenueAnalyticsStateProps {
  loading: boolean;
  hasRevenueData: boolean;
  userTier: string | null;
}

const RevenueAnalyticsState: React.FC<RevenueAnalyticsStateProps> = ({ 
  loading, 
  hasRevenueData, 
  userTier 
}) => {
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Revenue Analytics</CardTitle>
          <CardDescription>Analyzing your revenue data...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!hasRevenueData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Revenue Analytics</CardTitle>
          <CardDescription>
            {userTier ? "Not enough data to show analytics yet." : "Subscribe to view analytics."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            {userTier 
              ? "We'll start showing data once your film begins generating revenue."
              : "Purchase a subscription plan to access revenue tracking features."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default RevenueAnalyticsState;
