
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface ServicePackage {
  id: string;
  title: string;
  price: string;
  features: string[];
  platforms: string[];
  timeline: string;
  highlighted: boolean;
}

interface ServicePackageCardProps {
  package: ServicePackage;
}

const ServicePackageCard = ({ package: pkg }: ServicePackageCardProps) => {
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
          <span className="text-3xl font-bold">{pkg.price}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <div className="space-y-2">
          <p className="font-medium text-center text-sm text-muted-foreground mb-4">
            Turnaround time: {pkg.timeline}
          </p>
          
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
            {pkg.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button 
          className="w-full" 
          variant={pkg.highlighted ? "default" : "outline"}
        >
          Choose {pkg.title}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServicePackageCard;
