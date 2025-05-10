
import { supabase } from "./client";

// This function checks if the required buckets exist and creates them if they don't
export const ensureStorageBuckets = async () => {
  try {
    console.log("Checking storage buckets...");
    // Check if films bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error checking storage buckets:", error);
      return;
    }
    
    const filmsExists = buckets.some(bucket => bucket.name === 'films');
    console.log("Films bucket exists:", filmsExists);
    
    if (!filmsExists) {
      // Create films bucket if it doesn't exist
      console.log("Creating films bucket...");
      const { error: createError } = await supabase.storage.createBucket('films', {
        public: true,
        fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
      });
      
      if (createError) {
        console.error("Error creating films bucket:", createError);
      } else {
        console.log("Films bucket created successfully");
      }
    }
    
    // If bucket exists or was just created, make sure it's publicly accessible
    const { error: updateError } = await supabase.storage.updateBucket('films', {
      public: true,
      fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
    });
    
    if (updateError) {
      console.error("Error updating films bucket:", updateError);
    } else {
      console.log("Films bucket updated to public");
    }
    
    // Test bucket access
    const { data: testAccess, error: testError } = await supabase.storage
      .from('films')
      .list('', { limit: 1 });
    
    if (testError) {
      console.error("Error accessing films bucket:", testError);
    } else {
      console.log("Films bucket accessible, files found:", testAccess ? testAccess.length : 0);
    }
    
  } catch (error) {
    console.error("Storage initialization error:", error);
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
