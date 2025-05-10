
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// This function checks if a specific bucket exists
export const ensureBucketExists = async (bucketName: string) => {
  try {
    // Check if bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error(`Error checking bucket for ${bucketName}:`, error);
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      console.error(`${bucketName} bucket does not exist`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error ensuring ${bucketName} bucket exists:`, error);
    return false;
  }
};

// Helper function to determine content type from file extension
export const getContentType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  const videoTypes: Record<string, string> = {
    'mp4': 'video/mp4',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'dvi': 'application/x-dvi'
  };
  
  const imageTypes: Record<string, string> = {
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'png': 'image/png'
  };
  
  return videoTypes[extension] || imageTypes[extension] || 'application/octet-stream';
};
