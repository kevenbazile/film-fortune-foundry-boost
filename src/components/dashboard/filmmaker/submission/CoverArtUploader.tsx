
import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CoverArtUploaderProps {
  promoFiles: File[];
  onFilesSelect: (files: File[]) => void;
}

const CoverArtUploader: React.FC<CoverArtUploaderProps> = ({ promoFiles, onFilesSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: FileList): File[] => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validTypes = ['.jpeg', '.jpg', '.png'];
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
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
    
    return validFiles;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) return;
    
    const validFiles = validateFiles(files);
    
    if (validFiles.length > 0) {
      // Add to existing files
      onFilesSelect([...promoFiles, ...validFiles]);
      
      toast({
        title: "Files Selected",
        description: `Added ${validFiles.length} file(s)`,
      });
    }
  };

  const openFilePicker = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to upload files",
          variant: "destructive",
        });
        return;
      }
      
      // Click the file input
      fileInputRef.current?.click();
    } catch (error) {
      console.error('Auth check failed:', error);
      // Fallback: allow upload anyway for testing
      fileInputRef.current?.click();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { files } = e.dataTransfer;
    
    if (!files || files.length === 0) return;
    
    try {
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
        
        const validFiles = validateFiles(files);
        
        if (validFiles.length > 0) {
          // Add to existing files
          onFilesSelect([...promoFiles, ...validFiles]);
          
          toast({
            title: "Files Added",
            description: `Added ${validFiles.length} file(s)`,
          });
        }
      });
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeFile = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const newPromoFiles = [...promoFiles];
    newPromoFiles.splice(index, 1);
    onFilesSelect(newPromoFiles);
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
                onClick={removeFile(index)}
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
        onClick={openFilePicker}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
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
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            onChange={handleFileSelect}
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

export default CoverArtUploader;
