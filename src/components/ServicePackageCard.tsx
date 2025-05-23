
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface ServicePackage {
  id: string;
  title: string;
  price: string;
  description?: string;
  features: string[] | any;
  platforms: string[];
  timeline: string;
  highlighted: boolean;
  commission_rate?: number;
}

interface ServicePackageCardProps {
  package: ServicePackage;
}

const ServicePackageCard = ({ package: pkg }: ServicePackageCardProps) => {
  // Handle features that might be a JSONB array from the database
  const featuresArray = typeof pkg.features === 'string' 
    ? JSON.parse(pkg.features) 
    : Array.isArray(pkg.features)
      ? pkg.features
      : Object.values(pkg.features || {});

  // Extract just the number for display
  const priceNumber = pkg.price.replace(/[^0-9.]/g, '');
  
  return (
    <Card 
      className={`h-full flex flex-col ${pkg.highlighted ? 'ring-2 ring-primary relative' : ''}`}
    >
      {pkg.highlighted && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Badge className="bg-primary hover:bg-primary text-white">Most Popular</Badge>
        </div>
      )}
      <CardHeader className="text-center">
        <h3 className="text-2xl font-bold">{pkg.title}</h3>
        <div className="mt-2">
          <span className="text-3xl font-bold">${priceNumber}</span>
          <span className="text-sm font-normal text-muted-foreground">/month</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <div className="space-y-2">
          <p className="font-medium text-center text-sm text-muted-foreground mb-4">
            Turnaround time: {pkg.timeline}
          </p>
          
          {pkg.commission_rate && (
            <p className="font-medium text-center text-sm text-muted-foreground mb-4">
              Commission rate: {pkg.commission_rate}%
            </p>
          )}
          
          <div className="text-sm font-semibold mb-2">Included Platforms:</div>
          <div className="flex flex-wrap gap-2 mb-6">
            {pkg.platforms.map((platform, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {platform}
              </Badge>
            ))}
          </div>
          
          <div className="text-sm font-semibold mb-2">Package Features:</div>
          <ul className="space-y-2">
            {featuresArray.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServicePackageCard;
