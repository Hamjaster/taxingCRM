"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MiniChart } from "@/components/ui/mini-chart";
import { fetchClientStats } from "@/store/slices/statsSlice";
import { AppDispatch, RootState } from "@/store";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function StatsCards() {
  const dispatch = useDispatch<AppDispatch>();
  const { chartData, currentStats, isLoading, error } = useSelector(
    (state: RootState) => state.stats
  );

  useEffect(() => {
    // Fetch stats on component mount
    dispatch(fetchClientStats());

    // Optionally, refresh stats every 5 minutes
    const interval = setInterval(() => {
      dispatch(fetchClientStats());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  // Prepare stats data for display
  const statsData = [
    {
      title: "Total Accounts",
      value: currentStats.totalAccounts.value.toString(),
      change: `${currentStats.totalAccounts.change > 0 ? "+" : ""}${
        currentStats.totalAccounts.change
      }%`,
      changeValue: `${currentStats.totalAccounts.change > 0 ? "+" : ""}${
        currentStats.totalAccounts.change
      }%`,
      trend: currentStats.totalAccounts.trend,
      color: "green" as const,
      data: chartData.totalAccounts,
    },
    {
      title: "Business Clients",
      value: currentStats.businessClients.value.toString(),
      change: `${currentStats.businessClients.change > 0 ? "+" : ""}${
        currentStats.businessClients.change
      }%`,
      changeValue: `${currentStats.businessClients.change > 0 ? "+" : ""}${
        currentStats.businessClients.change
      }%`,
      trend: currentStats.businessClients.trend,
      color: "white" as const,
      data: chartData.businessClients,
    },
    {
      title: "Individual Clients",
      value: currentStats.individualClients.value.toString(),
      change: `${currentStats.individualClients.change > 0 ? "+" : ""}${
        currentStats.individualClients.change
      }%`,
      changeValue: `${currentStats.individualClients.change > 0 ? "+" : ""}${
        currentStats.individualClients.change
      }%, vs last month`,
      trend: currentStats.individualClients.trend,
      color: "white" as const,
      data: chartData.individualClients,
    },
    {
      title: "Entity Formation",
      value: currentStats.entityFormation.value.toString(),
      change: `${currentStats.entityFormation.change > 0 ? "+" : ""}${
        currentStats.entityFormation.change
      }%`,
      changeValue: `${currentStats.entityFormation.change > 0 ? "+" : ""}${
        currentStats.entityFormation.change
      }%`,
      trend: currentStats.entityFormation.trend,
      data: chartData.entityFormation,
    },
    {
      title: "Registered Agent",
      value: currentStats.registeredAgent.value.toString(),
      change: `${currentStats.registeredAgent.change > 0 ? "+" : ""}${
        currentStats.registeredAgent.change
      }%`,
      changeValue: `${currentStats.registeredAgent.change > 0 ? "+" : ""}${
        currentStats.registeredAgent.change
      }%`,
      trend: currentStats.registeredAgent.trend,
      data: chartData.registeredAgent,
    },
    {
      title: "Publication",
      value: currentStats.publication.value.toString(),
      change: `${currentStats.publication.change > 0 ? "+" : ""}${
        currentStats.publication.change
      }%`,
      changeValue: `${currentStats.publication.change > 0 ? "+" : ""}${
        currentStats.publication.change
      }%`,
      trend: currentStats.publication.trend,
      data: chartData.publication,
    },
  ];

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error loading statistics: {error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading statistics...</span>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {statsData.map((stat) => (
          <Card
            key={stat.title}
            className={`${
              stat.color === "green"
                ? "bg-green-600 text-white"
                : "bg-white border border-gray-200"
            } ${isLoading ? "opacity-50" : ""}`}
          >
            <CardContent className="px-4">
              <div className="flex items-center justify-between">
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
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? "..." : stat.value}
                  </p>
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
                      {isLoading ? "..." : stat.changeValue}
                    </span>
                  </div>
                </div>
                {stat.data && stat.data.length > 0 && (
                  <MiniChart
                    className="w-[50%]"
                    data={stat.data}
                    trend={stat.trend}
                    size="lg"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
