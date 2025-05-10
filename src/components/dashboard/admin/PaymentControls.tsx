
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertCircle, CreditCard, DollarSign, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PaymentControls = () => {
  const pendingPayments = [
    { id: "PAY-001", filmmaker: "Maria Rodriguez", film: "The Last Journey", amount: "$8,736", due: "2024-03-15", method: "Direct Deposit", status: "scheduled" },
    { id: "PAY-002", filmmaker: "James Wilson", film: "Neon Dreams", amount: "$6,524", due: "2024-03-10", method: "PayPal", status: "processing" },
    { id: "PAY-003", filmmaker: "Emma Chen", film: "The Silent Voice", amount: "$5,348", due: "2024-03-20", method: "Direct Deposit", status: "pending" },
    { id: "PAY-004", filmmaker: "David Patel", film: "Beyond Tomorrow", amount: "$4,354", due: "2024-03-25", method: "Direct Deposit", status: "pending" },
    { id: "PAY-005", filmmaker: "Michael Thompson", film: "Forgotten Shores", amount: "$4,123", due: "2024-04-01", method: "PayPal", status: "pending" },
  ];

  const completedPayments = [
    { id: "PAY-101", filmmaker: "Maria Rodriguez", film: "The Last Journey", amount: "$6,240", date: "2024-02-15", method: "Direct Deposit", reference: "TRX-98765" },
    { id: "PAY-102", filmmaker: "James Wilson", film: "Neon Dreams", amount: "$4,660", date: "2024-02-10", method: "PayPal", reference: "TRX-87654" },
    { id: "PAY-103", filmmaker: "Emma Chen", film: "The Silent Voice", amount: "$3,820", date: "2024-02-05", method: "Direct Deposit", reference: "TRX-76543" },
    { id: "PAY-104", filmmaker: "David Patel", film: "Beyond Tomorrow", amount: "$3,110", date: "2024-01-25", method: "Direct Deposit", reference: "TRX-65432" },
  ];

  const paymentIssues = [
    { id: "ISS-001", filmmaker: "Carlos Garcia", film: "Midnight Run", amount: "$2,450", issue: "Bank account verification failed", status: "unresolved", reportedDate: "2024-02-28" },
    { id: "ISS-002", filmmaker: "Lisa Wong", film: "The Mountain", amount: "$1,875", issue: "Payment rejected by processor", status: "resolved", reportedDate: "2024-02-22", resolution: "Updated payment method" },
    { id: "ISS-003", filmmaker: "Mark Stevens", film: "Ocean's Breath", amount: "$3,120", issue: "Incorrect banking information", status: "in progress", reportedDate: "2024-02-25" },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-500">{status}</Badge>;
      case "processing":
        return <Badge className="bg-yellow-500">{status}</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-muted-foreground">{status}</Badge>;
      case "completed":
        return <Badge className="bg-green-500">{status}</Badge>;
      case "failed":
        return <Badge className="bg-red-500">{status}</Badge>;
      case "unresolved":
        return <Badge className="bg-red-500">{status}</Badge>;
      case "in progress":
        return <Badge className="bg-yellow-500">{status}</Badge>;
      case "resolved":
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
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$29,085</div>
            <p className="text-xs text-muted-foreground">5 payments pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complete This Month</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$17,830</div>
            <p className="text-xs text-muted-foreground">4 payments completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$6,524</div>
            <p className="text-xs text-muted-foreground">1 payment processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 unresolved issue</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Payments <Badge className="ml-2 bg-primary">{pendingPayments.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed Payments <Badge className="ml-2">{completedPayments.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="issues">
            Payment Issues <Badge className="ml-2 bg-destructive">{paymentIssues.length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pending Payments</CardTitle>
                  <CardDescription>Payments scheduled to be processed</CardDescription>
                </div>
                <Button>Process All Payments</Button>
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
                    <TableHead>Due Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
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
                      <TableCell>{payment.due}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="outline">View</Button>
                        {payment.status === 'pending' && (
                          <Button size="sm">Process</Button>
                        )}
                        {payment.status === 'processing' && (
                          <Button size="sm" variant="outline">Check Status</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Completed Payments</CardTitle>
                  <CardDescription>Successfully processed payments</CardDescription>
                </div>
                <Button variant="outline">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
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
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono">{payment.id}</TableCell>
                      <TableCell className="font-medium">{payment.filmmaker}</TableCell>
                      <TableCell>{payment.film}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell className="font-mono text-xs">{payment.reference}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">Receipt</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="issues" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Issues</CardTitle>
              <CardDescription>Problems that require attention</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Issue ID</TableHead>
                    <TableHead>Filmmaker</TableHead>
                    <TableHead>Film</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-mono">{issue.id}</TableCell>
                      <TableCell className="font-medium">{issue.filmmaker}</TableCell>
                      <TableCell>{issue.film}</TableCell>
                      <TableCell>{issue.amount}</TableCell>
                      <TableCell>{issue.issue}</TableCell>
                      <TableCell>{getStatusBadge(issue.status)}</TableCell>
                      <TableCell>{issue.reportedDate}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="outline">Details</Button>
                        {issue.status !== 'resolved' && (
                          <Button size="sm">Resolve</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Payment Processor Maintenance</AlertTitle>
            <AlertDescription>
              Our payment processor has scheduled maintenance on March 15, 2024, from 2:00 AM to 6:00 AM UTC. 
              Some payment processing may be delayed during this time. Please schedule payments accordingly.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Processing Settings</CardTitle>
              <CardDescription>Configure payment processing options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">Automatic Payments</h3>
                    <p className="text-sm text-muted-foreground">Process payments automatically on the due date</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                    <span className="font-medium">Enabled</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">Payment Threshold</h3>
                    <p className="text-sm text-muted-foreground">Minimum amount required for payment</p>
                  </div>
                  <div className="font-medium">$100</div>
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">Payment Cycle</h3>
                    <p className="text-sm text-muted-foreground">Frequency of payment processing</p>
                  </div>
                  <div className="font-medium">Monthly</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Payment Methods</h3>
                    <p className="text-sm text-muted-foreground">Available payment options</p>
                  </div>
                  <div className="font-medium">Direct Deposit, PayPal</div>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline">Configure Payment Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentControls;
