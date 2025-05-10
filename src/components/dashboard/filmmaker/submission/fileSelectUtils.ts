
import { checkAuthentication } from "./authUtils";
import { handleSingleFileSelect, handleMultipleFileSelect } from "./fileHandlers";
import { toast } from "@/components/ui/use-toast";

// Main entry point for file selection handling
export const handleFileSelect = async (
  e: React.ChangeEvent<HTMLInputElement>, 
  setFile: (file: File | null) => void, 
  setFiles: (files: File[]) => void,
  isMultiple: boolean = false
): Promise<void> => {
  e.preventDefault();
  const files = e.target.files;
  
  if (!files || files.length === 0) {
    if (!isMultiple) {
      setFile(null);
    }
    return;
  }
  
  // Check authentication first
  const isAuthenticated = await checkAuthentication();
  if (!isAuthenticated) {
    toast({
      title: "Authentication Required",
      description: "Please log in to upload files",
      variant: "destructive",
    });
    return;
  }
  
  // Handle single or multiple file selection
  if (isMultiple) {
    // For multiple files (images)
    const fileArray = Array.from(files);
    handleMultipleFileSelect(fileArray, setFiles);
  } else {
    // For single file (video)
    handleSingleFileSelect(files[0], setFile, undefined, 'video');
  }
};

// Handle drag and drop file selection
export const handleFileDrop = async (
  e: React.DragEvent<HTMLDivElement>,
  setFile: (file: File | null) => void,
  setFiles: (files: File[]) => void,
  isMultiple: boolean = false
): Promise<void> => {
  e.preventDefault();
  e.stopPropagation();
  
  if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) {
    return;
  }
  
  // Check authentication first
  const isAuthenticated = await checkAuthentication();
  if (!isAuthenticated) {
    toast({
      title: "Authentication Required",
      description: "Please log in to upload files",
      variant: "destructive",
    });
    return;
  }
  
  if (isMultiple) {
    // For multiple files (images)
    const fileArray = Array.from(e.dataTransfer.files);
    handleMultipleFileSelect(fileArray, setFiles);
  } else {
    // For single file (video)
    handleSingleFileSelect(e.dataTransfer.files[0], setFile, undefined, 'video');
  }
};
