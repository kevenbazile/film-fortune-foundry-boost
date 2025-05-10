
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
  
  // Check file type - let's validate the file extension
  if (fileType === 'video') {
    const validExtensions = ['.mp4', '.mov', '.avi', '.dvi'];
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validExtensions.includes(extension)) {
      toast({
        title: "Invalid File Type",
        description: `${file.name} is not a supported video format. Please use MP4, MOV, AVI, or DVI.`,
        variant: "destructive",
      });
      return;
    }
  } else if (fileType === 'image') {
    const validExtensions = ['.jpg', '.jpeg', '.png'];
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validExtensions.includes(extension)) {
      toast({
        title: "Invalid File Type",
        description: `${file.name} is not a supported image format. Please use JPG, JPEG, or PNG.`,
        variant: "destructive",
      });
      return;
    }
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
    const file = files[i];
    // Check file size
    if (file.size > maxSize) {
      invalidFiles.push(`${file.name} (exceeds ${maxSize / (1024 * 1024)}MB)`);
      continue;
    }
    
    // Check file type
    const validExtensions = ['.jpg', '.jpeg', '.png'];
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validExtensions.includes(extension)) {
      invalidFiles.push(`${file.name} (invalid format)`);
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
    setFiles(validFiles);
    toast({
      title: "Files Selected",
      description: `Added ${validFiles.length} file(s)`,
    });
  }
};
