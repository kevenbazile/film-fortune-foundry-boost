
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Calendar, X } from "lucide-react";

interface PaymentSummaryCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: 'check' | 'calendar' | 'x';
}

const PaymentSummaryCard: React.FC<PaymentSummaryCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon 
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'check':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'calendar':
        return <Calendar className="h-4 w-4 text-muted-foreground" />;
      case 'x':
        return <X className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {getIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
};

export default PaymentSummaryCard;
