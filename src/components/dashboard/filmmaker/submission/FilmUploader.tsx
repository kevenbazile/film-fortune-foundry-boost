// FilmUploader.tsx - Updated with click fixes
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

  const openFilePicker = async (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('Upload area clicked'); // Debug log
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Check authentication first
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
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Fallback: allow upload anyway for testing
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { files } = e.dataTransfer;
    
    if (!files || files.length === 0) return;
    
    // Check authentication before allowing drop
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to upload files",
          variant: "destructive",
        });
        return;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
    
    const file = files[0];
    
    if (validateFile(file)) {
      // Directly call onFileSelect with the dropped file
      onFileSelect(file);
      
      // Also update the file input for consistency
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeFile = (e: React.MouseEvent<HTMLButtonElement>) => {
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
        style={{ cursor: 'pointer', userSelect: 'none' }}
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
            style={{ display: 'none', position: 'absolute', pointerEvents: 'none' }}
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

// FilmSubmissionPage.tsx - Updated parent component
import React, { useState } from "react";
import FilmUploader from './FilmUploader';
import CoverArtUploader from './CoverArtUploader';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const FilmSubmissionPage = () => {
  const [filmFile, setFilmFile] = useState<File | null>(null);
  const [coverFiles, setCoverFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const handleFileSelect = (file: File | null) => {
    console.log('File selected in parent:', file); // Debug log
    setFilmFile(file);
  };
  
  const handleCoverFilesSelect = (files: File[]) => {
    console.log('Cover files selected:', files); // Debug log
    setCoverFiles(files);
  };

  const handleUpload = async () => {
    if (!filmFile) {
      toast({
        title: "No Film Selected",
        description: "Please select a film file to upload",
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    
    try {
      // Upload film file
      const filmPath = `films/${Date.now()}-${filmFile.name}`;
      const { data: filmData, error: filmError } = await supabase.storage
        .from('films')
        .upload(filmPath, filmFile);
      
      if (filmError) throw filmError;
      
      // Upload cover files
      const coverPaths = [];
      for (const coverFile of coverFiles) {
        const coverPath = `covers/${Date.now()}-${coverFile.name}`;
        const { data: coverData, error: coverError } = await supabase.storage
          .from('covers')
          .upload(coverPath, coverFile);
        
        if (coverError) throw coverError;
        coverPaths.push(coverPath);
      }
      
      console.log('Upload successful:', { film: filmData, covers: coverPaths });
      
      toast({
        title: "Upload Successful",
        description: "Your film and cover art have been uploaded successfully",
      });
      
      // Reset form
      setFilmFile(null);
      setCoverFiles([]);
      
      // Navigate to next step or service selection
      // window.location.href = '/dashboard/services';
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Submit Your Film</h1>
      
      <div className="space-y-8">
        <FilmUploader
          filmFile={filmFile}
          onFileSelect={handleFileSelect}
        />
        
        <CoverArtUploader
          coverFiles={coverFiles}
          onFilesSelect={handleCoverFilesSelect}
        />
        
        {filmFile && (
          <div className="flex justify-end gap-4">
            <Button 
              variant="outline"
              onClick={() => {
                setFilmFile(null);
                setCoverFiles([]);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Film and Continue'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilmSubmissionPage;

// CoverArtUploader.tsx - Updated with same click fixes
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  const openFilePicker = async (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('Cover art upload area clicked'); // Debug log
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Check authentication first
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to upload files",
          variant: "destructive",
        });
        return;
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { files } = e.dataTransfer;
    const fileArray = Array.from(files);
    
    // Check authentication before allowing drop
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to upload files",
          variant: "destructive",
        });
        return;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
    
    const validFiles = fileArray.filter(validateFile);
    
    if (validFiles.length > 0) {
      onFilesSelect(validFiles);
      
      // Update the file input for consistency
      const dataTransfer = new DataTransfer();
      validFiles.forEach(file => dataTransfer.items.add(file));
      
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
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
        style={{ cursor: 'pointer', userSelect: 'none' }}
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
            style={{ display: 'none', position: 'absolute', pointerEvents: 'none' }}
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