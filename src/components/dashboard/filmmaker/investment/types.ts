
import * as z from "zod";

export const investmentFormSchema = z.object({
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

export type InvestmentFormValues = z.infer<typeof investmentFormSchema>;

export interface Application {
  id: string;
  project_title: string;
  project_type: string;
  requested_amount: number;
  status: string;
  submission_date: string;
  review_date: string | null;
  funding_date: string | null;
  review_notes: string | null;
}
