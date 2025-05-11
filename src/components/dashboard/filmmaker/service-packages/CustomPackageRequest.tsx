
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CustomPackageRequestProps {
  onCustomPackageRequest: () => void;
}

const CustomPackageRequest = ({ onCustomPackageRequest }: CustomPackageRequestProps) => {
  return (
    <div className="mt-8 p-4 bg-muted rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Need a Custom Package?</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Have specific distribution needs? We can create a tailored package to match your film's unique requirements.
      </p>
      <Card className="p-4">
        <Button className="w-full" onClick={onCustomPackageRequest}>Request Custom Package</Button>
      </Card>
    </div>
  );
};

export default CustomPackageRequest;
