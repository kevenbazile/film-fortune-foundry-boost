
import * as z from "zod";

export const FilmFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  director: z.string().min(2, {
    message: "Director's name must be at least 2 characters.",
  }),
  releaseYear: z.number().min(1888).max(new Date().getFullYear()),
  genres: z.string().min(3, {
    message: "Please select at least one genre.",
  }),
  mainCast: z.string().min(3, {
    message: "Main cast must be at least 3 characters.",
  }),
  duration: z.number().min(1, {
    message: "Duration must be at least 1 minute.",
  }),
});

export type FilmFormValues = z.infer<typeof FilmFormSchema>;
