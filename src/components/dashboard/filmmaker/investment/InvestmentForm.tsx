
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const investmentFormSchema = z.object({
  projectType: z.enum(["film", "event", "festival", "series"], {
    required_error: "Project type is required",
  }),
  projectTitle: z.string().min(1, "Project title is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  requestedAmount: z.string().min(1, "Requested amount is required"),
  useOfFunds: z.string().min(20, "Use of funds must be at least 20 characters"),
  expectedDeliverables: z.string().optional(),
  timeline: z.string().optional(),
  targetAudience: z.string().optional(),
  marketingPlan: z.string().optional(),
  revenueProjections: z.object({
    year1: z.string().optional(),
    year2: z.string().optional(),
    year3: z.string().optional(),
  }),
  teamInfo: z.string().optional(),
  previousWork: z.string().optional(),
  additionalDocuments: z.array(z.any()).optional(),
});

type InvestmentFormValues = z.infer<typeof investmentFormSchema>;

const InvestmentForm = () => {
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
      
      // Submit directly via SQL - TypeScript doesn't know about the new table yet
      const { error } = await supabase.rpc('submit_investment_application', {
        application_data: applicationData
      });
      
      if (error) {
        console.error("Error submitting via RPC:", error);
        
        // Fallback to direct SQL query
        const { error: directError } = await supabase.rpc('insert_community_fund_application', {
          user_id_input: userId,
          project_type_input: data.projectType,
          project_title_input: data.projectTitle,
          description_input: data.description,
          requested_amount_input: parseFloat(data.requestedAmount),
          use_of_funds_input: data.useOfFunds,
          expected_deliverables_input: data.expectedDeliverables || null,
          timeline_input: data.timeline || null,
          target_audience_input: data.targetAudience || null,
          marketing_plan_input: data.marketingPlan || null,
          revenue_projections_input: JSON.stringify({
            year1: data.revenueProjections.year1 ? parseFloat(data.revenueProjections.year1) : 0,
            year2: data.revenueProjections.year2 ? parseFloat(data.revenueProjections.year2) : 0,
            year3: data.revenueProjections.year3 ? parseFloat(data.revenueProjections.year3) : 0
          }),
          team_info_input: data.teamInfo || null,
          previous_work_input: data.previousWork || null,
          additional_documents_input: JSON.stringify(uploadedDocuments),
          status_input: 'submitted',
          submission_date_input: new Date().toISOString()
        });
        
        if (directError) throw directError;
      }
      
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
              {/* Project Type */}
              <FormField
                control={form.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Type*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="film">Film</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="festival">Film Festival</SelectItem>
                        <SelectItem value="series">Series</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Project Title */}
              <FormField
                control={form.control}
                name="projectTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the title of your project" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed description of your project"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Requested Amount */}
              <FormField
                control={form.control}
                name="requestedAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requested Amount*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="$0.00"
                        step="0.01"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Enter the funding amount you're requesting</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Use of Funds */}
              <FormField
                control={form.control}
                name="useOfFunds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Use of Funds*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain how you will use the requested funds"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Expected Deliverables */}
              <FormField
                control={form.control}
                name="expectedDeliverables"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Deliverables</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What will you produce with this funding?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Timeline */}
              <FormField
                control={form.control}
                name="timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Timeline</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Outline key milestones and delivery dates"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Target Audience */}
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your intended audience"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Marketing Plan */}
              <FormField
                control={form.control}
                name="marketingPlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marketing Plan</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="How will you market or promote this project?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Revenue Projections */}
              <div>
                <h3 className="text-sm font-medium mb-2">Revenue Projections</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="revenueProjections.year1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year 1</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="$0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="revenueProjections.year2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year 2</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="$0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="revenueProjections.year3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year 3</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="$0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Team Info */}
              <FormField
                control={form.control}
                name="teamInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Information</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about the key people involved in this project"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Previous Work */}
              <FormField
                control={form.control}
                name="previousWork"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previous Work</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your relevant past work or experience"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Additional Documents */}
              <div>
                <Label htmlFor="additionalDocuments">Additional Documents</Label>
                <Input
                  id="additionalDocuments"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="mt-1"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload pitch deck, budget breakdown, team bios, etc.
                </p>
              </div>
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
