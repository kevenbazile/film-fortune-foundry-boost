
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import InvestmentForm from "./investment/InvestmentForm";
import ApplicationStatus from "./investment/ApplicationStatus";

const InvestmentCenter = () => {
  const [activeTab, setActiveTab] = useState("new");

  return (
    <div>
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px] mb-6">
          <TabsTrigger value="new">New Application</TabsTrigger>
          <TabsTrigger value="status">Application Status</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-0">
          <InvestmentForm />
        </TabsContent>

        <TabsContent value="status" className="mt-0">
          <ApplicationStatus />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestmentCenter;
