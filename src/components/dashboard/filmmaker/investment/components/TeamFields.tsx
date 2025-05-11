
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { InvestmentFormValues } from "../types";

interface TeamFieldsProps {
  form: UseFormReturn<InvestmentFormValues>;
}

const TeamFields = ({ form }: TeamFieldsProps) => {
  return (
    <>
      {/* Team Info */}
      <FormField
        control={form.control}
        name="teamInfo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Team Information</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us about the key people involved in this project"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Previous Work */}
      <FormField
        control={form.control}
        name="previousWork"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Previous Work</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your relevant past work or experience"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default TeamFields;
