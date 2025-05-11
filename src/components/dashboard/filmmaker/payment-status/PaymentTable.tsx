
import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { PaymentStatus as PaymentStatusType } from "../revenue/types";

interface PaymentTableProps {
  paymentData: PaymentStatusType[];
}

const PaymentTable: React.FC<PaymentTableProps> = ({ paymentData }) => {
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

  return (
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
  );
};

export default PaymentTable;
