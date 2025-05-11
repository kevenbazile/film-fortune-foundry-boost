
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form } from "@/components/ui/form";
import { Info } from "lucide-react";
import { useInvestmentForm } from "./hooks/useInvestmentForm";

// Import component sections
import ProjectInfoFields from "./components/ProjectInfoFields";
import DeliverablesFields from "./components/DeliverablesFields";
import MarketingFields from "./components/MarketingFields";
import RevenueFields from "./components/RevenueFields";
import TeamFields from "./components/TeamFields";
import DocumentUpload from "./components/DocumentUpload";

const InvestmentForm = () => {
  const { form, isSubmitting, handleFileChange, onSubmit } = useInvestmentForm();

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Community Fund Application</CardTitle>
        <CardDescription>
          Apply for funding for your film or media project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-700">Information</AlertTitle>
          <AlertDescription className="text-blue-700">
            Complete this form to apply for funding from our community fund. Please provide detailed information about your project to increase your chances of approval.
          </AlertDescription>
        </Alert>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Project Information Section */}
              <ProjectInfoFields form={form} />
              
              {/* Deliverables Section */}
              <DeliverablesFields form={form} />
              
              {/* Marketing Section */}
              <MarketingFields form={form} />
              
              {/* Revenue Projections Section */}
              <RevenueFields form={form} />
              
              {/* Team Information Section */}
              <TeamFields form={form} />
              
              {/* Document Upload Section */}
              <DocumentUpload handleFileChange={handleFileChange} />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default InvestmentForm;
