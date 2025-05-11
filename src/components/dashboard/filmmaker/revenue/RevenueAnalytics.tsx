
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Calendar, Loader2 } from "lucide-react";

interface RevenueAnalyticsProps {
  revenue: any;
  loading: boolean;
  userTier: string | null;
}

const RevenueAnalytics = ({ revenue, loading, userTier }: RevenueAnalyticsProps) => {
  const chartConfig = {
    platforms: {
      label: "Platform Revenue",
      color: "#4f46e5", // Use direct color instead of theme
    },
    growth: {
      label: "Revenue Growth",
      color: "#10b981", // Use direct color instead of theme
    }
  };

  const calculateTotalRevenue = (data: any) => {
    if (!data || !data.totalRevenue) return 0;
    return typeof data.totalRevenue === 'number' ? data.totalRevenue : 0;
  };

  const calculateRevenueGrowth = (data: any) => {
    if (!data || !data.growthRate) return 0;
    return typeof data.growthRate === 'number' ? data.growthRate : 0;
  };

  const totalRevenue = calculateTotalRevenue(revenue);
  const revenueGrowth = calculateRevenueGrowth(revenue);

  const renderTooltipContent = (entry: any) => {
    if (entry && entry.payload && entry.payload.length > 0) {
      const data = entry.payload[0].payload;
      return (
        <div className="p-2 bg-white border rounded-md shadow-md">
          <p className="text-sm font-medium text-gray-800">{data.date}</p>
          {Object.keys(chartConfig).map((key) => (
            <p key={key} className="text-xs text-gray-600">
              <span style={{ color: chartConfig[key as keyof typeof chartConfig].color }}>
                ●
              </span>{" "}
              {chartConfig[key as keyof typeof chartConfig].label}: {data[key]}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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

  // Check if revenue data is available and properly structured
  const hasRevenueData = revenue && 
    (revenue.totalRevenue > 0 || 
    (revenue.platformRevenue && revenue.platformRevenue.length > 0) || 
    (revenue.growthTimeline && revenue.growthTimeline.length > 0));

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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Revenue Analytics</CardTitle>
        <CardDescription>Overview of your film's revenue performance.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center justify-between p-4 bg-muted rounded-md">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
              <div className="text-2xl font-bold mt-2">
                <DollarSign className="mr-2 h-4 w-4 inline-block" />
                {totalRevenue.toFixed(2)}
              </div>
            </div>
            <ArrowUpRight className="h-6 w-6 text-green-500" />
          </div>
          <div className="flex items-center justify-between p-4 bg-muted rounded-md">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Revenue Growth</span>
              <div className="text-2xl font-bold mt-2">
                <TrendingUp className="mr-2 h-4 w-4 inline-block" />
                {revenueGrowth.toFixed(2)}%
              </div>
            </div>
            {revenueGrowth >= 0 ? (
              <ArrowUpRight className="h-6 w-6 text-green-500" />
            ) : (
              <ArrowDownRight className="h-6 w-6 text-red-500" />
            )}
          </div>
        </div>

        {revenue.platformRevenue && Array.isArray(revenue.platformRevenue) && revenue.platformRevenue.length > 0 && (
          <div className="mb-8">
            <h4 className="text-md font-semibold mb-2">Revenue Chart</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenue.platformRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={renderTooltipContent} />
                <Legend />
                <Bar dataKey="revenue" fill={chartConfig.platforms.color} name={chartConfig.platforms.label} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueAnalytics;
