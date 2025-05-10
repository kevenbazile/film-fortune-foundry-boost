
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilmFormSchema, FilmFormValues } from "./schema";
import { useDraftSaving } from "./useDraftSaving";
import { useSubmission } from "./useSubmission";

export const useFilmSubmissionForm = () => {
  const [filmFile, setFilmFile] = useState<File | null>(null);
  const [promoFiles, setPromoFiles] = useState<File[]>([]);

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

  // Use our extracted hooks
  const { isDraftSaving, saveDraft } = useDraftSaving(form, filmFile, promoFiles);
  const { isSubmitting, onSubmit } = useSubmission(form, filmFile, promoFiles);

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
