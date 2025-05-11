
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { InvestmentFormValues } from "../types";

interface ProjectInfoFieldsProps {
  form: UseFormReturn<InvestmentFormValues>;
}

const ProjectInfoFields = ({ form }: ProjectInfoFieldsProps) => {
  return (
    <>
      {/* Project Type */}
      <FormField
        control={form.control}
        name="projectType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Type*</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="film">Film</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="festival">Film Festival</SelectItem>
                <SelectItem value="series">Series</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Project Title */}
      <FormField
        control={form.control}
        name="projectTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Title*</FormLabel>
            <FormControl>
              <Input placeholder="Enter the title of your project" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Description*</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Provide a detailed description of your project"
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Requested Amount */}
      <FormField
        control={form.control}
        name="requestedAmount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Requested Amount*</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="$0.00"
                step="0.01"
                {...field}
              />
            </FormControl>
            <FormDescription>Enter the funding amount you're requesting</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Use of Funds */}
      <FormField
        control={form.control}
        name="useOfFunds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Use of Funds*</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Explain how you will use the requested funds"
                className="min-h-[120px]"
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

export default ProjectInfoFields;
