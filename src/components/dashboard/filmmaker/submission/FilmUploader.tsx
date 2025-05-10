
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FilmUploaderProps {
  filmFile: File | null;
  filmFileInputRef: React.RefObject<HTMLInputElement>;
  handleFilmFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilmUploadClick: (e: React.MouseEvent) => void;
}

const FilmUploader = ({
  filmFile,
  filmFileInputRef,
  handleFilmFileSelect,
  handleFilmUploadClick
}: FilmUploaderProps) => {
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
      
      const file = files[0];
      const maxSize = 50 * 1024 * 1024; // 50MB
      
      // Check file size
      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds the maximum file size (50MB)`,
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      const validTypes = ['.mp4', '.mov', '.avi', '.dvi'];
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!validTypes.includes(extension)) {
        toast({
          title: "Invalid File Type",
          description: `Only ${validTypes.join(', ')} files are supported`,
          variant: "destructive",
        });
        return;
      }
      
      // Create a new file input event to reuse existing handler
      if (filmFileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        filmFileInputRef.current.files = dataTransfer.files;
        const event = new Event('change', { bubbles: true });
        filmFileInputRef.current.dispatchEvent(event);
        
        // Call the handler directly with a mock event
        handleFilmFileSelect({ target: { files: dataTransfer.files } } as any);
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
      if (filmFileInputRef.current) {
        filmFileInputRef.current.click();
      }
    });
  };
  
  return (
    <div className="space-y-4">
      <Label>Upload Film Files</Label>
      
      <div 
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onClickArea}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag and drop your film file here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supports MP4, MOV, AVI, DVI (max 50MB)
          </p>
          <Input 
            ref={filmFileInputRef}
            id="filmUpload" 
            type="file" 
            className="hidden" 
            onChange={handleFilmFileSelect}
            accept=".mp4,.mov,.avi,.dvi"
          />
          {filmFile && (
            <div className="mt-2">
              <p className="text-sm font-medium text-primary">
                Selected: {filmFile.name} ({(filmFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  if (filmFileInputRef.current) filmFileInputRef.current.value = '';
                  handleFilmFileSelect({ target: { files: null } } as any);
                }}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilmUploader;
