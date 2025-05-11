
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StaffRevenueEntry from "./StaffRevenueEntry";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 

const PaymentControls = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment & Revenue Controls</CardTitle>
          <CardDescription>
            Manage filmmaker payments, platform revenue entries, and financial transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="revenue" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="revenue">Revenue Entry</TabsTrigger>
              <TabsTrigger value="payments">Filmmaker Payments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="revenue" className="mt-6">
              <StaffRevenueEntry />
            </TabsContent>
            
            <TabsContent value="payments" className="mt-6">
              <div className="text-center p-8 text-muted-foreground">
                Filmmaker payment processing module will be available soon
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentControls;
