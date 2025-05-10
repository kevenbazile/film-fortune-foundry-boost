
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FilmUploader from "./submission/FilmUploader";
import CoverArtUploader from "./submission/CoverArtUploader";
import FilmDetailsForm from "./submission/FilmDetailsForm";
import { useFilmSubmission } from "@/hooks/useFilmSubmission";

const ProjectSubmission = () => {
  const {
    form,
    isSubmitting,
    isDraftSaving,
    filmFile,
    setFilmFile,
    promoFiles,
    setPromoFiles,
    onSubmit,
    saveDraft
  } = useFilmSubmission();
  
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
                onFileSelect={setFilmFile}
              />
              
              <CoverArtUploader 
                promoFiles={promoFiles}
                onFilesSelect={setPromoFiles}
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
