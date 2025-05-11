
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AlaCarteServiceItem from "./AlaCarteServiceItem";
import { ALACARTE_SERVICES } from "@/config/paypal";

interface CustomPackageRequestProps {
  onCustomPackageRequest: () => void;
}

const CustomPackageRequest = ({ onCustomPackageRequest }: CustomPackageRequestProps) => {
  const [showServices, setShowServices] = useState(false);
  
  return (
    <div className="mt-8">
      <div className="p-4 bg-muted rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-2">Need a Custom Package?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Have specific distribution needs? We can create a tailored package to match your film's unique requirements.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={() => setShowServices(!showServices)}
            variant="outline"
          >
            {showServices ? "Hide À La Carte Services" : "View À La Carte Services"}
          </Button>
          <Button 
            onClick={onCustomPackageRequest}
          >
            Request Custom Package
          </Button>
        </div>
      </div>
      
      {showServices && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-4">À La Carte Services</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Choose from our à la carte services below to complement your package or purchase individually.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(ALACARTE_SERVICES).map((service) => (
              <AlaCarteServiceItem
                key={service.buttonId}
                name={service.name}
                description={service.description}
                price={service.price}
                buttonId={service.buttonId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomPackageRequest;
