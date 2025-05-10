
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const UserTierManagement = () => {
  const userTiers = [
    { name: "Basic", usersCount: 356, percentageGrowth: 12, color: "bg-blue-500" },
    { name: "Premium", usersCount: 192, percentageGrowth: 28, color: "bg-purple-500" },
    { name: "Elite", usersCount: 86, percentageGrowth: 17, color: "bg-amber-500" },
    { name: "Enterprise", usersCount: 24, percentageGrowth: 43, color: "bg-green-500" },
  ];

  const recentUsers = [
    { 
      name: "Alex Johnson", 
      email: "alex@filmstudio.com", 
      tier: "Premium", 
      joinDate: "2023-05-10", 
      films: 3,
      status: "Active"
    },
    { 
      name: "Maya Patel", 
      email: "maya@visualarts.net", 
      tier: "Elite", 
      joinDate: "2023-05-08", 
      films: 7,
      status: "Active"
    },
    { 
      name: "Carlos Rodriguez", 
      email: "carlos@filmcollective.org", 
      tier: "Basic", 
      joinDate: "2023-05-05", 
      films: 1,
      status: "Pending"
    },
    { 
      name: "Sarah Kim", 
      email: "sarah@indiefilms.co", 
      tier: "Premium", 
      joinDate: "2023-05-03", 
      films: 4,
      status: "Active"
    },
    { 
      name: "David Okafor", 
      email: "david@cinemacraft.com", 
      tier: "Enterprise", 
      joinDate: "2023-05-01", 
      films: 12,
      status: "Active"
    },
  ];

  const tierBenefits = {
    Basic: [
      "Distribution to 3 platforms",
      "Basic SEO optimization",
      "Standard thumbnails", 
      "Monthly reporting",
      "25% commission rate"
    ],
    Premium: [
      "Distribution to 5 platforms",
      "Custom trailer creation", 
      "Press kit development",
      "Film festival submissions (2)",
      "Social media package",
      "20% commission rate"
    ],
    Elite: [
      "Distribution to 7 platforms",
      "Comprehensive marketing",
      "Film festival submissions (5)",
      "Press outreach",
      "Complete social campaign",
      "Feature interviews",
      "15% commission rate"
    ],
    Enterprise: [
      "Distribution to 10+ platforms",
      "Custom marketing strategy",
      "Unlimited film festival submissions",
      "Dedicated account manager",
      "PR campaign management",
      "Premiere event support",
      "Custom commission structure"
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {userTiers.map((tier) => (
          <Card key={tier.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{tier.name} Tier</CardTitle>
              <CardDescription>{tier.usersCount} users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tier.color} text-white font-bold`}>
                  {tier.percentageGrowth}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Growth this month
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tier Management</CardTitle>
          <CardDescription>
            Configure user tiers, benefits, and pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users">
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="tiers">Tier Configuration</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-4">
              <div className="flex justify-between items-center my-4">
                <h3 className="text-lg font-medium">Recent Users</h3>
                <div className="flex items-center space-x-2">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Tier</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Films</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.tier}</TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>{user.films}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          user.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="tiers" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(tierBenefits).map(([tierName, benefits]) => (
                  <Card key={tierName}>
                    <CardHeader>
                      <CardTitle>{tierName} Tier</CardTitle>
                      <CardDescription>
                        Features and benefits
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1">
                        {benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm">{benefit}</li>
                        ))}
                      </ul>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm">Edit Tier</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <Button>Add New Tier</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="pricing" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Pricing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tier</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Commission</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Basic</TableCell>
                          <TableCell>$250</TableCell>
                          <TableCell>25%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Premium</TableCell>
                          <TableCell>$500</TableCell>
                          <TableCell>20%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Elite</TableCell>
                          <TableCell>$1,000</TableCell>
                          <TableCell>15%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Enterprise</TableCell>
                          <TableCell>Custom</TableCell>
                          <TableCell>Custom</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline">Update Pricing</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Tier</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Basic</span>
                          <span className="text-sm">$87,500</span>
                        </div>
                        <Progress value={35} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Premium</span>
                          <span className="text-sm">$96,000</span>
                        </div>
                        <Progress value={48} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Elite</span>
                          <span className="text-sm">$86,000</span>
                        </div>
                        <Progress value={43} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Enterprise</span>
                          <span className="text-sm">$120,000</span>
                        </div>
                        <Progress value={60} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserTierManagement;
