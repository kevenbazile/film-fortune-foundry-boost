
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { InvestmentFormValues } from "../types";

interface RevenueFieldsProps {
  form: UseFormReturn<InvestmentFormValues>;
}

const RevenueFields = ({ form }: RevenueFieldsProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Revenue Projections</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="revenueProjections.year1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year 1</FormLabel>
              <FormControl>
                <Input type="number" placeholder="$0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="revenueProjections.year2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year 2</FormLabel>
              <FormControl>
                <Input type="number" placeholder="$0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="revenueProjections.year3"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year 3</FormLabel>
              <FormControl>
                <Input type="number" placeholder="$0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default RevenueFields;
