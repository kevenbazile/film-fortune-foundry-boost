
import { supabase } from "./client";

// This function checks if the required buckets exist and creates them if they don't
export const ensureStorageBuckets = async () => {
  try {
    console.log("Checking storage buckets...");
    
    // First check if buckets exist
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error checking storage buckets:", error);
      return;
    }
    
    // Check if movie bucket exists
    const movieExists = buckets.some(bucket => bucket.name === 'movie');
    console.log("Movie bucket exists:", movieExists);
    
    if (!movieExists) {
      // Create movie bucket if it doesn't exist
      console.log("Creating movie bucket...");
      const { error: createError } = await supabase.storage.createBucket('movie', {
        public: true,
        fileSizeLimit: 100 * 1024 * 1024, // 100MB limit
      });
      
      if (createError) {
        console.error("Error creating movie bucket:", createError);
      } else {
        console.log("Movie bucket created successfully");
      }
    } else {
      // Update existing movie bucket to ensure it's public
      const { error: updateError } = await supabase.storage.updateBucket('movie', {
        public: true,
        fileSizeLimit: 100 * 1024 * 1024, // 100MB limit
      });
      
      if (updateError) {
        console.error("Error updating movie bucket:", updateError);
      } else {
        console.log("Movie bucket updated to public with 100MB limit");
      }
    }
    
    // Check if covers bucket exists
    const coversExists = buckets.some(bucket => bucket.name === 'covers');
    console.log("Covers bucket exists:", coversExists);
    
    if (!coversExists) {
      // Create covers bucket if it doesn't exist
      console.log("Creating covers bucket...");
      const { error: createError } = await supabase.storage.createBucket('covers', {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024, // 10MB limit for images
      });
      
      if (createError) {
        console.error("Error creating covers bucket:", createError);
      } else {
        console.log("Covers bucket created successfully");
      }
    } else {
      // Update existing covers bucket to ensure it's public
      const { error: coversUpdateError } = await supabase.storage.updateBucket('covers', {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024, // 10MB limit
      });
      
      if (coversUpdateError) {
        console.error("Error updating covers bucket:", coversUpdateError);
      } else {
        console.log("Covers bucket updated to public with 10MB limit");
      }
    }
    
    // Trigger a manual check after creation to confirm buckets exist
    setTimeout(async () => {
      const { data: checkBuckets, error: checkError } = await supabase.storage.listBuckets();
      
      if (checkError) {
        console.error("Error checking buckets after creation:", checkError);
        return;
      }
      
      console.log("Available buckets after creation:", 
        checkBuckets.map(b => `${b.name} (public: ${b.public})`).join(', '));
    }, 1000);
    
  } catch (error) {
    console.error("Storage initialization error:", error);
  }
};

// Export getContentType from bucketUtils for backward compatibility
export { getContentType } from "@/components/dashboard/filmmaker/submission/bucketUtils";
export { uploadFileToStorage } from "@/components/dashboard/filmmaker/submission/uploadUtils";
