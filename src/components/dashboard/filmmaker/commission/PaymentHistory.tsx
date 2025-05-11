
import React, { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { InfoIcon, AlertTriangle, Download, RefreshCw, AlertCircle } from "lucide-react";
import { Payment } from "./useCommissionData";

interface PaymentHistoryProps {
  payments: Payment[];
  loading: boolean;
  onDispute: (paymentId: string, reason: string) => Promise<void>;
  onExportCSV: () => void;
  onRefresh: () => void;
}

const PaymentHistory = ({ 
  payments, 
  loading, 
  onDispute, 
  onExportCSV,
  onRefresh 
}: PaymentHistoryProps) => {
  const [disputeModal, setDisputeModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleDispute = (payment: Payment) => {
    setSelectedPayment(payment);
    setDisputeReason("");
    setDisputeModal(true);
  };

  const submitDispute = async () => {
    if (!selectedPayment || !disputeReason.trim()) return;
    
    setSubmitting(true);
    try {
      await onDispute(selectedPayment.id, disputeReason);
      setDisputeModal(false);
    } catch (error) {
      console.error("Error submitting dispute:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200">Pending</Badge>;
      case 'disputed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">Disputed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Loading your payment data...</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Track your revenue share payments</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              className="h-8"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onExportCSV}
              className="h-8"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              Revenue share payments are processed monthly. Your filmmaker's share is calculated as 
              the total revenue minus platform fees and our commission.
            </AlertDescription>
          </Alert>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Payer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {format(new Date(payment.date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{payment.platform}</TableCell>
                      <TableCell>{payment.payerInfo.name}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={payment.status === 'disputed'}
                          onClick={() => handleDispute(payment)}
                          className={payment.status === 'disputed' ? 'text-muted-foreground' : 'text-destructive hover:text-destructive/90'}
                        >
                          {payment.status === 'disputed' ? 'Disputed' : 'Dispute'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      <InfoIcon className="mx-auto h-8 w-8 mb-2" />
                      <p>No payment history available yet.</p>
                      <p className="text-sm">Payments will appear here once your film generates revenue.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dispute Modal */}
      <Dialog open={disputeModal} onOpenChange={setDisputeModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
              Report Payment Dispute
            </DialogTitle>
            <DialogDescription>
              Please explain why you're disputing this payment. Our team will review your case within 48 hours.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Platform:</div>
                <div>{selectedPayment.platform}</div>
                
                <div className="text-muted-foreground">Payment Date:</div>
                <div>{format(new Date(selectedPayment.date), 'MMM dd, yyyy')}</div>
                
                <div className="text-muted-foreground">Amount:</div>
                <div>${selectedPayment.amount.toFixed(2)}</div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="dispute-reason" className="text-sm font-medium">
                  Reason for Dispute
                </label>
                <Textarea
                  id="dispute-reason"
                  placeholder="Please explain the issue with this payment"
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisputeModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitDispute} 
              disabled={!disputeReason.trim() || submitting}
              variant="destructive"
            >
              {submitting ? "Submitting..." : "Submit Dispute"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentHistory;
