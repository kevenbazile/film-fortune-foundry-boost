
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import UploadDropArea from "./UploadDropArea";
import { handleFileSelect, handleFileDrop } from "./fileSelectUtils";

interface FilmUploaderProps {
  filmFile: File | null;
  onFileSelect: (file: File | null) => void;
}

const FilmUploader: React.FC<FilmUploaderProps> = ({ filmFile, onFileSelect }) => {
  const filmFileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFilmFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(
      e, 
      (file) => onFileSelect(file),
      () => {}, // No array of files to set
      false
    );
  };
  
  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (filmFileInputRef.current) filmFileInputRef.current.value = '';
    onFileSelect(null);
  };
  
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleFileDrop(
      e,
      (file) => onFileSelect(file),
      () => {}, // No array of files to set
      false
    );
  };
  
  return (
    <div className="space-y-4">
      <Label>Upload Film Files</Label>
      
      <UploadDropArea
        title="Drag and drop your film file here, or click to browse"
        description="Supports MP4, MOV, AVI, DVI (max 50MB)"
        fileTypes=".mp4,.mov,.avi,.dvi"
        onClick={() => filmFileInputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
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
              onClick={handleRemoveFile}
            >
              Remove
            </Button>
          </div>
        )}
      </UploadDropArea>
    </div>
  );
};

export default FilmUploader;
