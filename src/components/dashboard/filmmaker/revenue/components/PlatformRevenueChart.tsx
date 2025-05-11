
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface PlatformRevenueChartProps {
  platformRevenue: any[];
}

const PlatformRevenueChart: React.FC<PlatformRevenueChartProps> = ({ platformRevenue }) => {
  const chartConfig = {
    platforms: {
      label: "Platform Revenue",
      color: "#4f46e5", // Use direct color instead of theme
    }
  };

  const renderTooltipContent = (entry: any) => {
    if (entry && entry.payload && entry.payload.length > 0) {
      const data = entry.payload[0].payload;
      return (
        <div className="p-2 bg-white border rounded-md shadow-md">
          <p className="text-sm font-medium text-gray-800">{data.platform_name}</p>
          <p className="text-xs text-gray-600">
            <span style={{ color: chartConfig.platforms.color }}>●</span>{" "}
            Revenue: ${data.revenue}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!platformRevenue || platformRevenue.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h4 className="text-md font-semibold mb-2">Revenue by Platform</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={platformRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="platform_name" />
          <YAxis />
          <Tooltip content={renderTooltipContent} />
          <Legend />
          <Bar 
            dataKey="revenue" 
            fill={chartConfig.platforms.color} 
            name={chartConfig.platforms.label} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlatformRevenueChart;
