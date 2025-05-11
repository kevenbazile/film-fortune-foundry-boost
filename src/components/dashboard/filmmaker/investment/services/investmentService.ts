
import { supabase } from "@/integrations/supabase/client";
import { Application } from "../types";

export const fetchUserApplications = async (userId: string): Promise<Application[]> => {
  try {
    const { data, error } = await supabase
      .from('community_fund_applications')
      .select('*')
      .eq('user_id', userId)
      .order('submission_date', { ascending: false });
      
    if (error) throw error;
    return data as Application[];
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
};
