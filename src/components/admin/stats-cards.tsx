"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MiniChart } from "@/components/ui/mini-chart";

// Chart data
const chartData = {
  totalAccounts: [
    { month: "Jan", value: 112 },
    { month: "Feb", value: 190 },
    { month: "Mar", value: 650 },
    { month: "Apr", value: 300 },
    { month: "May", value: 820 },
    { month: "Jun", value: 410 },
  ],
  businessClients: [
    { month: "Jan", value: 28 },
    { month: "Feb", value: 44 },
    { month: "Mar", value: 29 },
    { month: "Apr", value: 61 },
    { month: "May", value: 33 },
    { month: "Jun", value: 55 },
  ],
  individualClients: [
    { month: "Jan", value: 70 },
    { month: "Feb", value: 60 },
    { month: "Mar", value: 90 },
    { month: "Apr", value: 75 },
    { month: "May", value: 88 },
    { month: "Jun", value: 66 },
  ],
  entityFormation: [
    { month: "Jan", value: 5 },
    { month: "Feb", value: 13 },
    { month: "Mar", value: 7 },
    { month: "Apr", value: 15 },
    { month: "May", value: 9 },
    { month: "Jun", value: 14 },
  ],
  registeredAgent: [
    { month: "Jan", value: 10 },
    { month: "Feb", value: 14 },
    { month: "Mar", value: 6 },
    { month: "Apr", value: 18 },
    { month: "May", value: 7 },
    { month: "Jun", value: 12 },
  ],
  publication: [
    { month: "Jan", value: 17 },
    { month: "Feb", value: 28 },
    { month: "Mar", value: 20 },
    { month: "Apr", value: 25 },
    { month: "May", value: 19 },
    { month: "Jun", value: 30 },
  ],
};

const statsData = [
  {
    title: "Total Accounts",
    value: "117",
    change: "+5%",
    changeValue: "+5%",
    trend: "up" as const,
    color: "green",
    data: chartData.totalAccounts,
  },
  {
    title: "Business Clients",
    value: "36",
    change: "+5%",
    changeValue: "+5%",
    trend: "up" as const,
    color: "white",
    data: chartData.businessClients,
  },
  {
    title: "Individual Clients",
    value: "81",
    change: "+20%",
    changeValue: "+20%, vs last month",
    trend: "up" as const,
    color: "white",
    data: chartData.individualClients,
  },
  {
    title: "Entity Formation",
    value: "12",
    change: "+40%",
    changeValue: "+40%",
    trend: "up" as const,
    data: chartData.entityFormation,
  },
  {
    title: "Registered Agent",
    value: "11",
    change: "+5%",
    changeValue: "+156",
    trend: "up" as const,
    data: chartData.registeredAgent,
  },
  {
    title: "Publication",
    value: "23",
    change: "+20%",
    changeValue: "+156",
    trend: "down" as const,
    data: chartData.publication,
  },
];

export function StatsCards() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {statsData.map((stat) => (
          <Card
            key={stat.title}
            className={`${
              stat.color === "green"
                ? "bg-green-600 text-white"
                : "bg-white border border-gray-200"
            }`}
          >
            <CardContent className="px-4">
              <div className="flex  items-center justify-between">
                <div className="space-y-3">
                  <p
                    className={`text-sm font-medium ${
                      stat.color === "green"
                        ? "text-green-100"
                        : "text-gray-600"
                    }`}
                  >
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span
                      className={`text-xs ${
                        stat.color === "green"
                          ? "text-green-100"
                          : stat.trend === "up"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.changeValue}
                    </span>
                  </div>
                </div>
                <MiniChart
                  className="w-[50%]"
                  data={stat.data}
                  trend={stat.trend}
                  size="lg"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
