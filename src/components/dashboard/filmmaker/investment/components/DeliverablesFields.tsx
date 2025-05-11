
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { InvestmentFormValues } from "../types";

interface DeliverablesFieldsProps {
  form: UseFormReturn<InvestmentFormValues>;
}

const DeliverablesFields = ({ form }: DeliverablesFieldsProps) => {
  return (
    <>
      {/* Expected Deliverables */}
      <FormField
        control={form.control}
        name="expectedDeliverables"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expected Deliverables</FormLabel>
            <FormControl>
              <Textarea
                placeholder="What will you produce with this funding?"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Timeline */}
      <FormField
        control={form.control}
        name="timeline"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Timeline</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Outline key milestones and delivery dates"
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

export default DeliverablesFields;
