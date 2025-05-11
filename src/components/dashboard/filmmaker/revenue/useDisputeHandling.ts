
import { useState } from "react";
import { Earning } from "./types";
import { useToast } from "@/components/ui/use-toast";

export function useDisputeHandling(initialEarnings: Earning[]) {
  const [earnings, setEarnings] = useState<Earning[]>(initialEarnings);
  const { toast } = useToast();
  
  const handleDispute = async (earningId: string, reason: string) => {
    try {
      // In a real app, you'd submit the dispute to Supabase
      // For our implementation, we'll just update the local state
      setEarnings(earnings.map(earning => 
        earning.id === earningId 
          ? { ...earning, status: 'disputed' as const } 
          : earning
      ));
      
      toast({
        title: "Dispute Submitted",
        description: "Your payment dispute has been submitted and will be reviewed within 48 hours.",
      });
    } catch (error) {
      console.error("Error submitting dispute:", error);
      toast({
        title: "Error",
        description: "Could not submit dispute. Please try again later.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  return {
    earnings,
    setEarnings,
    handleDispute
  };
}
