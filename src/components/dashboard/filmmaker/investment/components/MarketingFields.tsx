
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { InvestmentFormValues } from "../types";

interface MarketingFieldsProps {
  form: UseFormReturn<InvestmentFormValues>;
}

const MarketingFields = ({ form }: MarketingFieldsProps) => {
  return (
    <>
      {/* Target Audience */}
      <FormField
        control={form.control}
        name="targetAudience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Target Audience</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your intended audience"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Marketing Plan */}
      <FormField
        control={form.control}
        name="marketingPlan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Marketing Plan</FormLabel>
            <FormControl>
              <Textarea
                placeholder="How will you market or promote this project?"
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

export default MarketingFields;
