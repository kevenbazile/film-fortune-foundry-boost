
import { useFilmSubmissionForm } from "./film-submission/useFilmSubmissionForm";
// Change the regular export to "export type" for type exports
export type { FilmFormValues } from "./film-submission/schema";

export const useFilmSubmission = useFilmSubmissionForm;
