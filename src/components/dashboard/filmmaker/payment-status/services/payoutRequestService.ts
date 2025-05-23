
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface PayoutRequest {
  id: string;
  email: string;
  cashapp_tag: string;
  amount: number | null;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  created_at: string;
}

export async function submitPayoutRequest(email: string, cashappTag: string, amount?: number): Promise<boolean> {
  try {
    // Get the current user session to retrieve the user ID
    const { data: sessionData } = await supabase.auth.getSession();
    const user_id = sessionData.session?.user.id;
    
    if (!user_id) {
      throw new Error("User not authenticated");
    }
    
    const { error } = await supabase
      .from('payout_requests')
      .insert({
        user_id,
        email,
        cashapp_tag: cashappTag,
        amount: amount || null
      });

    if (error) throw error;
    
    toast({
      title: "Payout request submitted",
      description: "We'll notify you when your request is processed.",
    });
    
    return true;
  } catch (error) {
    console.error("Error submitting payout request:", error);
    toast({
      title: "Error submitting request",
      description: "Please try again later",
      variant: "destructive"
    });
    return false;
  }
}

export async function fetchUserPayoutRequests(): Promise<PayoutRequest[]> {
  try {
    // Get the current user session to retrieve the user ID
    const { data: sessionData } = await supabase.auth.getSession();
    const user_id = sessionData.session?.user.id;
    
    if (!user_id) {
      console.error("User not authenticated");
      return [];
    }
    
    const { data, error } = await supabase
      .from('payout_requests')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as PayoutRequest[];
  } catch (error) {
    console.error("Error fetching payout requests:", error);
    return [];
  }
}

export function subscribeToPayoutRequests(callback: (payload: any) => void) {
  const channel = supabase
    .channel('payout-requests-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'payout_requests'
      },
      callback
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
}
