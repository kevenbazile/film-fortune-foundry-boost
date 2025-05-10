
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { handleFileSelect, uploadFilesToStorage } from "./submission/fileUploadUtils";
import FilmUploader from "./submission/FilmUploader";
import PromoUploader from "./submission/PromoUploader";
import FilmDetailsForm from "./submission/FilmDetailsForm";
import { ensureStorageBuckets } from "@/integrations/supabase/storage";

const ProjectSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [filmFile, setFilmFile] = useState<File | null>(null);
  const [promoFiles, setPromoFiles] = useState<File[]>([]);
  const filmFileInputRef = useRef<HTMLInputElement>(null);
  const promoFileInputRef = useRef<HTMLInputElement>(null);
  
  // Ensure storage buckets exist when component loads
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
  
  const form = useForm({
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

  const handleFilmFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e, setFilmFile, setPromoFiles);
  };

  const handlePromoFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e, setFilmFile, setPromoFiles, true);
  };

  const handleFilmUploadClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to upload files",
          variant: "destructive",
        });
        return;
      }
      
      if (filmFileInputRef.current) {
        filmFileInputRef.current.click();
      }
    });
  };

  const handlePromoUploadClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to upload files",
          variant: "destructive",
        });
        return;
      }
      
      if (promoFileInputRef.current) {
        promoFileInputRef.current.click();
      }
    });
  };

  const onSubmit = async (formData: any) => {
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Submit Your Film Project</CardTitle>
        <CardDescription>
          Fill out the form below to submit your film for review and distribution opportunities.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <div className="space-y-6">
              <FilmDetailsForm form={form} />
              
              <FilmUploader 
                filmFile={filmFile}
                filmFileInputRef={filmFileInputRef}
                handleFilmFileSelect={handleFilmFileSelect}
                handleFilmUploadClick={handleFilmUploadClick}
              />
              
              <PromoUploader 
                promoFiles={promoFiles}
                promoFileInputRef={promoFileInputRef}
                handlePromoFilesSelect={handlePromoFilesSelect}
                handlePromoUploadClick={handlePromoUploadClick}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={saveDraft}
              disabled={isDraftSaving}
            >
              {isDraftSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Film"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ProjectSubmission;
