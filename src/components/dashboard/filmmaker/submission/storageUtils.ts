
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { getContentType } from "@/integrations/supabase/storage";

// Ensure the films bucket exists
export const ensureBucketExists = async () => {
  try {
    // Check if bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error checking buckets:", error);
      return false;
    }
    
    const filmsExists = buckets.some(bucket => bucket.name === 'movie');
    if (!filmsExists) {
      console.error("Films bucket does not exist");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring bucket exists:", error);
    return false;
  }
};

export const uploadFilesToStorage = async (userId: string, filmId: string, filmFile: File | null, promoFiles: File[]) => {
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
    
    // Check if the films bucket exists
    const bucketExists = await ensureBucketExists();
    if (!bucketExists) {
      toast({
        title: "Storage Error",
        description: "Cannot access storage. Please contact support.",
        variant: "destructive",
      });
      throw new Error("Films bucket does not exist");
    }
    
    // Upload film file if selected
    let filmUrl = "";
    if (filmFile) {
      console.log(`Uploading film file: ${filmFile.name}`);
      const filmFileName = `${userId}/${filmId}/${Date.now()}-${filmFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const contentType = getContentType(filmFile.name);
      
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
      const { data: filmUrlData } = supabase.storage
        .from('movie')
        .getPublicUrl(filmFileName);
      
      filmUrl = filmUrlData.publicUrl;
      console.log(`Film URL: ${filmUrl}`);
    }
    
    // Upload promotional files if any
    const promoUrls: string[] = [];
    let posterUrl = "";
    
    for (const promoFile of promoFiles) {
      console.log(`Uploading promo file: ${promoFile.name}`);
      const promoFileName = `${userId}/${filmId}/promo/${Date.now()}-${promoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const contentType = getContentType(promoFile.name);
      
      const { data: promoData, error: promoError } = await supabase.storage
        .from('movie')
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
      const { data: promoUrlData } = supabase.storage
        .from('movie')
        .getPublicUrl(promoFileName);
      
      const url = promoUrlData.publicUrl;
      promoUrls.push(url);
      
      // Use first promotional image as poster
      if (promoUrls.length === 1) {
        posterUrl = url;
      }
    }
    
    // Update film record with URLs
    if (filmUrl || promoUrls.length > 0) {
      const updateData: any = {};
      
      if (filmUrl) {
        updateData.film_url = filmUrl;
      }
      
      if (promoUrls.length > 0) {
        updateData.poster_url = promoUrls[0]; // Use first promo image as poster
      }
      
      console.log("Updating film record with URLs:", updateData);
      const { error: updateError } = await supabase
        .from('movie')
        .update(updateData)
        .eq('id', filmId);
      
      if (updateError) {
        console.error("Film record update error:", updateError);
        toast({
          title: "Update Warning",
          description: `Failed to update film record: ${updateError.message}`,
        });
      }
    }
    
    console.log("File upload process completed successfully");
    toast({
      title: "Upload Successful",
      description: filmUrl ? "Film and promotional materials uploaded" : "Promotional materials uploaded",
    });
    
    return { filmUrl, promoUrls };
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
