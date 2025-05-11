
import React from "react";
import { Card } from "@/components/ui/card";
import PayPalDirectButton from "@/components/paypal-direct/PayPalDirectButton";

interface AlaCarteServiceItemProps {
  name: string;
  description: string;
  price: string;
  buttonId: string;
}

const AlaCarteServiceItem = ({
  name,
  description,
  price,
  buttonId,
}: AlaCarteServiceItemProps) => {
  return (
    <Card className="flex flex-col p-6">
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <p className="text-xl font-bold text-primary mb-3">${price}</p>
      <PayPalDirectButton 
        buttonId={buttonId} 
        className="w-full" 
      />
    </Card>
  );
};

export default AlaCarteServiceItem;
