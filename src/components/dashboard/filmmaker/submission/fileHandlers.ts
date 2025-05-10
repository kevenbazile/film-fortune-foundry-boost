
import { toast } from "@/components/ui/use-toast";
import { checkAuthentication } from "./authUtils";

// Handler for single file selections
export const handleSingleFileSelect = (
  file: File | null,
  setFile: (file: File | null) => void,
  maxSize: number = 50 * 1024 * 1024, // Default 50MB for videos
  fileType: string = 'video'
): void => {
  if (!file) {
    setFile(null);
    return;
  }
  
  // Check file size
  if (file.size > maxSize) {
    const sizeMB = (maxSize / (1024 * 1024)).toFixed(0);
    toast({
      title: "File Too Large",
      description: `${file.name} exceeds the maximum file size (${sizeMB}MB)`,
      variant: "destructive",
    });
    return;
  }
  
  setFile(file);
  toast({
    title: "File Selected",
    description: `Selected: ${file.name}`,
  });
};

// Handler for multiple file selections
export const handleMultipleFileSelect = (
  files: File[],
  setFiles: (files: File[]) => void,
  maxSize: number = 10 * 1024 * 1024 // Default 10MB for images
): void => {
  if (!files.length) {
    return;
  }
  
  const validFiles: File[] = [];
  const invalidFiles: string[] = [];
  
  for (let i = 0; i < files.length; i++) {
    if (files[i].size > maxSize) {
      invalidFiles.push(`${files[i].name} (exceeds ${maxSize / (1024 * 1024)}MB)`);
    } else {
      validFiles.push(files[i]);
    }
  }
  
  if (invalidFiles.length > 0) {
    toast({
      title: "Some files couldn't be added",
      description: invalidFiles.join(', '),
      variant: "destructive",
    });
  }
  
  if (validFiles.length > 0) {
    setFiles(validFiles);
    toast({
      title: "Files Selected",
      description: `Added ${validFiles.length} file(s)`,
    });
  }
};
