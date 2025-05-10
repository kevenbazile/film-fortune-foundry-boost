
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ServicePackageCard from "@/components/ServicePackageCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Service {
  id: string;
  name: string;
  price: string | number;
  description: string;
  features: string[];
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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        // Format the data to match what the ServicePackageCard component expects
        const formattedServices: ServicePackage[] = data.map(service => ({
          id: service.id,
          title: service.name,
          price: `$${service.price}`,
          features: Array.isArray(service.features) ? service.features : 
                  (typeof service.features === 'object' ? Object.values(service.features) : []),
          platforms: service.platforms,
          timeline: `${service.timeline_days} days`,
          highlighted: service.is_highlighted,
          description: service.description,
          commission_rate: service.commission_rate
        }));
        
        setServices(formattedServices);
      } catch (error) {
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

    fetchServices();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-3">Choose Your Distribution Package</h2>
        <p className="text-muted-foreground">
          Select the package that best suits your film's distribution goals. Each package offers different levels of exposure and marketing support.
        </p>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full h-96 animate-pulse"></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServicePackageCard key={service.id} package={service} />
          ))}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Need a Custom Package?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Have specific distribution needs? We can create a tailored package to match your film's unique requirements.
        </p>
        <Card className="p-4">
          <Button className="w-full">Request Custom Package</Button>
        </Card>
      </div>
    </div>
  );
};

export default ServicePackages;
