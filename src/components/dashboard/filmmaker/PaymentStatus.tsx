import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import PaymentSummary from "./payment-status/PaymentSummary";
import PaymentStatusHeader from "./payment-status/PaymentStatusHeader";
import PaymentTable from "./payment-status/PaymentTable";
import PayoutRequestForm from "./payment-status/PayoutRequestForm";
import { usePaymentData } from "./payment-status/hooks/usePaymentData";

const PaymentStatus = () => {
  
  const [filters, setFilters] = useState({
    status: "all",
    platform: "all",
    location: "all"
  });
  
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState('paymentDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { paymentData, totalCount, summary, isLoading, isError, error, refetch } = usePaymentData(
    currentPage,
    pageSize,
    sortColumn,
    sortDirection
  );
  
  
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
    setCurrentPage(0); // Reset to first page when filters change
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleSortChange = (column: string, direction: 'asc' | 'desc') => {
    setSortColumn(column);
    setSortDirection(direction);
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
            <PaymentTable 
              paymentData={filteredPaymentData}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              onSortChange={handleSortChange}
              currentPage={currentPage}
              pageSize={pageSize}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
            />
          )}
        </CardContent>
      </Card>

      <PayoutRequestForm />
    </div>
  );
};

export default PaymentStatus;
