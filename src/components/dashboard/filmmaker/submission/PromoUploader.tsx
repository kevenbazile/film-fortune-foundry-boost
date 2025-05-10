
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface PromoUploaderProps {
  promoFiles: File[];
  promoFileInputRef: React.RefObject<HTMLInputElement>;
  handlePromoFilesSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePromoUploadClick: (e: React.MouseEvent) => void;
}

const PromoUploader = ({
  promoFiles,
  promoFileInputRef,
  handlePromoFilesSelect,
  handlePromoUploadClick
}: PromoUploaderProps) => {
  return (
    <div className="space-y-4">
      <Label>Upload Cover Art & Promotional Materials</Label>
      
      <div 
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={handlePromoUploadClick}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Upload poster, stills, and promotional images
          </p>
          <p className="text-xs text-muted-foreground">
            Supports JPEG, PNG (max 10MB each)
          </p>
          <Input 
            ref={promoFileInputRef}
            id="promoUpload" 
            type="file" 
            className="hidden" 
            onChange={handlePromoFilesSelect}
            accept="image/jpeg,image/png" 
            multiple 
          />
          {promoFiles.length > 0 && (
            <p className="text-sm font-medium text-primary">
              Selected: {promoFiles.length} file(s)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromoUploader;
