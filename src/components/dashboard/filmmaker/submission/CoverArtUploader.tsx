
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UploadDropArea from "./UploadDropArea";
import ImagePreviewGrid from "./ImagePreviewGrid";
import { handleFileSelect, handleFileDrop } from "./fileSelectUtils";
import { toast } from "@/components/ui/use-toast";

interface CoverArtUploaderProps {
  promoFiles: File[];
  onFilesSelect: (files: File[]) => void;
}

const CoverArtUploader: React.FC<CoverArtUploaderProps> = ({ promoFiles, onFilesSelect }) => {
  const promoFileInputRef = useRef<HTMLInputElement>(null);
  
  const handlePromoFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      await handleFileSelect(
        e, 
        () => {}, // No single file to set
        (files) => onFilesSelect([...promoFiles, ...files]),
        true
      );
    } catch (error: any) {
      console.error("Promo files selection error:", error);
      toast({
        title: "File Selection Error",
        description: error.message || "Failed to select files",
        variant: "destructive",
      });
    }
  };
  
  // Function to handle removing a specific file
  const handleRemoveFile = (index: number) => {
    const newPromoFiles = [...promoFiles];
    newPromoFiles.splice(index, 1);
    onFilesSelect(newPromoFiles);
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        await handleFileDrop(
          e,
          () => {}, // No single file to set
          (files) => onFilesSelect([...promoFiles, ...files]),
          true
        );
      }
    } catch (error: any) {
      console.error("Promo files drop error:", error);
      toast({
        title: "File Drop Error",
        description: error.message || "Failed to process dropped files",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Label>Upload Cover Art & Promotional Materials</Label>
      
      <UploadDropArea
        title="Upload poster, stills, and promotional images"
        description="Supports JPEG, PNG (max 10MB each)"
        fileTypes="image/jpeg,image/png"
        onClick={() => promoFileInputRef.current?.click()}
        onDrop={onDrop}
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
