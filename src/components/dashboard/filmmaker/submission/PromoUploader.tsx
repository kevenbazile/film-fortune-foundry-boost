
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import UploadDropArea from "./UploadDropArea";
import ImagePreviewGrid from "./ImagePreviewGrid";
import { checkAuthentication } from "./authUtils";

interface PromoUploaderProps {
  promoFiles: File[];
  promoFileInputRef: React.RefObject<HTMLInputElement>;
  handlePromoFilesSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePromoUploadClick: (e: React.MouseEvent) => void;
}

const PromoUploader: React.FC<PromoUploaderProps> = ({
  promoFiles,
  promoFileInputRef,
  handlePromoFilesSelect,
  handlePromoUploadClick
}) => {
  // Function to handle removing a specific file
  const handleRemoveFile = (index: number) => {
    const newPromoFiles = [...promoFiles];
    newPromoFiles.splice(index, 1);
    
    // Create a new DataTransfer object
    const dataTransfer = new DataTransfer();
    
    // Add the remaining files to the DataTransfer object
    newPromoFiles.forEach(file => {
      dataTransfer.items.add(file);
    });
    
    // Update the input's files
    if (promoFileInputRef.current) {
      promoFileInputRef.current.files = dataTransfer.files;
    }
    
    // Trigger the onChange event
    handlePromoFilesSelect({ target: { files: dataTransfer.files } } as any);
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { files } = e.dataTransfer;
    
    if (!files || files.length === 0) return;
    
    // Check authentication first
    const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated) return;
    
    // Check files
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validTypes = ['.jpeg', '.jpg', '.png'];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (file.size > maxSize) {
        invalidFiles.push(`${file.name} (exceeds 10MB)`);
        continue;
      }
      
      if (!validTypes.includes(extension)) {
        invalidFiles.push(`${file.name} (invalid type)`);
        continue;
      }
      
      validFiles.push(file);
    }
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Some files couldn't be added",
        description: invalidFiles.join(', '),
        variant: "destructive",
      });
    }
    
    if (validFiles.length > 0) {
      // Create a new file input event
      if (promoFileInputRef.current) {
        const dataTransfer = new DataTransfer();
        
        // Add existing files first
        if (promoFiles.length > 0) {
          promoFiles.forEach(file => {
            dataTransfer.items.add(file);
          });
        }
        
        // Add new valid files
        validFiles.forEach(file => {
          dataTransfer.items.add(file);
        });
        
        promoFileInputRef.current.files = dataTransfer.files;
        const event = new Event('change', { bubbles: true });
        promoFileInputRef.current.dispatchEvent(event);
        
        // Call the handler directly
        handlePromoFilesSelect({ target: { files: dataTransfer.files } } as any);
        
        toast({
          title: "Files Added",
          description: `Added ${validFiles.length} file(s)`,
        });
      }
    }
  };
  
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const onClickArea = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is authenticated before allowing upload
    const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated) return;
    
    // Directly trigger the file input click
    if (promoFileInputRef.current) {
      promoFileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <Label>Upload Cover Art & Promotional Materials</Label>
      
      <UploadDropArea
        title="Upload poster, stills, and promotional images"
        description="Supports JPEG, PNG (max 10MB each)"
        fileTypes="image/jpeg,image/png"
        onClick={onClickArea}
        onDrop={onDrop}
        onDragOver={onDragOver}
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

export default PromoUploader;
