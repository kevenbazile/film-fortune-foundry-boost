import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { uploadFilesToStorage } from "@/components/dashboard/filmmaker/submission/storageUtils";
import { useNavigate } from "react-router-dom";

const FilmFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  director: z.string().min(2, {
    message: "Director's name must be at least 2 characters.",
  }),
  releaseYear: z.number().min(1888).max(new Date().getFullYear()),
  genres: z.string().min(3, {
    message: "Please select at least one genre.",
  }),
  mainCast: z.string().min(3, {
    message: "Main cast must be at least 3 characters.",
  }),
  duration: z.number().min(1, {
    message: "Duration must be at least 1 minute.",
  }),
});

export const useFilmSubmission = () => {
  const [filmFile, setFilmFile] = useState<File | null>(null);
  const [promoFiles, setPromoFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FilmFormSchema>>({
    resolver: zodResolver(FilmFormSchema),
    defaultValues: {
      title: "",
      description: "",
      director: "",
      releaseYear: new Date().getFullYear(),
      genres: "",
      mainCast: "",
      duration: 1,
    },
  });

  const saveDraft = async () => {
    setIsDraftSaving(true);
    try {
      // Simulate saving draft
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Draft Saved",
        description: "Your film submission has been saved as a draft.",
      });
    } catch (error) {
      toast({
        title: "Failed to Save Draft",
        description: "There was an error saving your draft.",
        variant: "destructive",
      });
    } finally {
      setIsDraftSaving(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof FilmFormSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit your film",
          variant: "destructive",
        });
        return;
      }
      
      const userId = session.user.id;
      
      // Insert film into database
      const { data: filmData, error: filmError } = await supabase
        .from('films')
        .insert({
          title: values.title,
          description: values.description,
          director: values.director,
          release_year: values.releaseYear,
          genre: values.genres,
          main_cast: values.mainCast?.split(',').map(actor => actor.trim()),
          user_id: userId,
          duration: values.duration,
        })
        .select()
        .single();
      
      if (filmError) {
        console.error("Film submission error:", filmError);
        toast({
          title: "Submission Failed",
          description: filmError.message,
          variant: "destructive",
        });
        return;
      }
      
      // Upload files to storage
      if (filmData && (filmFile || promoFiles.length > 0)) {
        await uploadFilesToStorage(userId, filmData.id, filmFile, promoFiles);
      }
      
      toast({
        title: "Submission Successful",
        description: "Your film has been submitted for review",
      });
      
      // Reset form and files
      form.reset();
      setFilmFile(null);
      setPromoFiles([]);
      
      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "An error occurred during submission",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    isDraftSaving,
    filmFile,
    setFilmFile,
    promoFiles,
    setPromoFiles,
    onSubmit,
    saveDraft: async () => {}
  };
};
