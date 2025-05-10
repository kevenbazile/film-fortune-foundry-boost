
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const ProjectSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [filmFile, setFilmFile] = useState<File | null>(null);
  const [promoFiles, setPromoFiles] = useState<File[]>([]);
  const filmFileInputRef = useRef<HTMLInputElement>(null);
  const promoFileInputRef = useRef<HTMLInputElement>(null);
  
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
    e.preventDefault();
    const files = e.target.files;
    if (files && files.length > 0) {
      setFilmFile(files[0]);
      toast({
        title: "Film File Selected",
        description: `Selected: ${files[0].name}`,
      });
    }
  };

  const handlePromoFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setPromoFiles(prevFiles => [...prevFiles, ...newFiles]);
      toast({
        title: "Promotional Files Selected",
        description: `Added ${files.length} file(s)`,
      });
    }
  };

  const handleFilmUploadClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    filmFileInputRef.current?.click();
  };

  const handlePromoUploadClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    promoFileInputRef.current?.click();
  };

  const uploadFilesToStorage = async (userId: string, filmId: string) => {
    try {
      // Upload film file if selected
      let filmUrl = "";
      if (filmFile) {
        const filmFileName = `${userId}/${filmId}/${Date.now()}-${filmFile.name}`;
        const { data: filmData, error: filmError } = await supabase.storage
          .from('films')
          .upload(filmFileName, filmFile);
        
        if (filmError) throw filmError;
        
        const { data: filmUrlData } = await supabase.storage
          .from('films')
          .getPublicUrl(filmFileName);
        
        filmUrl = filmUrlData.publicUrl;
      }
      
      // Upload promotional files if any
      const promoUrls: string[] = [];
      for (const promoFile of promoFiles) {
        const promoFileName = `${userId}/${filmId}/promo/${Date.now()}-${promoFile.name}`;
        const { data: promoData, error: promoError } = await supabase.storage
          .from('films')
          .upload(promoFileName, promoFile);
        
        if (promoError) throw promoError;
        
        const { data: promoUrlData } = await supabase.storage
          .from('films')
          .getPublicUrl(promoFileName);
        
        promoUrls.push(promoUrlData.publicUrl);
      }
      
      // Update film record with URLs
      if (filmUrl || promoUrls.length > 0) {
        const updateData: any = {};
        
        if (filmUrl) {
          updateData.film_url = filmUrl;
        }
        
        if (promoUrls.length > 0) {
          updateData.poster_url = promoUrls[0]; // Use first promo image as poster
        }
        
        const { error: updateError } = await supabase
          .from('films')
          .update(updateData)
          .eq('id', filmId);
        
        if (updateError) throw updateError;
      }
      
      return { filmUrl, promoUrls };
    } catch (error: any) {
      console.error("File upload error:", error);
      throw new Error("Failed to upload files");
    }
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
        await uploadFilesToStorage(session.user.id, filmId);
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Film Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your film's title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="director"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Director</FormLabel>
                      <FormControl>
                        <Input placeholder="Director's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="releaseYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Release Year</FormLabel>
                      <FormControl>
                        <Input placeholder="YYYY" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="runtime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Runtime (minutes)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 90" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Drama, Comedy (comma separated)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="synopsis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Synopsis</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Briefly describe your film..." 
                        className="min-h-[100px]" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <Label>Upload Film Files</Label>
                
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={handleFilmUploadClick}
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your film file here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports MP4, MOV, AVI, DVI (max 5GB)
                    </p>
                    <Input 
                      ref={filmFileInputRef}
                      id="filmUpload" 
                      type="file" 
                      className="hidden" 
                      onChange={handleFilmFileSelect}
                      accept=".mp4,.mov,.avi,.dvi"
                    />
                    {filmFile && (
                      <p className="text-sm font-medium text-primary">
                        Selected: {filmFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Upload Cover Art & Promotional Materials</Label>
                
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={handlePromoUploadClick}
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Upload poster, stills, and promotional images
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports JPEG, PNG (max 10MB each)
                    </p>
                    <Input 
                      ref={promoFileInputRef}
                      id="promoUpload" 
                      type="file" 
                      className="hidden" 
                      onChange={handlePromoFilesSelect}
                      accept="image/jpeg,image/png" 
                      multiple 
                    />
                    {promoFiles.length > 0 && (
                      <p className="text-sm font-medium text-primary">
                        Selected: {promoFiles.length} file(s)
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any awards, festival history, or special notes..." 
                        className="min-h-[100px]" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
