
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const checkAuthentication = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    toast({
      title: "Authentication Required",
      description: "Please log in to upload files",
      variant: "destructive",
    });
    return false;
  }
  
  return true;
};
