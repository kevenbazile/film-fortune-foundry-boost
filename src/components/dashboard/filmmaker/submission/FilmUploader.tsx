// FilmUploader.tsx - Fixed version
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FilmUploaderProps {
  filmFile: File | null;
  onFileSelect: (file: File | null) => void;
}

const FilmUploader: React.FC<FilmUploaderProps> = ({ filmFile, onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    // Check file size
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: `${file.name} exceeds the maximum file size (50MB)`,
        variant: "destructive",
      });
      return false;
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
      return false;
    }
    
    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed:', e.target.files); // Debug log
    const file = e.target.files?.[0] || null;
    
    if (file && validateFile(file)) {
      onFileSelect(file);
    } else if (!file) {
      onFileSelect(null);
    }
  };

  const openFilePicker = async (e: React.MouseEvent) => {
    console.log('Upload area clicked'); // Debug log
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
      console.log('Opening file picker'); // Debug log
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
    
    const file = files[0];
    
    if (validateFile(file)) {
      // Simulate file input change
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        handleFileSelect({ target: { files: dataTransfer.files } } as any);
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
  };
  
  return (
    <div className="space-y-4">
      <Label>Upload Film Files</Label>
      
      <div 
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={openFilePicker}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{ cursor: 'pointer' }}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag and drop your film file here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supports MP4, MOV, AVI, DVI (max 50MB)
          </p>
          
          {/* Hidden file input */}
          <input 
            ref={fileInputRef}
            type="file" 
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            accept=".mp4,.mov,.avi,.dvi"
          />
          
          {filmFile && (
            <div className="mt-4 p-4 bg-green-50 rounded-md">
              <p className="text-sm font-medium text-green-700">
                Selected: {filmFile.name} ({(filmFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="mt-2"
                onClick={removeFile}
              >
                <X className="h-4 w-4 mr-1" />
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

// FilmSubmissionPage.tsx - Parent component
import React, { useState } from "react";
import FilmUploader from './FilmUploader';

const FilmSubmissionPage = () => {
  const [filmFile, setFilmFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const handleFileSelect = (file: File | null) => {
    console.log('File selected in parent:', file); // Debug log
    setFilmFile(file);
  };

  const handleUpload = async () => {
    if (!filmFile) return;
    
    setUploading(true);
    
    try {
      // TODO: Implement actual upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('films')
        .upload(`films/${Date.now()}-${filmFile.name}`, filmFile);
      
      if (error) throw error;
      
      console.log('Upload successful:', data);
      // Navigate to next step or show success message
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Submit Your Film</h1>
      
      <FilmUploader
        filmFile={filmFile}
        onFileSelect={handleFileSelect}
      />
      
      {filmFile && (
        <div className="mt-6">
          <Button 
            onClick={handleUpload}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? 'Uploading...' : 'Upload Film'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilmSubmissionPage;

// CoverArtUploader.tsx - Similar component for cover art
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface CoverArtUploaderProps {
  coverFiles: File[];
  onFilesSelect: (files: File[]) => void;
}

const CoverArtUploader: React.FC<CoverArtUploaderProps> = ({ coverFiles, onFilesSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    // Check file size
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: `${file.name} exceeds the maximum file size (10MB)`,
        variant: "destructive",
      });
      return false;
    }
    
    // Check file type
    const validTypes = ['.jpg', '.jpeg', '.png'];
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(extension)) {
      toast({
        title: "Invalid File Type",
        description: `Only ${validTypes.join(', ')} files are supported`,
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(validateFile);
    onFilesSelect(validFiles);
  };

  const openFilePicker = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { files } = e.dataTransfer;
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(validateFile);
    
    if (validFiles.length > 0) {
      const dataTransfer = new DataTransfer();
      validFiles.forEach(file => dataTransfer.items.add(file));
      
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        handleFileSelect({ target: { files: dataTransfer.files } } as any);
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeFile = (index: number) => {
    const newFiles = [...coverFiles];
    newFiles.splice(index, 1);
    onFilesSelect(newFiles);
  };
  
  return (
    <div className="space-y-4">
      <Label>Upload Cover Art & Promotional Materials</Label>
      
      <div 
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={openFilePicker}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Upload poster, stills, and promotional images
          </p>
          <p className="text-xs text-muted-foreground">
            Supports JPEG, PNG (max 10MB each)
          </p>
          
          <input 
            ref={fileInputRef}
            type="file" 
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            accept=".jpg,.jpeg,.png"
            multiple
          />
          
          {coverFiles.length > 0 && (
            <div className="mt-4 w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {coverFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-32 object-cover rounded"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <p className="text-xs text-center mt-1 truncate">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverArtUploader;