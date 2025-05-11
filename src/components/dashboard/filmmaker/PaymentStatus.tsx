
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import PaymentSummary from "./payment-status/PaymentSummary";
import PaymentStatusHeader from "./payment-status/PaymentStatusHeader";
import PaymentTable from "./payment-status/PaymentTable";
import PaymentMethods from "./payment-status/PaymentMethods";
import { usePaymentData } from "./payment-status/hooks/usePaymentData";

const PaymentStatus = () => {
  const [filters, setFilters] = useState({
    status: "all",
    platform: "all",
    location: "all"
  });

  const { paymentData, summary, isLoading, isError, error, refetch } = usePaymentData();
  
  // Filter payment data based on selected filters
  const filteredPaymentData = paymentData.filter(payment => {
    if (filters.status !== "all" && payment.status !== filters.status) {
      return false;
    }
    if (filters.platform !== "all" && payment.platform !== filters.platform) {
      return false;
    }
    if (filters.location !== "all" && payment.location !== filters.location) {
      return false;
    }
    return true;
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  if (isError) {
    toast({
      title: "Error loading payment data",
      description: error instanceof Error ? error.message : "Please try again later",
      variant: "destructive"
    });
  }

  return (
    <div className="space-y-8">
      <PaymentSummary paymentData={filteredPaymentData} summary={summary} />

      <Card>
        <CardHeader>
          <PaymentStatusHeader 
            onFilterChange={handleFilterChange} 
            paymentData={filteredPaymentData} 
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <p className="text-muted-foreground">Loading payment data...</p>
            </div>
          ) : (
            <PaymentTable paymentData={filteredPaymentData} />
          )}
        </CardContent>
      </Card>

      <PaymentMethods />
    </div>
  );
};

export default PaymentStatus;
