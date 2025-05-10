
import React, { useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { handleFileSelect } from "./submission/fileUploadUtils";
import FilmUploader from "./submission/FilmUploader";
import PromoUploader from "./submission/PromoUploader";
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

  const filmFileInputRef = useRef<HTMLInputElement>(null);
  const promoFileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFilmFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e, setFilmFile, setPromoFiles);
  };

  const handlePromoFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e, setFilmFile, setPromoFiles, true);
  };

  const handleFilmUploadClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    if (filmFileInputRef.current) {
      filmFileInputRef.current.click();
    }
  };

  const handlePromoUploadClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    if (promoFileInputRef.current) {
      promoFileInputRef.current.click();
    }
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
