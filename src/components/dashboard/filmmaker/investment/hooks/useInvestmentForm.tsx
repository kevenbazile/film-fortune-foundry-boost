
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { investmentFormSchema, InvestmentFormValues } from "../types";

export const useInvestmentForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const form = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentFormSchema),
    defaultValues: {
      projectType: undefined,
      projectTitle: "",
      description: "",
      requestedAmount: "",
      useOfFunds: "",
      expectedDeliverables: "",
      timeline: "",
      targetAudience: "",
      marketingPlan: "",
      revenueProjections: {
        year1: "",
        year2: "",
        year3: "",
      },
      teamInfo: "",
      previousWork: "",
      additionalDocuments: [],
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleUploadFiles = async () => {
    if (!files) return [];
    
    const uploadedFiles = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `${Date.now()}-${file.name}`;
      
      try {
        const { data, error } = await supabase.storage
          .from('investment-documents')
          .upload(fileName, file);
        
        if (error) {
          console.error("Error uploading file:", error);
          continue;
        }
        
        // Construct file URL
        const baseUrl = "https://ntksaithgzkejypqeccx.supabase.co/storage/v1/object/public";
        const fileUrl = `${baseUrl}/investment-documents/${fileName}`;
        
        uploadedFiles.push({
          name: file.name,
          path: fileName,
          url: fileUrl
        });
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
    
    return uploadedFiles;
  };

  const onSubmit = async (data: InvestmentFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Check authentication
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "Authentication required",
          description: "Please log in to submit an investment application",
          variant: "destructive"
        });
        return;
      }

      // Upload any documents
      const uploadedDocuments = await handleUploadFiles();
      
      // Get current user
      const userId = session.session.user.id;
      
      // Prepare application data
      const applicationData = {
        user_id: userId,
        project_type: data.projectType,
        project_title: data.projectTitle,
        description: data.description,
        requested_amount: parseFloat(data.requestedAmount),
        use_of_funds: data.useOfFunds,
        expected_deliverables: data.expectedDeliverables,
        timeline: data.timeline,
        target_audience: data.targetAudience,
        marketing_plan: data.marketingPlan,
        revenue_projections: {
          year1: data.revenueProjections.year1 ? parseFloat(data.revenueProjections.year1) : 0,
          year2: data.revenueProjections.year2 ? parseFloat(data.revenueProjections.year2) : 0,
          year3: data.revenueProjections.year3 ? parseFloat(data.revenueProjections.year3) : 0
        },
        team_info: data.teamInfo,
        previous_work: data.previousWork,
        additional_documents: uploadedDocuments,
        status: 'submitted',
        submission_date: new Date().toISOString()
      };
      
      // Submit application using direct SQL insert
      const { data: result, error: submitError } = await supabase
        .from('community_fund_applications')
        .insert([{
          user_id: userId,
          project_type: data.projectType,
          project_title: data.projectTitle,
          description: data.description,
          requested_amount: parseFloat(data.requestedAmount),
          use_of_funds: data.useOfFunds,
          expected_deliverables: data.expectedDeliverables || null,
          timeline: data.timeline || null,
          target_audience: data.targetAudience || null,
          marketing_plan: data.marketingPlan || null,
          revenue_projections: {
            year1: data.revenueProjections.year1 ? parseFloat(data.revenueProjections.year1) : 0,
            year2: data.revenueProjections.year2 ? parseFloat(data.revenueProjections.year2) : 0,
            year3: data.revenueProjections.year3 ? parseFloat(data.revenueProjections.year3) : 0
          },
          team_info: data.teamInfo || null,
          previous_work: data.previousWork || null,
          additional_documents: uploadedDocuments,
          status: 'submitted',
          submission_date: new Date().toISOString()
        }])
        .select();
      
      if (submitError) throw submitError;
      
      // Success message
      toast({
        title: "Application submitted",
        description: "Your investment application has been submitted successfully!",
      });
      
      // Reset form
      form.reset();
      setFiles(null);
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    handleFileChange,
    onSubmit
  };
};
