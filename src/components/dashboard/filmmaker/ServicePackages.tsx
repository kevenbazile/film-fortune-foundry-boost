
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ServicePackageCard from "@/components/ServicePackageCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PayPalSubscribeButton from "@/components/PayPalSubscribeButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info, Loader2 } from "lucide-react";

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

const ServicePackages = () => {
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
    setSelectedPackage(packageId);
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

  const getSelectedPackagePrice = (packageId: string | null) => {
    if (!packageId) return '';
    const pkg = services.find(s => s.id === packageId);
    return pkg ? pkg.price.replace(/[^0-9.]/g, '') : '';
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-3">Choose Your Distribution Package</h2>
        <p className="text-muted-foreground">
          Select the package that best suits your film's distribution goals. Each package offers different levels of exposure and marketing support.
        </p>
      </div>
      
      {checkingSubscription ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Checking subscription status...</span>
        </div>
      ) : (
        <>
          {subscriptionStatus === 'ACTIVE' && (
            <Alert variant="default" className="mb-6 bg-green-50 border-green-200">
              <Info className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                You have an active subscription! You can select any package below with your current subscription.
              </AlertDescription>
            </Alert>
          )}
          
          {subscriptionStatus !== 'ACTIVE' && (
            <Alert variant="default" className="mb-6 bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Subscribe to one of our packages below to access our distribution services.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full h-96 animate-pulse"></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="flex flex-col">
              <ServicePackageCard 
                package={service} 
              />
              <div className="mt-4">
                {selectedPackage === service.id ? (
                  <div className="p-4 border rounded-lg bg-muted">
                    <h4 className="text-sm font-medium mb-3">Complete Monthly Subscription</h4>
                    <PayPalSubscribeButton 
                      onSuccess={handleSubscriptionSuccess}
                      onError={handleSubscriptionError}
                      planPrice={getSelectedPackagePrice(selectedPackage)}
                    />
                    <Button 
                      variant="outline" 
                      className="w-full mt-2" 
                      onClick={() => setSelectedPackage(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="w-full" 
                    variant={service.highlighted ? "default" : "outline"}
                    onClick={() => handleSelectPackage(service.id)}
                    disabled={subscriptionStatus === 'ACTIVE'}
                  >
                    {subscriptionStatus === 'ACTIVE' ? 'Already Subscribed' : `Subscribe to ${service.title}`}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Need a Custom Package?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Have specific distribution needs? We can create a tailored package to match your film's unique requirements.
        </p>
        <Card className="p-4">
          <Button className="w-full" onClick={handleCustomPackageRequest}>Request Custom Package</Button>
        </Card>
      </div>
    </div>
  );
};

export default ServicePackages;
