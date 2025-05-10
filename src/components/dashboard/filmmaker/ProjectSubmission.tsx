
import React, { useState } from "react";
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

  const onSubmit = async (formData) => {
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
      const genreArray = formData.genre.split(',').map(item => item.trim());
      
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
      
      toast({
        title: "Film Submitted Successfully",
        description: "Your film has been submitted for review.",
      });
      
      // Clear the form after successful submission
      form.reset();
      
    } catch (error) {
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
                
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your film file here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports MP4, MOV, AVI (max 5GB)
                    </p>
                    <Input id="filmUpload" type="file" className="hidden" />
                    <Button size="sm" variant="outline">Select File</Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Upload Cover Art & Promotional Materials</Label>
                
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Upload poster, stills, and promotional images
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports JPEG, PNG (max 10MB each)
                    </p>
                    <Input id="promoUpload" type="file" className="hidden" multiple />
                    <Button size="sm" variant="outline">Select Images</Button>
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
