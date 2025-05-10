
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Create a film record in the database
export const createFilmRecord = async (
  filmId: string,
  filmTitle: string,
  userId: string,
  filmUrl: string,
  thumbnailUrl: string,
  genres: string[] = []
) => {
  try {
    // Create film record with proper status type
    const filmData = {
      id: filmId,
      title: filmTitle || "Untitled Film",
      user_id: userId,
      director: userId, // Using user_id as director_id as requested
      film_url: filmUrl,
      poster_url: thumbnailUrl,
      status: 'pending' as const, // Explicitly set as literal 'pending' type
      genre: genres, // Array of strings
    };
    
    console.log("Inserting film record:", filmData);
    const { data: filmRecord, error: filmInsertError } = await supabase
      .from('films')
      .insert(filmData)
      .select()
      .single();
    
    if (filmInsertError) {
      console.error("Film record insertion error:", filmInsertError);
      throw filmInsertError;
    }
    
    return filmRecord;
  } catch (error) {
    console.error("Film record creation error:", error);
    throw error;
  }
};

// Add promotional images to film_assets
export const addFilmAssets = async (
  filmId: string,
  promoUrls: string[],
  promoMimeTypes: string[]
) => {
  try {
    // Skip if no promo URLs
    if (promoUrls.length < 1) {
      return;
    }
    
    // Create asset entries starting from the second image (first is used as poster)
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
        throw assetsError;
      }
    }
  } catch (error) {
    console.error("Film assets creation error:", error);
    throw error;
  }
};
