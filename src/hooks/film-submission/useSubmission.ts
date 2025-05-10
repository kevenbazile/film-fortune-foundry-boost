
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { checkAuthentication } from "@/components/dashboard/filmmaker/submission/authUtils";
import { uploadFilesToStorage } from "@/components/dashboard/filmmaker/submission/fileUploadService";
import { FilmFormValues } from "./schema";

export const useSubmission = (
  form: UseFormReturn<FilmFormValues>,
  filmFile: File | null,
  promoFiles: File[]
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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

  return { isSubmitting, onSubmit };
};
