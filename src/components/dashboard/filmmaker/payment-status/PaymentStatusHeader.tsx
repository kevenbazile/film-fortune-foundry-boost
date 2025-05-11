
import React from "react";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Download } from "lucide-react";
import PaymentFilters from "./PaymentFilters";
import { format } from "date-fns";
import { PaymentStatus } from "../revenue/types";

interface PaymentStatusHeaderProps {
  onFilterChange: (values: any) => void;
  paymentData: PaymentStatus[];
}

const PaymentStatusHeader: React.FC<PaymentStatusHeaderProps> = ({ onFilterChange, paymentData }) => {
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

  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>A detailed list of all your payment transactions</CardDescription>
      </div>
      <div className="flex items-center space-x-2">
        <PaymentFilters onFilterChange={onFilterChange} />
        <Button variant="outline" size="sm" onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" />
          Download All
        </Button>
      </div>
    </div>
  );
};

export default PaymentStatusHeader;
