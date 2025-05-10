
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const CommissionBreakdown = () => {
  const pieData = [
    { name: "Your Revenue", value: 70 },
    { name: "Platform Fees", value: 15 },
    { name: "Our Commission", value: 15 },
  ];

  const COLORS = ["#4ade80", "#f59e0b", "#3b82f6"];

  const commissionExplanations = [
    { 
      name: "Basic Package",
      yourRevenue: "70%",
      platformFee: "15%",
      ourCommission: "15%",
      explanation: "For our basic package, we maintain a standard commission structure that ensures you receive the majority of your earnings while covering necessary platform and service fees."
    },
    { 
      name: "Standard Package",
      yourRevenue: "75%",
      platformFee: "15%",
      ourCommission: "10%",
      explanation: "Our Standard package offers an improved revenue share, reducing our commission to just 10% while maintaining the same platform fees. This rewards filmmakers who choose our more comprehensive distribution options."
    },
    { 
      name: "Premium Package",
      yourRevenue: "80%",
      platformFee: "15%",
      ourCommission: "5%",
      explanation: "Premium package members enjoy our most favorable revenue split, with just 5% commission to us. This tier is designed for filmmakers seeking maximum returns while benefiting from our full suite of distribution services."
    }
  ];

  const revenueHistory = [
    { platform: "Netflix", totalRevenue: "$3,250.00", yourShare: "$2,275.00", platformFee: "$487.50", ourCommission: "$487.50" },
    { platform: "Amazon Prime", totalRevenue: "$1,875.00", yourShare: "$1,312.50", platformFee: "$281.25", ourCommission: "$281.25" },
    { platform: "Hulu", totalRevenue: "$1,420.00", yourShare: "$994.00", platformFee: "$213.00", ourCommission: "$213.00" },
    { platform: "Apple TV+", totalRevenue: "$980.00", yourShare: "$686.00", platformFee: "$147.00", ourCommission: "$147.00" },
    { platform: "YouTube Premium", totalRevenue: "$625.00", yourShare: "$437.50", platformFee: "$93.75", ourCommission: "$93.75" },
  ];

  const totalRevenue = revenueHistory.reduce((sum, item) => sum + parseFloat(item.totalRevenue.replace(/[$,]/g, '')), 0);
  const totalShare = revenueHistory.reduce((sum, item) => sum + parseFloat(item.yourShare.replace(/[$,]/g, '')), 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
            <CardDescription>Breakdown of your current commission structure</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            <CardTitle>Commission Structure</CardTitle>
            <CardDescription>How our commission tiers work</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {commissionExplanations.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{item.name}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-green-100 dark:bg-green-950 p-3 rounded-md">
                          <p className="text-xs text-muted-foreground">Your Revenue</p>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">{item.yourRevenue}</p>
                        </div>
                        <div className="bg-amber-100 dark:bg-amber-950 p-3 rounded-md">
                          <p className="text-xs text-muted-foreground">Platform Fee</p>
                          <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{item.platformFee}</p>
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-950 p-3 rounded-md">
                          <p className="text-xs text-muted-foreground">Our Commission</p>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{item.ourCommission}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.explanation}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown by Platform</CardTitle>
          <CardDescription>
            Total Revenue Generated: ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <br />
            Your Total Share: ${totalShare.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({Math.round(totalShare/totalRevenue * 100)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Your Share (70%)</TableHead>
                <TableHead>Platform Fee (15%)</TableHead>
                <TableHead>Our Commission (15%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueHistory.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{item.platform}</TableCell>
                  <TableCell>{item.totalRevenue}</TableCell>
                  <TableCell className="text-green-600 dark:text-green-400">{item.yourShare}</TableCell>
                  <TableCell>{item.platformFee}</TableCell>
                  <TableCell>{item.ourCommission}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionBreakdown;
