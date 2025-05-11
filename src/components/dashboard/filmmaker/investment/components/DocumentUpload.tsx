
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DocumentUploadProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DocumentUpload = ({ handleFileChange }: DocumentUploadProps) => {
  return (
    <div>
      <Label htmlFor="additionalDocuments">Additional Documents</Label>
      <Input
        id="additionalDocuments"
        type="file"
        multiple
        onChange={handleFileChange}
        className="mt-1"
        accept=".pdf,.doc,.docx,.jpg,.png"
      />
      <p className="text-xs text-muted-foreground mt-1">
        Upload pitch deck, budget breakdown, team bios, etc.
      </p>
    </div>
  );
};

export default DocumentUpload;
