
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Commission } from "./useCommissionData";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Loader2, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CommissionAnalyticsProps {
  commissions: Commission[];
  loading: boolean;
  userTier: string | null;
}

const CommissionAnalytics = ({ commissions, loading, userTier }: CommissionAnalyticsProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commission Analytics</CardTitle>
          <CardDescription>Loading your commission data...</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Fetching your revenue share data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if we have commission data
  const hasCommissionData = commissions && commissions.length > 0;

  // If user is not subscribed or no data is available
  if (!userTier || !hasCommissionData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commission Analytics</CardTitle>
          <CardDescription>
            {userTier ? "No commission data available yet." : "Subscribe to view analytics."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Info className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground max-w-md">
            {userTier 
              ? "Commission data will appear here once your film starts generating revenue."
              : "Purchase a subscription plan to access commission tracking features."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  // For demo purposes, create a sample commission breakdown if we have data
  const mostRecentCommission = commissions[0];
  const commissionData = [
    { name: 'Your Share', value: mostRecentCommission.filmmakerShare },
    { name: 'Platform Fee', value: mostRecentCommission.platformFee },
    { name: 'Company Commission', value: mostRecentCommission.companyCommission }
  ];

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Analytics</CardTitle>
        <CardDescription>Breakdown of your revenue share and commission rates</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            Your current contract provides you with {Math.round((mostRecentCommission.filmmakerShare / mostRecentCommission.totalRevenue) * 100)}% 
            of total revenue after platform fees.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Revenue Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={commissionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {commissionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Commission Summary</h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-md">
                <div className="text-sm font-medium text-muted-foreground">Total Revenue</div>
                <div className="text-2xl font-bold mt-1">${mostRecentCommission.totalRevenue.toFixed(2)}</div>
              </div>
              
              <div className="p-4 bg-muted rounded-md">
                <div className="text-sm font-medium text-muted-foreground">Your Share</div>
                <div className="text-2xl font-bold mt-1">${mostRecentCommission.filmmakerShare.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round((mostRecentCommission.filmmakerShare / mostRecentCommission.totalRevenue) * 100)}% of total
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-md">
                <div className="text-sm font-medium text-muted-foreground">Platform Fee</div>
                <div className="text-2xl font-bold mt-1">${mostRecentCommission.platformFee.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round((mostRecentCommission.platformFee / mostRecentCommission.totalRevenue) * 100)}% of total
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionAnalytics;
