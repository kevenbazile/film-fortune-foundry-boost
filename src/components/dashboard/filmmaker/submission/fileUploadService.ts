
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ensureBucketExists } from "./bucketUtils";
import { uploadFileToStorage } from "./uploadUtils";
import { createFilmRecord, addFilmAssets } from "./filmDatabase";
import { ensureStorageBuckets } from "@/integrations/supabase/storage";

export const uploadFilesToStorage = async (userId: string, filmFile: File | null, promoFiles: File[]) => {
  try {
    console.log("Starting file upload process...");
    
    // Check authentication first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to upload files",
        variant: "destructive",
      });
      throw new Error("Authentication required to upload files");
    }
    
    // Ensure storage buckets exist before uploading
    await ensureStorageBuckets();
    
    // Check if the movie bucket exists - use lowercase 'movie'
    const movieBucketExists = await ensureBucketExists('movie');
    if (!movieBucketExists) {
      toast({
        title: "Storage Error",
        description: "Cannot access movie storage. Please contact support.",
        variant: "destructive",
      });
      throw new Error("Movie bucket does not exist");
    }
    
    // Check if the covers bucket exists - use lowercase 'covers'
    const coversBucketExists = await ensureBucketExists('covers');
    if (!coversBucketExists) {
      toast({
        title: "Storage Error",
        description: "Cannot access covers storage. Please contact support.",
        variant: "destructive",
      });
      throw new Error("Covers bucket does not exist");
    }
    
    // Generate a unique film ID
    const filmId = crypto.randomUUID();
    
    // Upload film file if selected
    let filmUrl = "";
    let filmTitle = "";
    if (filmFile) {
      console.log(`Uploading film file: ${filmFile.name}`);
      // Extract title from filename (without extension)
      filmTitle = filmFile.name.split('.').slice(0, -1).join('.');
      const filmFileName = `${userId}/${filmId}/${Date.now()}-${filmFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      filmUrl = await uploadFileToStorage('movie', filmFileName, filmFile) || "";
      
      if (!filmUrl) {
        throw new Error("Failed to upload film file");
      }
      
      console.log(`Film URL: ${filmUrl}`);
    }
    
    // Upload promotional files if any
    const promoUrls: string[] = [];
    const promoMimeTypes: string[] = [];
    let thumbnailUrl = "";
    
    for (const promoFile of promoFiles) {
      console.log(`Uploading promo file: ${promoFile.name}`);
      const promoFileName = `${userId}/${filmId}/${Date.now()}-${promoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const contentType = promoFile.type || 'image/jpeg';
      promoMimeTypes.push(contentType);
      
      const promoUrl = await uploadFileToStorage('covers', promoFileName, promoFile);
      
      if (!promoUrl) {
        console.error(`Failed to upload promo file: ${promoFile.name}`);
        toast({
          title: "Upload Warning",
          description: `Failed to upload promotional file: ${promoFile.name}`,
          variant: "destructive",
        });
        continue; // Continue with other files even if one fails
      }
      
      promoUrls.push(promoUrl);
      
      // Use first promotional image as thumbnail
      if (promoUrls.length === 1) {
        thumbnailUrl = promoUrl;
      }
    }
    
    // Insert into films table
    if (filmUrl || promoUrls.length > 0) {
      // Create film record
      const filmRecord = await createFilmRecord(
        filmId, 
        filmTitle, 
        userId, 
        filmUrl, 
        thumbnailUrl,
        []  // Empty genres array
      );
      
      // Insert additional cover images into film_assets
      if (promoUrls.length > 1) {
        try {
          await addFilmAssets(filmId, promoUrls, promoMimeTypes);
        } catch (assetsError) {
          toast({
            title: "Warning",
            description: "Some promotional images may not be properly linked",
            variant: "destructive",
          });
          // Continue despite error - main film record is saved
        }
      }
    }
    
    console.log("File upload process completed successfully");
    toast({
      title: "Upload Successful",
      description: filmUrl ? "Film and promotional materials uploaded" : "Promotional materials uploaded",
    });
    
    return { filmId, filmUrl, thumbnailUrl, promoUrls };
  } catch (error: any) {
    console.error("File upload error:", error);
    toast({
      title: "Upload Failed",
      description: error.message || "Failed to upload files",
      variant: "destructive",
    });
    throw new Error("Failed to upload files");
  }
};
