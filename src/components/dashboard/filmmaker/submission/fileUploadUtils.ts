
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { getContentType } from "@/integrations/supabase/storage";
import { checkAuthentication } from "./authUtils";

export const handleFileSelect = (
  e: React.ChangeEvent<HTMLInputElement>, 
  setFile: (file: File | null) => void, 
  setFiles: (files: File[]) => void,
  isMultiple: boolean = false
) => {
  e.preventDefault();
  const files = e.target.files;
  
  if (!files || files.length === 0) {
    if (!isMultiple) {
      setFile(null);
    }
    return;
  }
  
  // Check authentication first
  checkAuthentication().then(isAuthenticated => {
    if (!isAuthenticated) return;
    
    // Check file size
    const maxSize = isMultiple ? 10 * 1024 * 1024 : 50 * 1024 * 1024; // 10MB for images, 50MB for video
    
    if (isMultiple) {
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > maxSize) {
          invalidFiles.push(`${files[i].name} (exceeds 10MB)`);
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
    } else {
      if (files[0].size > maxSize) {
        const sizeMB = (maxSize / (1024 * 1024)).toFixed(0);
        toast({
          title: "File Too Large",
          description: `${files[0].name} exceeds the maximum file size (${sizeMB}MB)`,
          variant: "destructive",
        });
        return;
      }
      
      setFile(files[0]);
      toast({
        title: "File Selected",
        description: `Selected: ${files[0].name}`,
      });
    }
  });
};
