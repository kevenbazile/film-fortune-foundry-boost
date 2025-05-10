
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
        fileSizeLimit: 50 * 1024 * 1024, // 50MB limit (reduced from previous 100MB)
      });
      
      if (createError) {
        console.error("Error creating films bucket:", createError);
      } else {
        console.log("Films bucket created successfully");
      }
    }
    
    // Set bucket policy to public (if bucket exists)
    if (filmsExists) {
      try {
        const { error: policyError } = await supabase.storage.updateBucket('films', {
          public: true
        });
        
        if (policyError) {
          console.error("Error updating bucket policy:", policyError);
        } else {
          console.log("Bucket policy updated successfully");
        }
      } catch (err) {
        console.error("Error setting bucket policy:", err);
      }
    }
    
  } catch (error) {
    console.error("Storage initialization error:", error);
  }
};
