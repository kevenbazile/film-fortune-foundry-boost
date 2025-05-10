
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { getContentType } from "@/integrations/supabase/storage";

// Ensure the required buckets exist
export const ensureBucketExists = async (bucketName: string) => {
  try {
    // Check if bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error(`Error checking buckets for ${bucketName}:`, error);
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
      const contentType = getContentType(filmFile.name);
      
      // Use lowercase 'movie' bucket
      const { data: filmData, error: filmError } = await supabase.storage
        .from('movie')
        .upload(filmFileName, filmFile, {
          cacheControl: '3600',
          upsert: true,
          contentType
        });
      
      if (filmError) {
        console.error("Film upload error:", filmError);
        toast({
          title: "Upload Failed",
          description: `Failed to upload film: ${filmError.message}`,
          variant: "destructive",
        });
        throw filmError;
      }
      
      console.log("Film uploaded successfully, getting public URL");
      // Use lowercase 'movie' bucket
      const { data: filmUrlData } = supabase.storage
        .from('movie')
        .getPublicUrl(filmFileName);
      
      filmUrl = filmUrlData.publicUrl;
      console.log(`Film URL: ${filmUrl}`);
    }
    
    // Upload promotional files if any
    const promoUrls: string[] = [];
    const promoMimeTypes: string[] = [];
    let thumbnailUrl = "";
    
    for (const promoFile of promoFiles) {
      console.log(`Uploading promo file: ${promoFile.name}`);
      const promoFileName = `${userId}/${filmId}/${Date.now()}-${promoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const contentType = getContentType(promoFile.name);
      
      // Use lowercase 'covers' bucket
      const { data: promoData, error: promoError } = await supabase.storage
        .from('covers')
        .upload(promoFileName, promoFile, {
          cacheControl: '3600',
          upsert: true,
          contentType
        });
      
      if (promoError) {
        console.error("Promo file upload error:", promoError);
        toast({
          title: "Upload Warning",
          description: `Failed to upload promotional file: ${promoError.message}`,
          variant: "destructive",
        });
        continue; // Continue with other files even if one fails
      }
      
      console.log("Promo file uploaded successfully, getting public URL");
      // Use lowercase 'covers' bucket
      const { data: promoUrlData } = supabase.storage
        .from('covers')
        .getPublicUrl(promoFileName);
      
      const url = promoUrlData.publicUrl;
      promoUrls.push(url);
      promoMimeTypes.push(contentType);
      
      // Use first promotional image as thumbnail
      if (promoUrls.length === 1) {
        thumbnailUrl = url;
      }
    }
    
    // Insert into films table
    if (filmUrl || promoUrls.length > 0) {
      // Create film record with proper status type
      const filmData = {
        id: filmId,
        title: filmTitle || "Untitled Film",
        user_id: userId,
        director: userId, // Using user_id as director_id as requested
        film_url: filmUrl,
        poster_url: thumbnailUrl,
        status: 'pending' as const, // Explicitly set as literal 'pending' type
        genre: [] as string[], // Explicit empty array of strings
      };
      
      console.log("Inserting film record:", filmData);
      const { data: filmRecord, error: filmInsertError } = await supabase
        .from('films')
        .insert(filmData)
        .select()
        .single();
      
      if (filmInsertError) {
        console.error("Film record insertion error:", filmInsertError);
        toast({
          title: "Database Error",
          description: `Failed to save film record: ${filmInsertError.message}`,
          variant: "destructive",
        });
        throw filmInsertError;
      }
      
      // Insert additional cover images into film_assets
      if (promoUrls.length > 1) {
        const assetInserts = promoUrls.slice(1).map((url, index) => ({
          film_id: filmId,
          asset_type: 'image',
          asset_url: url,
          mime_type: promoMimeTypes[index + 1] || 'image/jpeg'
        }));
        
        if (assetInserts.length > 0) {
          console.log("Inserting additional cover images:", assetInserts);
          const { error: assetsError } = await supabase
            .from('film_assets')
            .insert(assetInserts);
            
          if (assetsError) {
            console.error("Film assets insertion error:", assetsError);
            toast({
              title: "Warning",
              description: `Some promotional images may not be properly linked: ${assetsError.message}`,
              variant: "destructive",
            });
            // Continue despite error - main film record is saved
          }
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
