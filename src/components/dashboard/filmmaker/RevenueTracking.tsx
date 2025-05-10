
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Download, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const RevenueTracking = () => {
  // Sample revenue data for demonstration
  const revenueData = [
    { month: 'Jan', revenue: 120, platforms: 'Netflix, Amazon' },
    { month: 'Feb', revenue: 180, platforms: 'Netflix, Amazon, Hulu' },
    { month: 'Mar', revenue: 220, platforms: 'Netflix, Amazon, Hulu, HBO' },
    { month: 'Apr', revenue: 300, platforms: 'Netflix, Amazon, Hulu, HBO, Disney+' },
    { month: 'May', revenue: 250, platforms: 'Netflix, Amazon, Hulu' },
    { month: 'Jun', revenue: 320, platforms: 'Netflix, Amazon, Hulu, HBO' },
  ];
  
  const chartData = [
    { name: 'Jan', Netflix: 65, Amazon: 35, Hulu: 20 },
    { name: 'Feb', Netflix: 75, Amazon: 45, Hulu: 60 },
    { name: 'Mar', Netflix: 85, Amazon: 55, Hulu: 80 },
    { name: 'Apr', Netflix: 120, Amazon: 70, Hulu: 110 },
    { name: 'May', Netflix: 90, Amazon: 60, Hulu: 100 },
    { name: 'Jun', Netflix: 110, Amazon: 80, Hulu: 130 },
  ];
  
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Count</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Platform</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Netflix</div>
            <p className="text-xs text-muted-foreground">53% of total revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">Average monthly increase</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Revenue by Platform</CardTitle>
          <CardDescription>Showing the last 6 months of revenue across platforms</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Netflix" fill="#FF0000" />
                <Bar dataKey="Amazon" fill="#00A8E1" />
                <Bar dataKey="Hulu" fill="#3DBB3D" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Earnings History</CardTitle>
              <CardDescription>Complete breakdown of your earnings by month</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Platforms</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Earnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueData.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{row.month}</TableCell>
                  <TableCell>${row.revenue.toFixed(2)}</TableCell>
                  <TableCell>{row.platforms}</TableCell>
                  <TableCell>{Math.floor(row.revenue * 24)}</TableCell>
                  <TableCell className="text-right">${(row.revenue * 0.7).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueTracking;
