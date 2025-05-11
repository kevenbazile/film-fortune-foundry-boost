
import React from "react";
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp } from "lucide-react";

interface RevenueMetricsProps {
  totalRevenue: number;
  growthRate: number;
}

const RevenueMetrics: React.FC<RevenueMetricsProps> = ({ totalRevenue, growthRate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="flex items-center justify-between p-4 bg-muted rounded-md">
        <div>
          <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
          <div className="text-2xl font-bold mt-2">
            <DollarSign className="mr-2 h-4 w-4 inline-block" />
            {totalRevenue.toFixed(2)}
          </div>
        </div>
        <ArrowUpRight className="h-6 w-6 text-green-500" />
      </div>
      <div className="flex items-center justify-between p-4 bg-muted rounded-md">
        <div>
          <span className="text-sm font-medium text-muted-foreground">Revenue Growth</span>
          <div className="text-2xl font-bold mt-2">
            <TrendingUp className="mr-2 h-4 w-4 inline-block" />
            {growthRate.toFixed(2)}%
          </div>
        </div>
        {growthRate >= 0 ? (
          <ArrowUpRight className="h-6 w-6 text-green-500" />
        ) : (
          <ArrowDownRight className="h-6 w-6 text-red-500" />
        )}
      </div>
    </div>
  );
};

export default RevenueMetrics;
