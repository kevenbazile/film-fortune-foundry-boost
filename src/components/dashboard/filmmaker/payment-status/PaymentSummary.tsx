
import React from "react";
import PaymentSummaryCard from "./PaymentSummaryCard";
import { format } from "date-fns";
import { PaymentStatus } from "../revenue/types";

interface PaymentSummaryProps {
  paymentData: PaymentStatus[];
  summary: {
    totalPaid: number;
    totalPending: number;
    totalFailed: number;
    nextPaymentDate: Date | null;
    totalProcessing?: number;
  };
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ paymentData, summary }) => {
  const processingAmount = summary.totalProcessing || paymentData
    .filter(p => p.status === 'processing')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const processingCount = paymentData.filter(p => p.status === 'processing').length;
  const paidCount = paymentData.filter(p => p.status === 'paid').length;
  const pendingCount = paymentData.filter(p => p.status === 'pending').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <PaymentSummaryCard
        title="Total Paid"
        value={`$${summary.totalPaid.toFixed(2)}`}
        subtitle={`${paidCount} payments`}
        icon="check"
      />
      <PaymentSummaryCard
        title="Pending"
        value={`$${summary.totalPending.toFixed(2)}`}
        subtitle={`${pendingCount} payments`}
        icon="calendar"
      />
      <PaymentSummaryCard
        title="Processing"
        value={`$${processingAmount.toFixed(2)}`}
        subtitle={`${processingCount} payment(s)`}
        icon="x"
      />
      <PaymentSummaryCard
        title="Next Payment"
        value={summary.nextPaymentDate 
          ? format(summary.nextPaymentDate, "MMM d, yyyy")
          : "No upcoming payments"}
        subtitle={summary.nextPaymentDate ? "Estimated: $400-$450" : "Check back soon"}
        icon="calendar"
      />
    </div>
  );
};

export default PaymentSummary;
