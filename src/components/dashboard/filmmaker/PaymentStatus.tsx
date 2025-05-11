
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, Check, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { PaymentStatus as PaymentStatusType } from "./revenue/types";

const PaymentStatus = () => {
  const [paymentData, setPaymentData] = useState<PaymentStatusType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setPaymentSummary] = useState({
    totalPaid: 0,
    totalPending: 0,
    totalFailed: 0,
    nextPaymentDate: null
  });

  const form = useForm({
    defaultValues: {
      status: "all",
      platform: "all",
      location: "all"
    }
  });

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would fetch from the database
      // For now, we'll use the mock data
      const mockPayments = getMockPaymentData();
      setPaymentData(mockPayments);
      
      // Calculate summary data
      const totalPaid = mockPayments
        .filter(payment => payment.status === 'paid')
        .reduce((sum, payment) => sum + payment.amount, 0);
      
      const totalPending = mockPayments
        .filter(payment => payment.status === 'pending')
        .reduce((sum, payment) => sum + payment.amount, 0);
      
      const totalProcessing = mockPayments
        .filter(payment => payment.status === 'processing')
        .reduce((sum, payment) => sum + payment.amount, 0);
      
      // Find next payment date (closest future date)
      const today = new Date();
      const futureDates = mockPayments
        .filter(payment => new Date(payment.paymentDate) > today)
        .map(payment => new Date(payment.paymentDate));
      
      const nextPaymentDate = futureDates.length > 0 
        ? futureDates.reduce((closest, date) => 
            date < closest ? date : closest, futureDates[0])
        : null;
      
      setPaymentSummary({
        totalPaid,
        totalPending,
        totalFailed: 0,
        nextPaymentDate
      });
      
    } catch (error) {
      console.error("Error fetching payment data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMockPaymentData = (): PaymentStatusType[] => {
    return [
      {
        id: "INV-001",
        filmTitle: "Summer Dreams",
        platform: "Netflix",
        location: "Global",
        amount: 329.80,
        paymentDate: "2023-10-04",
        status: "paid",
        paymentMethod: "Direct Deposit",
        transactionId: "TX-1234567",
        views: 15200
      },
      {
        id: "INV-002",
        filmTitle: "Summer Dreams",
        platform: "YouTube",
        location: "US",
        amount: 420.50,
        paymentDate: "2023-11-03",
        status: "pending",
        paymentMethod: "Bank Transfer",
        transactionId: "TX-7654321",
        views: 24500
      },
      {
        id: "INV-003",
        filmTitle: "Urban Legends",
        platform: "Amazon Prime",
        location: "EU",
        amount: 380.20,
        paymentDate: "2023-12-02",
        status: "paid",
        paymentMethod: "PayPal",
        transactionId: "TX-9876543",
        views: 18300
      },
      {
        id: "INV-004",
        filmTitle: "Urban Legends",
        platform: "Hulu",
        location: "US",
        amount: 412.30,
        paymentDate: "2024-01-01",
        status: "processing",
        paymentMethod: "Direct Deposit",
        transactionId: "TX-3456789",
        views: 19700
      },
      {
        id: "INV-005",
        filmTitle: "Midnight Tales",
        platform: "Tubi",
        location: "US",
        amount: 355.40,
        paymentDate: "2024-02-05",
        status: "processing",
        paymentMethod: "Bank Transfer",
        transactionId: "TX-2345678",
        views: 28400
      }
    ];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">{status}</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">{status}</Badge>;
      case "processing":
        return <Badge className="bg-blue-500">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Invoice', 'Date', 'Film', 'Platform', 'Location', 'Views', 'Amount', 'Status', 'Payment Method', 'Reference'],
      ...paymentData.map(p => [
        p.id,
        format(new Date(p.paymentDate), 'yyyy-MM-dd'),
        p.filmTitle,
        p.platform,
        p.location,
        p.views?.toString() || '0',
        p.amount.toString(),
        p.status,
        p.paymentMethod || '-',
        p.transactionId || '-'
      ])
    ];

    const csvString = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-status-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const handleFilterChange = (values: any) => {
    // This would filter data in a real implementation
    console.log("Filtering with:", values);
    // Re-fetch or filter the existing data
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {paymentData.filter(p => p.status === 'paid').length} payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalPending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {paymentData.filter(p => p.status === 'pending').length} payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <X className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${paymentData
              .filter(p => p.status === 'processing')
              .reduce((sum, p) => sum + p.amount, 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {paymentData.filter(p => p.status === 'processing').length} payment(s)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.nextPaymentDate 
                ? format(summary.nextPaymentDate, "MMM d, yyyy")
                : "No upcoming payments"}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.nextPaymentDate ? "Estimated: $400-$450" : "Check back soon"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>A detailed list of all your payment transactions</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Form {...form}>
                <form className="flex items-center space-x-2" onChange={form.handleSubmit(handleFilterChange)}>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <select 
                            {...field}
                            className="h-9 rounded-md border border-input px-3 py-1 text-sm"
                          >
                            <option value="all">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                          </select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <select 
                            {...field}
                            className="h-9 rounded-md border border-input px-3 py-1 text-sm"
                          >
                            <option value="all">All Platforms</option>
                            <option value="Netflix">Netflix</option>
                            <option value="YouTube">YouTube</option>
                            <option value="Amazon Prime">Amazon Prime</option>
                            <option value="Hulu">Hulu</option>
                            <option value="Tubi">Tubi</option>
                          </select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button variant="outline" size="sm" type="submit" className="h-9">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </form>
              </Form>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" />
                Download All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Film</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentData.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{format(new Date(payment.paymentDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{payment.filmTitle}</TableCell>
                  <TableCell>{payment.platform}</TableCell>
                  <TableCell>{payment.location}</TableCell>
                  <TableCell>{payment.views?.toLocaleString() || '-'}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell className="font-mono text-sm">{payment.transactionId || '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-muted rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                </div>
                <div>
                  <p className="font-medium">Direct Deposit</p>
                  <p className="text-sm text-muted-foreground">Bank of America ****4242</p>
                </div>
              </div>
              <Badge>Default</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-muted rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                </div>
                <div>
                  <p className="font-medium">PayPal</p>
                  <p className="text-sm text-muted-foreground">filmmaker@example.com</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Set as Default</Button>
            </div>
            
            <div className="mt-6">
              <Button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                Add Payment Method
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatus;
