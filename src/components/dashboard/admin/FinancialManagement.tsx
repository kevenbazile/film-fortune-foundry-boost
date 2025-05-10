
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Download, TrendingUp, CreditCard, DollarSign } from "lucide-react";

const FinancialManagement = () => {
  // Sample data for demonstration
  const revenueData = [
    { month: 'Jan', revenue: 12800, expenses: 5200, profit: 7600 },
    { month: 'Feb', revenue: 14500, expenses: 5700, profit: 8800 },
    { month: 'Mar', revenue: 16200, expenses: 6100, profit: 10100 },
    { month: 'Apr', revenue: 18000, expenses: 6500, profit: 11500 },
    { month: 'May', revenue: 17300, expenses: 6200, profit: 11100 },
    { month: 'Jun', revenue: 19200, expenses: 6800, profit: 12400 },
  ];
  
  const platformRevenue = [
    { name: 'Netflix', value: 42000 },
    { name: 'Amazon Prime', value: 28500 },
    { name: 'Hulu', value: 22000 },
    { name: 'Apple TV+', value: 14500 },
    { name: 'Disney+', value: 10000 },
  ];

  const revenueByFilm = [
    { id: "F-001", title: "The Last Journey", revenue: "$12,480", royalties: "$8,736", platforms: "Netflix, Amazon, Hulu" },
    { id: "F-002", title: "Neon Dreams", revenue: "$9,320", royalties: "$6,524", platforms: "Netflix, Disney+" },
    { id: "F-003", title: "The Silent Voice", revenue: "$7,640", royalties: "$5,348", platforms: "Amazon, Apple TV+" },
    { id: "F-004", title: "Beyond Tomorrow", revenue: "$6,220", royalties: "$4,354", platforms: "Netflix, Hulu" },
    { id: "F-005", title: "Forgotten Shores", revenue: "$5,890", royalties: "$4,123", platforms: "Amazon, Disney+" },
  ];

  const pendingPayments = [
    { id: "P-001", filmmaker: "Maria Rodriguez", film: "The Last Journey", amount: "$8,736", status: "pending", due: "2024-03-15" },
    { id: "P-002", filmmaker: "James Wilson", film: "Neon Dreams", amount: "$6,524", status: "scheduled", due: "2024-03-10" },
    { id: "P-003", filmmaker: "Emma Chen", film: "The Silent Voice", amount: "$5,348", status: "pending", due: "2024-03-20" },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">{status}</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-500">{status}</Badge>;
      case "completed":
        return <Badge className="bg-green-500">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$98,000</div>
            <p className="text-xs text-muted-foreground">+14% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$36,500</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$61,500</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$20,608</div>
            <p className="text-xs text-muted-foreground">3 payments due</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Financial Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue by Film</TabsTrigger>
          <TabsTrigger value="payments">Pending Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6 space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Revenue vs. Expenses</CardTitle>
                  <CardDescription>Monthly financial performance over the last 6 months</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                    <Bar dataKey="expenses" fill="#f97316" name="Expenses" />
                    <Bar dataKey="profit" fill="#22c55e" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Revenue Distribution</CardTitle>
              <CardDescription>Revenue breakdown by streaming platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={platformRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Legend />
                      <Line type="monotone" dataKey="value" name="Revenue" stroke="#3b82f6" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {platformRevenue.map((platform, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{platform.name}</p>
                        <p className="text-sm text-muted-foreground">{((platform.value / platformRevenue.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}% of revenue</p>
                      </div>
                      <p className="font-bold">${platform.value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Revenue by Film</CardTitle>
                  <CardDescription>Detailed revenue breakdown for each film</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Film ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Filmmaker Royalties</TableHead>
                    <TableHead>Distribution Platforms</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueByFilm.map((film) => (
                    <TableRow key={film.id}>
                      <TableCell className="font-mono">{film.id}</TableCell>
                      <TableCell className="font-medium">{film.title}</TableCell>
                      <TableCell>{film.revenue}</TableCell>
                      <TableCell>{film.royalties}</TableCell>
                      <TableCell>{film.platforms}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pending Filmmaker Payments</CardTitle>
                  <CardDescription>Upcoming royalty payments to filmmakers</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Schedule All
                  </Button>
                  <Button size="sm">
                    Process Payments
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Filmmaker</TableHead>
                    <TableHead>Film</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono">{payment.id}</TableCell>
                      <TableCell className="font-medium">{payment.filmmaker}</TableCell>
                      <TableCell>{payment.film}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>{payment.due}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm">Process Payment</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialManagement;
