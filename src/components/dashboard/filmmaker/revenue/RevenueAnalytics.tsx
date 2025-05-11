
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Info } from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { 
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";
import { formatDistanceToNow } from "date-fns";

interface RevenueAnalyticsProps {
  revenue: any;
  loading: boolean;
  userTier: 'basic' | 'premium' | 'elite' | null;
}

const RevenueAnalytics = ({ revenue, loading, userTier }: RevenueAnalyticsProps) => {
  // Define platforms based on subscription tier
  const platformsByTier = {
    basic: ['YouTube', 'Vimeo', 'Dailymotion'],
    premium: ['YouTube', 'Vimeo', 'Amazon Prime', 'Tubi', 'Pluto TV'],
    elite: ['YouTube', 'Vimeo', 'Amazon Prime', 'Netflix', 'Hulu', 'Apple TV+', 'HBO Max']
  };

  // Define colors for chart
  const chartColors = {
    YouTube: "#FF0000",
    Vimeo: "#1AB7EA",
    Dailymotion: "#0066DC",
    "Amazon Prime": "#00A8E1",
    Tubi: "#FF501A",
    "Pluto TV": "#FFFF00",
    Netflix: "#E50914",
    Hulu: "#3DBB3D",
    "Apple TV+": "#000000",
    "HBO Max": "#741B47"
  };

  const chartConfig = {
    platforms: {
      theme: {
        light: "hsl(var(--chart-1))"
      }
    },
    growth: {
      theme: {
        light: "hsl(var(--chart-2))"
      }
    }
  };

  if (loading) {
    return (
      <Card className="col-span-4">
        <CardHeader className="pb-2">
          <CardTitle>Revenue Analytics</CardTitle>
          <CardDescription>Loading revenue data...</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (!userTier) {
    return (
      <Card className="col-span-4 text-center">
        <CardHeader className="pb-2">
          <CardTitle>Revenue Analytics</CardTitle>
          <CardDescription>Subscribe to a distribution plan to view revenue analytics</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Button 
            onClick={() => window.location.href = '/dashboard?tab=packages'}
            variant="default"
            className="mt-4"
          >
            View Distribution Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!revenue || revenue.totalRevenue === 0) {
    return (
      <Card className="col-span-4">
        <CardHeader className="pb-2">
          <CardTitle>Revenue Analytics</CardTitle>
          <CardDescription>Track your film's revenue across platforms</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex flex-col items-center justify-center">
          <Info className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Not enough data to show analytics</h3>
          <p className="text-center text-muted-foreground max-w-md mt-2">
            We'll display your revenue analytics here once your film begins generating revenue on distribution platforms.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sample data for demonstration - in a real app this would come from the revenue prop
  const samplePlatformData = platformsByTier[userTier].map(platform => ({
    name: platform,
    revenue: Math.floor(Math.random() * 5000)
  }));

  const sampleTimelineData = Array.from({ length: 12 }, (_, i) => ({
    month: `Month ${i+1}`,
    revenue: Math.floor(Math.random() * 10000)
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">${revenue.totalRevenue || 5280}</div>
              <div className="text-sm text-muted-foreground">
                <span className="text-emerald-500 flex items-center">
                  +12.5% <ArrowUpRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenue.growthRate || 16.7}%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Release Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenue.daysSinceRelease || 78} days</div>
            <p className="text-xs text-muted-foreground">
              Since release
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Platform Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Platform</CardTitle>
          <CardDescription>
            Distribution across {platformsByTier[userTier].length} platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ChartContainer
              config={chartConfig}
            >
              <BarChart
                data={revenue.platformRevenue || samplePlatformData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip 
                  content={
                    <ChartTooltipContent />
                  }
                />
                <Bar dataKey="revenue">
                  {(revenue.platformRevenue || samplePlatformData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[entry.name] || `hsl(${index * 45}, 70%, 50%)`} />
                  ))}
                </Bar>
                <ChartLegend
                  content={
                    <ChartLegendContent />
                  }
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Growth Timeline Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Growth Over Time</CardTitle>
          <CardDescription>
            Monthly revenue since release
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ChartContainer
              config={chartConfig}
            >
              <LineChart
                data={revenue.growthTimeline || sampleTimelineData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip
                  content={
                    <ChartTooltipContent />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueAnalytics;
