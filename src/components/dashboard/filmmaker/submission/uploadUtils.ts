
import { supabase } from "@/integrations/supabase/client";
import { getContentType } from "./bucketUtils";

// Upload a single file to storage
export const uploadFileToStorage = async (
  bucket: string,
  path: string,
  file: File
): Promise<string | null> => {
  try {
    const contentType = getContentType(file.name);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType
      });
      
    if (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      return null;
    }
    
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
};
