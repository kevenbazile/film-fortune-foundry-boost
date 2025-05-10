
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { uploadFilesToStorage } from "@/components/dashboard/filmmaker/submission/fileUploadUtils";
import { ensureStorageBuckets } from "@/integrations/supabase/storage";

type FilmFormValues = {
  title: string;
  director: string;
  releaseYear: number;
  runtime: number;
  genre: string;
  synopsis: string;
  additionalInfo: string;
};

export const useFilmSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [filmFile, setFilmFile] = useState<File | null>(null);
  const [promoFiles, setPromoFiles] = useState<File[]>([]);
  
  const form = useForm<FilmFormValues>({
    defaultValues: {
      title: "",
      director: "",
      releaseYear: new Date().getFullYear(),
      runtime: 0,
      genre: "",
      synopsis: "",
      additionalInfo: ""
    }
  });

  // Ensure storage buckets exist when hook initializes
  useEffect(() => {
    ensureStorageBuckets().catch(err => {
      console.error("Failed to ensure storage buckets:", err);
      toast({
        title: "Storage Setup Error",
        description: "There was an issue setting up file storage. Please try again later.",
        variant: "destructive",
      });
    });
  }, []);

  const onSubmit = async (formData: FilmFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to submit a film",
          variant: "destructive",
        });
        return;
      }
      
      // Parse genre string into an array
      const genreArray = formData.genre.split(',').map((item: string) => item.trim());
      
      // First create the film entry
      const { data, error } = await supabase
        .from('films')
        .insert({
          user_id: session.user.id,
          title: formData.title,
          director: formData.director,
          release_year: formData.releaseYear,
          duration: formData.runtime,
          genre: genreArray,
          description: formData.synopsis,
          review_notes: formData.additionalInfo,
          status: 'pending'
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error("Failed to create film entry");
      }
      
      const filmId = data[0].id;
      
      // Then upload files if any were selected
      if (filmFile || promoFiles.length > 0) {
        await uploadFilesToStorage(session.user.id, filmId, filmFile, promoFiles);
      }
      
      toast({
        title: "Film Submitted Successfully",
        description: "Your film has been submitted for review.",
      });
      
      // Clear the form and selected files after successful submission
      form.reset();
      setFilmFile(null);
      setPromoFiles([]);
      
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "An error occurred during submission",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = () => {
    // In a real application, this would save the current form state
    // to localStorage or to a drafts table in the database
    setIsDraftSaving(true);
    
    setTimeout(() => {
      toast({
        title: "Draft Saved",
        description: "Your film details have been saved as a draft.",
      });
      setIsDraftSaving(false);
    }, 1000);
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
