
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Users } from "lucide-react";

const UserTierManagement = () => {
  const users = [
    { id: "U-001", name: "Maria Rodriguez", email: "maria.r@example.com", tier: "premium", joinDate: "2023-09-15", films: 3, revenue: "$12,480" },
    { id: "U-002", name: "James Wilson", email: "james.w@example.com", tier: "standard", joinDate: "2023-10-22", films: 1, revenue: "$9,320" },
    { id: "U-003", name: "Emma Chen", email: "emma.c@example.com", tier: "basic", joinDate: "2023-11-05", films: 1, revenue: "$7,640" },
    { id: "U-004", name: "David Patel", email: "david.p@example.com", tier: "premium", joinDate: "2023-12-10", films: 2, revenue: "$6,220" },
    { id: "U-005", name: "Michael Thompson", email: "michael.t@example.com", tier: "basic", joinDate: "2024-01-18", films: 1, revenue: "$5,890" },
    { id: "U-006", name: "Sarah Johnson", email: "sarah.j@example.com", tier: "standard", joinDate: "2024-01-25", films: 1, revenue: "$0" },
    { id: "U-007", name: "Carlos Garcia", email: "carlos.g@example.com", tier: "basic", joinDate: "2024-02-02", films: 1, revenue: "$0" },
  ];

  const tierDistribution = [
    { tier: "Basic", count: 3, percentage: "42.9%" },
    { tier: "Standard", count: 2, percentage: "28.6%" },
    { tier: "Premium", count: 2, percentage: "28.6%" },
  ];

  const tierDetails = [
    { 
      tier: "Basic", 
      features: [
        "Digital distribution to 3 platforms",
        "Basic marketing materials",
        "Standard film encoding",
        "90-day distribution cycle",
        "Basic performance reports"
      ],
      commission: "15%",
      price: "$499"
    },
    { 
      tier: "Standard", 
      features: [
        "Digital distribution to 5 platforms",
        "Custom trailer production",
        "Professional film encoding",
        "180-day distribution cycle",
        "Monthly performance reports",
        "Social media promotion package"
      ],
      commission: "10%",
      price: "$999"
    },
    { 
      tier: "Premium", 
      features: [
        "Digital distribution to 8+ platforms",
        "Film festival submissions (5 included)",
        "Press kit development",
        "Professional trailer production",
        "365-day distribution cycle",
        "Weekly performance reports",
        "Dedicated marketing campaign"
      ],
      commission: "5%",
      price: "$1,999"
    }
  ];

  const getTierBadge = (tier) => {
    switch (tier.toLowerCase()) {
      case "basic":
        return <Badge variant="outline">Basic</Badge>;
      case "standard":
        return <Badge className="bg-blue-500">Standard</Badge>;
      case "premium":
        return <Badge className="bg-purple-500">Premium</Badge>;
      default:
        return <Badge variant="outline">{tier}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Basic Tier</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tierDistribution[0].count}</div>
            <p className="text-xs text-muted-foreground">{tierDistribution[0].percentage} of users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Standard Tier</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tierDistribution[1].count}</div>
            <p className="text-xs text-muted-foreground">{tierDistribution[1].percentage} of users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Tier</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tierDistribution[2].count}</div>
            <p className="text-xs text-muted-foreground">{tierDistribution[2].percentage} of users</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage filmmaker accounts and subscription tiers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Films</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono">{user.id}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getTierBadge(user.tier)}</TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>{user.films}</TableCell>
                  <TableCell>{user.revenue}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">Edit Tier</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit User Tier</DialogTitle>
                          <DialogDescription>
                            Update subscription tier for {user.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input id="name" value={user.name} className="col-span-3" disabled />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tier" className="text-right">
                              Subscription Tier
                            </Label>
                            <Select defaultValue={user.tier} className="col-span-3">
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a tier" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Subscription Tiers</SelectLabel>
                                  <SelectItem value="basic">Basic</SelectItem>
                                  <SelectItem value="standard">Standard</SelectItem>
                                  <SelectItem value="premium">Premium</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Save changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tier Details & Configuration</CardTitle>
          <CardDescription>Configure subscription tiers and features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tierDetails.map((tier, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {tier.tier}
                    <span className="text-lg">{tier.price}</span>
                  </CardTitle>
                  <CardDescription>Commission Rate: {tier.commission}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-primary shrink-0 mt-0.5"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-4 pt-0">
                  <Button variant="outline" className="w-full">Edit Tier</Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserTierManagement;
