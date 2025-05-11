
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PaymentMethodCardProps {
  type: string;
  details: string;
  isDefault?: boolean;
  onSetDefault?: () => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  type,
  details,
  isDefault = false,
  onSetDefault
}) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-md">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-muted rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2"/>
            <line x1="2" x2="22" y1="10" y2="10"/>
          </svg>
        </div>
        <div>
          <p className="font-medium">{type}</p>
          <p className="text-sm text-muted-foreground">{details}</p>
        </div>
      </div>
      {isDefault ? (
        <Badge>Default</Badge>
      ) : (
        <Button variant="outline" size="sm" onClick={onSetDefault}>Set as Default</Button>
      )}
    </div>
  );
};

export default PaymentMethodCard;
