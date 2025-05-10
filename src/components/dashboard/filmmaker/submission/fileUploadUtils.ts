
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const handleFileSelect = (
  e: React.ChangeEvent<HTMLInputElement>, 
  setFile: (file: File | null) => void, 
  setFiles: (files: File[]) => void,
  isMultiple: boolean = false
) => {
  e.preventDefault();
  const files = e.target.files;
  
  if (!files || files.length === 0) return;
  
  if (isMultiple) {
    const newFiles = Array.from(files);
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    toast({
      title: "Files Selected",
      description: `Added ${files.length} file(s)`,
    });
  } else {
    setFile(files[0]);
    toast({
      title: "File Selected",
      description: `Selected: ${files[0].name}`,
    });
  }
};

export const uploadFilesToStorage = async (userId: string, filmId: string, filmFile: File | null, promoFiles: File[]) => {
  try {
    // Upload film file if selected
    let filmUrl = "";
    if (filmFile) {
      const filmFileName = `${userId}/${filmId}/${Date.now()}-${filmFile.name}`;
      const { data: filmData, error: filmError } = await supabase.storage
        .from('films')
        .upload(filmFileName, filmFile);
      
      if (filmError) throw filmError;
      
      const { data: filmUrlData } = await supabase.storage
        .from('films')
        .getPublicUrl(filmFileName);
      
      filmUrl = filmUrlData.publicUrl;
    }
    
    // Upload promotional files if any
    const promoUrls: string[] = [];
    for (const promoFile of promoFiles) {
      const promoFileName = `${userId}/${filmId}/promo/${Date.now()}-${promoFile.name}`;
      const { data: promoData, error: promoError } = await supabase.storage
        .from('films')
        .upload(promoFileName, promoFile);
      
      if (promoError) throw promoError;
      
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
      
      const { error: updateError } = await supabase
        .from('films')
        .update(updateData)
        .eq('id', filmId);
      
      if (updateError) throw updateError;
    }
    
    return { filmUrl, promoUrls };
  } catch (error: any) {
    console.error("File upload error:", error);
    throw new Error("Failed to upload files");
  }
};
