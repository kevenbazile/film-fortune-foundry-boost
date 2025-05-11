
import React from "react";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Download } from "lucide-react";
import PaymentFilters from "./PaymentFilters";
import { PaymentStatus } from "../revenue/types";
import { exportPaymentsToCSV } from "./services/paymentDataService";

interface PaymentStatusHeaderProps {
  onFilterChange: (values: any) => void;
  paymentData: PaymentStatus[];
}

const PaymentStatusHeader: React.FC<PaymentStatusHeaderProps> = ({ onFilterChange, paymentData }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>A detailed list of all your payment transactions</CardDescription>
      </div>
      <div className="flex items-center space-x-2">
        <PaymentFilters onFilterChange={onFilterChange} />
        <Button variant="outline" size="sm" onClick={() => exportPaymentsToCSV(paymentData)}>
          <Download className="mr-2 h-4 w-4" />
          Download All
        </Button>
      </div>
    </div>
  );
};

export default PaymentStatusHeader;
