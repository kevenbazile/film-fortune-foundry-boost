
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { submitPayoutRequest, fetchUserPayoutRequests, subscribeToPayoutRequests, PayoutRequest } from "./services/payoutRequestService";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const PayoutRequestForm: React.FC = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [cashappTag, setCashappTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previousRequests, setPreviousRequests] = useState<PayoutRequest[]>([]);

  useEffect(() => {
    if (user) {
      loadUserRequests();
      
      // Set up real-time subscription
      const unsubscribe = subscribeToPayoutRequests((payload) => {
        // Handle real-time updates
        if (payload.eventType === 'INSERT' && payload.new.user_id === user.id) {
          setPreviousRequests(prev => [payload.new as PayoutRequest, ...prev]);
          toast({
            title: "New payout request created",
            description: "Your request has been submitted for processing"
          });
        } else if (payload.eventType === 'UPDATE' && payload.new.user_id === user.id) {
          setPreviousRequests(prev => 
            prev.map(request => request.id === payload.new.id ? payload.new as PayoutRequest : request)
          );
          toast({
            title: "Payout request updated",
            description: `Status changed to: ${payload.new.status}`
          });
        }
      });
      
      return unsubscribe;
    }
  }, [user]);

  const loadUserRequests = async () => {
    const requests = await fetchUserPayoutRequests();
    setPreviousRequests(requests);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !cashappTag) {
      toast({
        title: "Missing information",
        description: "Please provide both email and Cash App tag",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    await submitPayoutRequest(email, cashappTag);
    setIsSubmitting(false);
    
    // Reset form
    setEmail("");
    setCashappTag("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Processing</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Payout</CardTitle>
        <CardDescription>Submit your payment details to request a payout of your earnings</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cashapp">Cash App Tag</Label>
            <Input
              id="cashapp"
              type="text"
              placeholder="$YourCashAppTag"
              value={cashappTag}
              onChange={(e) => setCashappTag(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Request Payout"}
          </Button>
        </form>

        {previousRequests.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Previous Requests</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {previousRequests.map((request) => (
                <div key={request.id} className="p-3 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{request.cashapp_tag}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(request.created_at), 'MMM dd, yyyy')}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PayoutRequestForm;
