
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface BulkRevenueUploadProps {
  onEntriesUploaded?: () => void;
}

interface CsvEntry {
  film_id: string;
  platform: string;
  amount: string;
  payment_date: string;
  payment_period_start?: string;
  payment_period_end?: string;
  views?: string;
  transaction_id?: string;
  notes?: string;
}

export const BulkRevenueUpload: React.FC<BulkRevenueUploadProps> = ({ onEntriesUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [processedEntries, setProcessedEntries] = useState<CsvEntry[]>([]);

  const downloadTemplate = () => {
    const template = [
      ['film_id', 'platform', 'amount', 'payment_date', 'payment_period_start', 'payment_period_end', 'views', 'transaction_id', 'notes'],
      ['uuid', 'Netflix', '100.00', 'YYYY-MM-DD', 'YYYY-MM-DD', 'YYYY-MM-DD', '1000', 'tx123', 'Revenue from April']
    ];
    
    const csvContent = template.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue_template_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const processCSV = async (file: File) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const text = e.target?.result;
      if (typeof text !== 'string') return;
      
      try {
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0].map(header => header.trim());
        const data = rows.slice(1).filter(row => row.length >= headers.length);
        
        const entries = data.map(row => {
          const entry: Record<string, string> = {};
          headers.forEach((header, index) => {
            entry[header] = (row[index] || '').trim();
          });
          return entry as CsvEntry;
        });
        
        setProcessedEntries(entries);
        toast({
          title: "CSV Processed",
          description: `${entries.length} entries ready to upload`,
        });
      } catch (error) {
        console.error('Error processing CSV:', error);
        toast({
          title: "Error",
          description: "Failed to process CSV file. Please check the format.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
  };

  const uploadEntries = async () => {
    if (processedEntries.length === 0) return;
    
    setUploading(true);
    try {
      const preparedEntries = processedEntries.map(entry => ({
        film_id: entry.film_id,
        platform: entry.platform,
        amount: parseFloat(entry.amount),
        payment_date: entry.payment_date,
        payment_period_start: entry.payment_period_start || null,
        payment_period_end: entry.payment_period_end || null,
        views: entry.views ? parseInt(entry.views) : null,
        transaction_id: entry.transaction_id || null,
        notes: entry.notes || null,
        status: 'paid',
        currency: 'USD'
      }));

      const { error } = await supabase
        .from('platform_earnings')
        .insert(preparedEntries);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `${processedEntries.length} entries uploaded successfully!`,
      });
      setProcessedEntries([]);
      
      if (onEntriesUploaded) {
        onEntriesUploaded();
      }
    } catch (error: any) {
      console.error('Error uploading entries:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload entries. Please check your data and try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Upload a CSV file with multiple revenue entries for quick processing.
      </p>
      <div className="flex flex-wrap gap-4">
        <Button
          variant="outline"
          onClick={downloadTemplate}
        >
          Download CSV Template
        </Button>
        
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => e.target.files?.[0] && processCSV(e.target.files[0])}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="cursor-pointer"
          >
            <Button>Upload CSV</Button>
          </label>
        </div>
      </div>
      
      {processedEntries.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">
            {processedEntries.length} entries ready to upload
          </p>
          <Button
            onClick={uploadEntries}
            disabled={uploading}
            variant="default"
          >
            {uploading ? 'Uploading...' : 'Confirm Upload'}
          </Button>
        </div>
      )}
    </div>
  );
};
