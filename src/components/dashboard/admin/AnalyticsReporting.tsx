
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calendar, Download } from "lucide-react";

const AnalyticsReporting = () => {
  // Sample data for demonstration
  const monthlyData = [
    { month: 'Jan', films: 8, revenue: 12000, viewers: 45000 },
    { month: 'Feb', films: 10, revenue: 15000, viewers: 58000 },
    { month: 'Mar', films: 12, revenue: 18000, viewers: 66000 },
    { month: 'Apr', films: 15, revenue: 22000, viewers: 71000 },
    { month: 'May', films: 14, revenue: 20000, viewers: 69000 },
    { month: 'Jun', films: 18, revenue: 25000, viewers: 78000 },
  ];
  
  const genreData = [
    { name: 'Drama', value: 35 },
    { name: 'Sci-Fi', value: 20 },
    { name: 'Documentary', value: 15 },
    { name: 'Comedy', value: 10 },
    { name: 'Horror', value: 8 },
    { name: 'Action', value: 7 },
    { name: 'Other', value: 5 },
  ];
  
  const platformData = [
    { name: 'Netflix', films: 18, revenue: 32000 },
    { name: 'Amazon Prime', films: 15, revenue: 28000 },
    { name: 'Hulu', films: 12, revenue: 20000 },
    { name: 'Apple TV+', films: 8, revenue: 15000 },
    { name: 'Disney+', films: 5, revenue: 10000 },
    { name: 'HBO Max', films: 4, revenue: 8000 },
    { name: 'Paramount+', films: 3, revenue: 5000 },
  ];
  
  const viewerDemographics = [
    { age: '18-24', male: 15, female: 12, other: 3 },
    { age: '25-34', male: 25, female: 22, other: 5 },
    { age: '35-44', male: 18, female: 20, other: 4 },
    { age: '45-54', male: 12, female: 15, other: 2 },
    { age: '55-64', male: 8, female: 10, other: 1 },
    { age: '65+', male: 5, female: 6, other: 1 },
  ];
  
  const GENRE_COLORS = ['#3b82f6', '#f97316', '#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#94a3b8'];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive platform and film analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-muted p-2 rounded-md">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Last 30 days</span>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Films</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">77</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$25,000</div>
            <p className="text-xs text-muted-foreground">+14% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viewer Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78,000</div>
            <p className="text-xs text-muted-foreground">+11% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="films">Film Analytics</TabsTrigger>
          <TabsTrigger value="platforms">Platform Metrics</TabsTrigger>
          <TabsTrigger value="audience">Audience Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
              <CardDescription>Growth in films, revenue, and viewers over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="films" stroke="#3b82f6" name="Films" />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#ef4444" name="Revenue ($)" />
                    <Line yAxisId="right" type="monotone" dataKey="viewers" stroke="#22c55e" name="Viewers" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Genre Distribution</CardTitle>
                <CardDescription>Films by genre category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genreData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {genreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={GENRE_COLORS[index % GENRE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>Films and revenue by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={platformData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="films" fill="#3b82f6" name="Films" />
                      <Bar yAxisId="right" dataKey="revenue" fill="#ef4444" name="Revenue ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="films" className="mt-6 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Films</CardTitle>
              <CardDescription>Films with highest viewer engagement and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="font-semibold">The Last Journey</h3>
                  <div className="space-y-1">
                    <div className="text-sm flex justify-between">
                      <span>Viewers</span>
                      <span>12,500</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm flex justify-between">
                      <span>Revenue</span>
                      <span>$12,480</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Neon Dreams</h3>
                  <div className="space-y-1">
                    <div className="text-sm flex justify-between">
                      <span>Viewers</span>
                      <span>10,200</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm flex justify-between">
                      <span>Revenue</span>
                      <span>$9,320</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">The Silent Voice</h3>
                  <div className="space-y-1">
                    <div className="text-sm flex justify-between">
                      <span>Viewers</span>
                      <span>8,900</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '61%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm flex justify-between">
                      <span>Revenue</span>
                      <span>$7,640</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '57%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Viewing Patterns</CardTitle>
              <CardDescription>How viewers engage with content over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { minute: '0', viewers: 1000 },
                      { minute: '10', viewers: 2500 },
                      { minute: '20', viewers: 3800 },
                      { minute: '30', viewers: 3600 },
                      { minute: '40', viewers: 3900 },
                      { minute: '50', viewers: 3700 },
                      { minute: '60', viewers: 4100 },
                      { minute: '70', viewers: 3500 },
                      { minute: '80', viewers: 3200 },
                      { minute: '90', viewers: 2800 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="minute" label={{ value: 'Time into Film (minutes)', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Active Viewers', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="viewers" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="platforms" className="mt-6 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Platform Revenue Comparison</CardTitle>
              <CardDescription>Revenue performance across different streaming platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={platformData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name]} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Growth</CardTitle>
              <CardDescription>Monthly growth in viewership by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: 'Jan', Netflix: 12000, Amazon: 8000, Hulu: 6000, Apple: 4000 },
                      { month: 'Feb', Netflix: 14000, Amazon: 10000, Hulu: 7000, Apple: 5000 },
                      { month: 'Mar', Netflix: 15000, Amazon: 12000, Hulu: 9000, Apple: 6000 },
                      { month: 'Apr', Netflix: 18000, Amazon: 14000, Hulu: 11000, Apple: 8000 },
                      { month: 'May', Netflix: 17000, Amazon: 13000, Hulu: 10000, Apple: 7500 },
                      { month: 'Jun', Netflix: 19000, Amazon: 15000, Hulu: 12000, Apple: 9000 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} viewers`} />
                    <Legend />
                    <Line type="monotone" dataKey="Netflix" stroke="#E50914" name="Netflix" />
                    <Line type="monotone" dataKey="Amazon" stroke="#00A8E1" name="Amazon Prime" />
                    <Line type="monotone" dataKey="Hulu" stroke="#3DBB3D" name="Hulu" />
                    <Line type="monotone" dataKey="Apple" stroke="#A2AAAD" name="Apple TV+" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audience" className="mt-6 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Viewer Demographics</CardTitle>
              <CardDescription>Audience breakdown by age and gender</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={viewerDemographics}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} viewers`} />
                    <Legend />
                    <Bar dataKey="male" fill="#3b82f6" name="Male" />
                    <Bar dataKey="female" fill="#ec4899" name="Female" />
                    <Bar dataKey="other" fill="#8b5cf6" name="Other" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Viewer Engagement Metrics</CardTitle>
              <CardDescription>Detailed viewing behavior analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-muted-foreground">Average View Duration</h3>
                    <p className="text-3xl font-bold">58 min</p>
                  </div>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Complete', value: 65 },
                            { name: 'Partial', value: 35 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#22c55e" />
                          <Cell fill="#f59e0b" />
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-muted-foreground">Completion Rate</h3>
                    <p className="text-3xl font-bold">72%</p>
                  </div>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Completed', value: 72 },
                            { name: 'Abandoned', value: 28 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#3b82f6" />
                          <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-muted-foreground">User Rating</h3>
                    <p className="text-3xl font-bold">4.2/5</p>
                  </div>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { rating: '5 ★', count: 38 },
                          { rating: '4 ★', count: 52 },
                          { rating: '3 ★', count: 24 },
                          { rating: '2 ★', count: 12 },
                          { rating: '1 ★', count: 8 },
                        ]}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="rating" type="category" width={50} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Bar dataKey="count" fill="#8b5cf6" name="Users (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsReporting;
