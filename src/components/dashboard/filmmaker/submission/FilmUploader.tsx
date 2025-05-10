
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="space-y-4">
      <Label>Upload Film Files</Label>
      
      <div 
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={handleFilmUploadClick}
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
                  filmFileInputRef.current!.value = '';
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
