
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { uploadFilesToStorage } from "@/components/dashboard/filmmaker/submission/storageUtils";
import { useNavigate } from "react-router-dom";
import { checkAuthentication } from "@/components/dashboard/filmmaker/submission/authUtils";

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

export type FilmFormValues = z.infer<typeof FilmFormSchema>;

export const useFilmSubmission = () => {
  const [filmFile, setFilmFile] = useState<File | null>(null);
  const [promoFiles, setPromoFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FilmFormValues>({
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
      // Check if user is authenticated
      const isAuthenticated = await checkAuthentication();
      if (!isAuthenticated) {
        return;
      }
      
      const values = form.getValues();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save a draft",
          variant: "destructive",
        });
        return;
      }
      
      const userId = session.user.id;
      
      // Convert genres string to array for database
      const genresArray = values.genres.split(',').map(genre => genre.trim());
      // Convert main cast to array if it's a string
      const mainCastArray = values.mainCast.split(',').map(actor => actor.trim());
      
      // Insert film into database as draft
      // Use "pending" status since "draft" is not in the enum
      const { data: filmData, error: filmError } = await supabase
        .from('films')
        .insert({
          title: values.title || "Draft Film",
          description: values.description || "Draft description",
          director: values.director || "",
          release_year: values.releaseYear,
          genre: genresArray,
          main_cast: mainCastArray,
          user_id: userId,
          duration: values.duration || 1,
          status: 'pending', // Using 'pending' as per the valid enum values
        })
        .select()
        .single();
      
      if (filmError) {
        console.error("Draft save error:", filmError);
        toast({
          title: "Failed to Save Draft",
          description: filmError.message,
          variant: "destructive",
        });
        return;
      }
      
      // Upload files if any are selected, even for drafts
      if (filmData && (filmFile || promoFiles.length > 0)) {
        try {
          await uploadFilesToStorage(userId, filmFile, promoFiles);
        } catch (uploadError: any) {
          console.error("Upload error:", uploadError);
          // Continue despite upload errors - the film record is already saved
        }
      }
      
      toast({
        title: "Draft Saved",
        description: "Your film submission has been saved as a draft.",
      });
    } catch (error: any) {
      console.error("Draft save error:", error);
      toast({
        title: "Failed to Save Draft",
        description: error.message || "There was an error saving your draft.",
        variant: "destructive",
      });
    } finally {
      setIsDraftSaving(false);
    }
  };

  const onSubmit = async (values: FilmFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Check if user is authenticated
      const isAuthenticated = await checkAuthentication();
      if (!isAuthenticated) {
        return;
      }
      
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
      
      // Convert genres string to array for database
      const genresArray = values.genres.split(',').map(genre => genre.trim());
      // Convert main cast to array if it's a string
      const mainCastArray = values.mainCast.split(',').map(actor => actor.trim());
      
      // Upload files to storage first
      let uploadResult;
      if (filmFile || promoFiles.length > 0) {
        try {
          uploadResult = await uploadFilesToStorage(userId, filmFile, promoFiles);
        } catch (uploadError: any) {
          console.error("Upload error:", uploadError);
          return;
        }
      }
      
      if (!uploadResult?.filmId) {
        // If no files were uploaded or the upload process didn't generate a filmId
        // The film record will be created in the database with basic info
        const { data: filmData, error: filmError } = await supabase
          .from('films')
          .insert({
            title: values.title,
            description: values.description,
            director: values.director,
            release_year: values.releaseYear,
            genre: genresArray,
            main_cast: mainCastArray,
            user_id: userId,
            duration: values.duration,
            status: 'pending',
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
    saveDraft
  };
};
