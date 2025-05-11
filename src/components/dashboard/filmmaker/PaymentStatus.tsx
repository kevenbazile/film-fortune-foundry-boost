
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { PaymentStatus as PaymentStatusType } from "./revenue/types";
import PaymentSummary from "./payment-status/PaymentSummary";
import PaymentStatusHeader from "./payment-status/PaymentStatusHeader";
import PaymentTable from "./payment-status/PaymentTable";
import PaymentMethods from "./payment-status/PaymentMethods";

const PaymentStatus = () => {
  const [paymentData, setPaymentData] = useState<PaymentStatusType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setPaymentSummary] = useState({
    totalPaid: 0,
    totalPending: 0,
    totalFailed: 0,
    nextPaymentDate: null
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

  const handleFilterChange = (values: any) => {
    // This would filter data in a real implementation
    console.log("Filtering with:", values);
    // Re-fetch or filter the existing data
  };

  return (
    <div className="space-y-8">
      <PaymentSummary paymentData={paymentData} summary={summary} />

      <Card>
        <CardHeader>
          <PaymentStatusHeader 
            onFilterChange={handleFilterChange} 
            paymentData={paymentData} 
          />
        </CardHeader>
        <CardContent>
          <PaymentTable paymentData={paymentData} />
        </CardContent>
      </Card>

      <PaymentMethods />
    </div>
  );
};

export default PaymentStatus;
