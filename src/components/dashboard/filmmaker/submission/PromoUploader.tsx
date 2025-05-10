
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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
  // Function to handle removing a specific file
  const handleRemoveFile = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
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

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { files } = e.dataTransfer;
    
    if (!files || files.length === 0) return;
    
    // Check authentication first
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to upload files",
          variant: "destructive",
        });
        return;
      }
      
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
    });
  };
  
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const onClickArea = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is authenticated before allowing upload
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to upload files",
          variant: "destructive",
        });
        return;
      }
      
      // Directly trigger the file input click
      if (promoFileInputRef.current) {
        promoFileInputRef.current.click();
      }
    });
  };

  // Function to create image preview URLs
  const renderImagePreviews = () => {
    if (promoFiles.length === 0) return null;
    
    return (
      <div className="grid grid-cols-2 gap-2 mt-4">
        {promoFiles.map((file, index) => (
          <div 
            key={index} 
            className="relative rounded-md overflow-hidden border border-border h-24"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-background/30">
              <Image className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="absolute top-0 right-0 p-1">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-5 w-5 rounded-full"
                onClick={(e) => handleRemoveFile(e, index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-background/70 p-1 text-xs truncate">
              {file.name.substring(0, 20)}{file.name.length > 20 ? '...' : ''}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Label>Upload Cover Art & Promotional Materials</Label>
      
      <div 
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onClickArea}
        onDrop={onDrop}
        onDragOver={onDragOver}
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
            <div className="text-sm font-medium text-primary mt-2 w-full">
              <p>Selected: {promoFiles.length} file(s)</p>
              {renderImagePreviews()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromoUploader;
