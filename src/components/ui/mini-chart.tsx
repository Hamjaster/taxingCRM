"use client";

import { ResponsiveContainer, Line, LineChart } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface ChartData {
  month: string;
  value: number;
}

interface MiniChartProps {
  data: ChartData[];
  trend: "up" | "down";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MiniChart({
  data,
  trend,
  size = "md",
  className = "",
}: MiniChartProps) {
  const chartColor = trend === "up" ? "#10b981" : "#ef4444";

  const sizeClasses = {
    sm: "h-8 w-16",
    md: "h-12 w-24",
    lg: "h-16 w-32",
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <ChartContainer
        config={{
          value: {
            label: "Value",
            color: chartColor,
          },
        }}
        className="h-full w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2}
              dot={false}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
