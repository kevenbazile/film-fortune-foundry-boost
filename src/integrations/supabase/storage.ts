
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
    
    // If bucket doesn't exist, we'll check if user is authenticated before creating
    if (!filmsExists) {
      // First check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("User must be authenticated to create buckets");
        return;
      }
      
      console.log("Creating films bucket...");
      // Create films bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket('films', {
        public: true,
        fileSizeLimit: 20 * 1024 * 1024, // Reduced to 20MB limit for better compatibility
      });
      
      if (createError) {
        console.error("Error creating films bucket:", createError);
      } else {
        console.log("Films bucket created successfully");
      }
    }
    
    // If bucket exists or was just created, make sure it's publicly accessible
    if (filmsExists || !error) {
      console.log("Setting bucket to public...");
      // Update bucket to be public if it exists
      const { error: updateError } = await supabase.storage.updateBucket('films', {
        public: true,
        fileSizeLimit: 20 * 1024 * 1024, // 20MB limit
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
    }
    
  } catch (error) {
    console.error("Storage initialization error:", error);
  }
};
