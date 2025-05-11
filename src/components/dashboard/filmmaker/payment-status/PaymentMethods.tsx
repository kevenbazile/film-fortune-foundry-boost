
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PaymentMethodCard from "./PaymentMethodCard";

const PaymentMethods: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Manage your payment methods and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <PaymentMethodCard
            type="Direct Deposit"
            details="Bank of America ****4242"
            isDefault={true}
          />
          
          <PaymentMethodCard
            type="PayPal"
            details="filmmaker@example.com"
            isDefault={false}
          />
          
          <div className="mt-6">
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <line x1="12" x2="12" y1="5" y2="19"/>
                <line x1="5" x2="19" y1="12" y2="12"/>
              </svg>
              Add Payment Method
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
