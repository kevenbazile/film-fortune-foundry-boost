
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
    
    // If bucket doesn't exist, we'll check if user is authenticated before creating
    if (!filmsExists) {
      // First check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("User must be authenticated to create buckets");
        return;
      }
      
      // Create films bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket('films', {
        public: true,
        fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
      });
      
      if (createError) {
        console.error("Error creating films bucket:", createError);
      } else {
        console.log("Films bucket created successfully");
        
        // Add a public policy to the bucket
        const { error: policyError } = await supabase.storage
          .from('films')
          .createSignedUrls(['test.txt'], 60); // This is just to trigger policy creation
        
        if (policyError && !policyError.message.includes("not found")) {
          console.error("Error setting bucket policy:", policyError);
        }
      }
    }
    
    // If bucket exists, make sure we can access it
    if (filmsExists) {
      // Test bucket access
      const { data: testAccess, error: testError } = await supabase.storage
        .from('films')
        .list('', { limit: 1 });
      
      if (testError) {
        console.error("Error accessing films bucket:", testError);
      } else {
        console.log("Films bucket accessible");
      }
    }
    
  } catch (error) {
    console.error("Storage initialization error:", error);
  }
};
