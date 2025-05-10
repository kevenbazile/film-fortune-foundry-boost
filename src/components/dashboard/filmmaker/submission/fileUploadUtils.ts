
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { getContentType } from "@/integrations/supabase/storage";

export const handleFileSelect = (
  e: React.ChangeEvent<HTMLInputElement>, 
  setFile: (file: File | null) => void, 
  setFiles: React.Dispatch<React.SetStateAction<File[]>>,
  isMultiple: boolean = false
) => {
  e.preventDefault();
  const files = e.target.files;
  
  if (!files || files.length === 0) {
    if (!isMultiple) {
      setFile(null);
    }
    return;
  }
  
  // Check authentication first
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload files",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size
    const maxSize = isMultiple ? 10 * 1024 * 1024 : 50 * 1024 * 1024; // 10MB for images, 50MB for video
    
    if (isMultiple) {
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > maxSize) {
          invalidFiles.push(`${files[i].name} (exceeds 10MB)`);
        } else {
          validFiles.push(files[i]);
        }
      }
      
      if (invalidFiles.length > 0) {
        toast({
          title: "Some files couldn't be added",
          description: invalidFiles.join(', '),
          variant: "destructive",
        });
      }
      
      if (validFiles.length > 0) {
        setFiles(prevFiles => [...prevFiles, ...validFiles]);
        toast({
          title: "Files Selected",
          description: `Added ${validFiles.length} file(s)`,
        });
      }
    } else {
      if (files[0].size > maxSize) {
        const sizeMB = (maxSize / (1024 * 1024)).toFixed(0);
        toast({
          title: "File Too Large",
          description: `${files[0].name} exceeds the maximum file size (${sizeMB}MB)`,
          variant: "destructive",
        });
        return;
      }
      
      setFile(files[0]);
      toast({
        title: "File Selected",
        description: `Selected: ${files[0].name}`,
      });
    }
  });
};

export const uploadFilesToStorage = async (userId: string, filmId: string, filmFile: File | null, promoFiles: File[]) => {
  try {
    console.log("Starting file upload process...");
    
    // Check authentication first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Authentication required to upload files");
    }
    
    // Check if the films bucket exists and is accessible
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("Error checking storage buckets:", bucketsError);
      throw new Error("Could not access storage buckets");
    }
    
    const filmsExists = buckets.some(bucket => bucket.name === 'films');
    if (!filmsExists) {
      console.log("Films bucket does not exist, creating...");
      const { error: createError } = await supabase.storage.createBucket('films', {
        public: true,
        fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
      });
      
      if (createError) {
        console.error("Error creating films bucket:", createError);
        throw new Error(`Failed to create storage bucket: ${createError.message}`);
      }
    }
    
    // Upload film file if selected
    let filmUrl = "";
    if (filmFile) {
      console.log(`Uploading film file: ${filmFile.name}`);
      const filmFileName = `${userId}/${filmId}/${Date.now()}-${filmFile.name}`;
      const contentType = getContentType(filmFile.name);
      
      const { data: filmData, error: filmError } = await supabase.storage
        .from('films')
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
      const { data: filmUrlData } = await supabase.storage
        .from('films')
        .getPublicUrl(filmFileName);
      
      filmUrl = filmUrlData.publicUrl;
      console.log(`Film URL: ${filmUrl}`);
    }
    
    // Upload promotional files if any
    const promoUrls: string[] = [];
    for (const promoFile of promoFiles) {
      console.log(`Uploading promo file: ${promoFile.name}`);
      const promoFileName = `${userId}/${filmId}/promo/${Date.now()}-${promoFile.name}`;
      const contentType = getContentType(promoFile.name);
      
      const { data: promoData, error: promoError } = await supabase.storage
        .from('films')
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
      const { data: promoUrlData } = await supabase.storage
        .from('films')
        .getPublicUrl(promoFileName);
      
      promoUrls.push(promoUrlData.publicUrl);
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
        .from('films')
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
