
import { supabase } from "./client";

// This function checks if the required buckets exist and creates them if they don't
export const ensureStorageBuckets = async () => {
  try {
    // Check if films bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error checking storage buckets:", error);
      return;
    }
    
    const filmsExists = buckets.some(bucket => bucket.name === 'films');
    
    // Create films bucket if it doesn't exist
    if (!filmsExists) {
      const { error: createError } = await supabase.storage.createBucket('films', {
        public: true,
        fileSizeLimit: 5368709120, // 5GB
        allowedMimeTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-dvi', 
                          'image/jpeg', 'image/png']
      });
      
      if (createError) {
        console.error("Error creating films bucket:", createError);
      }
    }
    
    // Set bucket policy to public
    const { error: policyError } = await supabase.storage.updateBucket('films', {
      public: true
    });
    
    if (policyError) {
      console.error("Error updating bucket policy:", policyError);
    }
    
  } catch (error) {
    console.error("Storage initialization error:", error);
  }
};
