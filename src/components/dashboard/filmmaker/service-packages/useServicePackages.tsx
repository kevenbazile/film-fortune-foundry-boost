
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  price: string | number;
  description: string;
  features: string[] | any;
  platforms: string[];
  timeline_days: number;
  is_highlighted: boolean;
  commission_rate: number;
}

interface ServicePackage {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  platforms: string[];
  timeline: string;
  highlighted: boolean;
  commission_rate: number;
}

export const useServicePackages = () => {
  const [services, setServices] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('services')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        // Format the data to match what the ServicePackageCard component expects
        const formattedServices: ServicePackage[] = data.map((service: Service) => {
          // Process features array from JSON
          let featuresArray: string[] = [];
          
          if (Array.isArray(service.features)) {
            featuresArray = service.features;
          } else if (typeof service.features === 'object') {
            featuresArray = Object.values(service.features).map(item => String(item));
          } else if (typeof service.features === 'string') {
            try {
              featuresArray = JSON.parse(service.features);
            } catch (e) {
              featuresArray = [String(service.features)];
            }
          }
          
          return {
            id: service.id,
            title: service.name,
            price: `$${service.price}`,
            features: featuresArray,
            platforms: service.platforms,
            timeline: `${service.timeline_days} days`,
            highlighted: service.is_highlighted,
            description: service.description,
            commission_rate: service.commission_rate
          };
        });
        
        setServices(formattedServices);
      } catch (error: any) {
        console.error('Error fetching services:', error);
        toast({
          title: "Error",
          description: "Failed to load service packages",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const checkSubscription = async () => {
      try {
        setCheckingSubscription(true);
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          setCheckingSubscription(false);
          return;
        }
        
        try {
          const { data, error } = await supabase.functions.invoke('check-subscription-status');
          
          if (error) {
            console.error('Error checking subscription:', error);
          } else {
            console.log('Subscription status:', data);
            setSubscriptionStatus(data.status);
          }
        } catch (error) {
          console.error('Error checking subscription status:', error);
        }
      } finally {
        setCheckingSubscription(false);
      }
    };

    fetchServices();
    checkSubscription();
  }, [toast]);

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId === selectedPackage ? null : packageId);
  };

  const handleSubscriptionSuccess = (subscriptionId: string) => {
    toast({
      title: "Success!",
      description: "Your subscription has been activated successfully.",
    });
    setSubscriptionStatus('ACTIVE');
    setSelectedPackage(null);
  };

  const handleSubscriptionError = (error: any) => {
    console.error('Subscription error:', error);
    toast({
      variant: "destructive",
      title: "Subscription Error",
      description: "There was a problem with your subscription. Please try again.",
    });
  };

  const handleCustomPackageRequest = () => {
    toast({
      title: "Request Sent",
      description: "We've received your request for a custom package. Our team will contact you soon.",
    });
  };

  return {
    services,
    loading,
    selectedPackage,
    subscriptionStatus,
    checkingSubscription,
    handleSelectPackage,
    handleSubscriptionSuccess,
    handleSubscriptionError,
    handleCustomPackageRequest
  };
};
