
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const PayPalSuccessHandler: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const planType = searchParams.get('plan');
    
    const handleSuccess = async () => {
      try {
        // Record subscription success in database via function
        await supabase.functions.invoke('record-subscription-success', {
          body: { 
            source: 'hosted-button',
            planType: planType || 'unknown' 
          }
        });
        
        toast({
          title: "Subscription Successful!",
          description: `Your ${planType || ''} subscription has been activated. Thank you for subscribing!`,
        });
        
        // Navigate to dashboard after success
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (error) {
        console.error('Error recording subscription:', error);
      }
    };
    
    if (success === 'true') {
      console.log(`PayPal subscription success detected for plan: ${planType || 'unknown'}`);
      handleSuccess();
    }
    
    if (canceled === 'true') {
      console.log('PayPal subscription was canceled by user');
      toast({
        variant: "destructive",
        title: "Subscription Cancelled",
        description: "You've canceled the subscription process.",
      });
    }
  }, [location, navigate, toast]);
  
  return null;
};

export default PayPalSuccessHandler;
