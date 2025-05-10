
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { checkAuthentication } from "@/components/dashboard/filmmaker/submission/authUtils";
import { uploadFilesToStorage } from "@/components/dashboard/filmmaker/submission/fileUploadService";
import { FilmFormValues } from "./schema";

export const useDraftSaving = (
  form: UseFormReturn<FilmFormValues>,
  filmFile: File | null,
  promoFiles: File[]
) => {
  const [isDraftSaving, setIsDraftSaving] = useState(false);

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

  return { isDraftSaving, saveDraft };
};
