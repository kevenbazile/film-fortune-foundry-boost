
import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UploadDropArea from "./UploadDropArea";
import ImagePreviewGrid from "./ImagePreviewGrid";
import { handleFileSelect } from "./fileUploadUtils";

interface CoverArtUploaderProps {
  promoFiles: File[];
  onFilesSelect: (files: File[]) => void;
}

const CoverArtUploader: React.FC<CoverArtUploaderProps> = ({ promoFiles, onFilesSelect }) => {
  const promoFileInputRef = useRef<HTMLInputElement>(null);
  
  const handlePromoFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(
      e, 
      () => {}, // No single file to set
      (files) => onFilesSelect(files),
      true
    );
  };
  
  // Function to handle removing a specific file
  const handleRemoveFile = (index: number) => {
    const newPromoFiles = [...promoFiles];
    newPromoFiles.splice(index, 1);
    onFilesSelect(newPromoFiles);
  };

  return (
    <div className="space-y-4">
      <Label>Upload Cover Art & Promotional Materials</Label>
      
      <UploadDropArea
        title="Upload poster, stills, and promotional images"
        description="Supports JPEG, PNG (max 10MB each)"
        fileTypes="image/jpeg,image/png"
        onClick={() => promoFileInputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const dataTransfer = new DataTransfer();
            
            // Add existing files
            promoFiles.forEach(file => dataTransfer.items.add(file));
            
            // Add new files
            Array.from(e.dataTransfer.files).forEach(file => dataTransfer.items.add(file));
            
            // Create a synthetic event
            const event = {
              target: { files: dataTransfer.files }
            } as React.ChangeEvent<HTMLInputElement>;
            
            handlePromoFilesSelect(event);
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
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
          <div className="text-sm font-medium text-primary mt-2 w-full">
            <p>Selected: {promoFiles.length} file(s)</p>
            <ImagePreviewGrid files={promoFiles} onRemove={handleRemoveFile} />
          </div>
        )}
      </UploadDropArea>
    </div>
  );
};

export default CoverArtUploader;
