
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
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

  const onUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated before allowing upload
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to upload files",
          variant: "destructive",
        });
        return;
      }
      
      // Directly trigger the file input click if authorized
      if (promoFileInputRef.current) {
        promoFileInputRef.current.click();
      }
    };
    
    checkAuth();
  };

  return (
    <div className="space-y-4">
      <Label>Upload Cover Art & Promotional Materials</Label>
      
      <div 
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onUploadClick}
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
              <ul className="mt-2 text-xs max-h-32 overflow-auto w-full">
                {promoFiles.map((file, index) => (
                  <li key={index} className="flex justify-between items-center py-1 border-b">
                    <span>{file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => handleRemoveFile(e, index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromoUploader;
