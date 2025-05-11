
import React from "react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Filter } from "lucide-react";

interface PaymentFiltersProps {
  onFilterChange: (values: any) => void;
}

const PaymentFilters: React.FC<PaymentFiltersProps> = ({ onFilterChange }) => {
  const form = useForm({
    defaultValues: {
      status: "all",
      platform: "all",
      location: "all"
    }
  });

  return (
    <Form {...form}>
      <form className="flex items-center space-x-2" onChange={form.handleSubmit(onFilterChange)}>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <select 
                  {...field}
                  className="h-9 rounded-md border border-input px-3 py-1 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                </select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <select 
                  {...field}
                  className="h-9 rounded-md border border-input px-3 py-1 text-sm"
                >
                  <option value="all">All Platforms</option>
                  <option value="Netflix">Netflix</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Amazon Prime">Amazon Prime</option>
                  <option value="Hulu">Hulu</option>
                  <option value="Tubi">Tubi</option>
                </select>
              </FormControl>
            </FormItem>
          )}
        />
        <Button variant="outline" size="sm" type="submit" className="h-9">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </form>
    </Form>
  );
};

export default PaymentFilters;
