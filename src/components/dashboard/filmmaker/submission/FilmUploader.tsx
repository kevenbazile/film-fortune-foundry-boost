
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import UploadDropArea from "./UploadDropArea";
import { handleFileSelect, handleFileDrop } from "./fileSelectUtils";
import { toast } from "@/components/ui/use-toast";

interface FilmUploaderProps {
  filmFile: File | null;
  onFileSelect: (file: File | null) => void;
}

const FilmUploader: React.FC<FilmUploaderProps> = ({ filmFile, onFileSelect }) => {
  const filmFileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFilmFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      await handleFileSelect(
        e, 
        (file) => onFileSelect(file),
        () => {}, // No array of files to set
        false
      );
    } catch (error: any) {
      console.error("Film selection error:", error);
      toast({
        title: "File Selection Error",
        description: error.message || "Failed to select file",
        variant: "destructive",
      });
    }
  };
  
  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (filmFileInputRef.current) filmFileInputRef.current.value = '';
    onFileSelect(null);
  };
  
  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    try {
      await handleFileDrop(
        e,
        (file) => onFileSelect(file),
        () => {}, // No array of files to set
        false
      );
    } catch (error: any) {
      console.error("Film drop error:", error);
      toast({
        title: "File Drop Error",
        description: error.message || "Failed to process dropped file",
        variant: "destructive",
      });
    }
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
