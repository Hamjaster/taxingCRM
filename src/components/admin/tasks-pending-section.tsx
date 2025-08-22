"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Building, Users, Handshake } from "lucide-react";
import { fetchTasks, setFilters } from "@/store/slices/taskSlice";

export function TasksPendingSection() {
  const dispatch = useAppDispatch();
  const { tasks, pagination, isLoading } = useAppSelector(
    (state) => state.tasks
  );

  // Fetch tasks when component mounts
  useEffect(() => {
    dispatch(fetchTasks({ status: "Pending", limit: 100 }));
  }, [dispatch]);

  // Calculate task counts by category
  const taskCounts = tasks.reduce((acc, task) => {
    const category = task.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Define task categories with their counts
  const taskCategories = [
    {
      title: "Individual Tax Prep",
      count: taskCounts["Individual Tax Prep"] || taskCounts["Tax Prep"] || 0,
      icon: "/icons/admin/task1.svg",
      category: "Individual Tax Prep",
    },
    {
      title: "S-Corp Tax Prep (1120-S)",
      count: taskCounts["S-Corp Tax Prep (1120-S)"] || 0,
      icon: "/icons/admin/task2.svg",
      category: "S-Corp Tax Prep (1120-S)",
    },
    {
      title: "C-Corp Tax Prep (1120)",
      count: taskCounts["C-Corp Tax Prep (1120)"] || 0,
      icon: "/icons/admin/task3.svg",
      category: "C-Corp Tax Prep (1120)",
    },
    {
      title: "Partnership Tax Prep (1065)",
      count: taskCounts["Partnership Tax Prep (1065)"] || 0,
      icon: "/icons/admin/task4.svg",
      category: "Partnership Tax Prep (1065)",
    },
  ];

  // Calculate total pending tasks
  const totalPendingTasks = pagination.totalTasks || 0;

  const handleViewAll = () => {
    // This could navigate to the full tasks page or show all tasks
    dispatch(setFilters({ status: "Pending", page: 1 }));
  };

  const handleCategoryClick = (category: string) => {
    dispatch(setFilters({ status: "Pending", category, page: 1 }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              <span>Total Tasks Pending</span>
              <span className="text-sm text-gray-500 ml-2">(Loading...)</span>
            </h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-gray-100 animate-pulse">
              <CardContent className="px-4 py-6">
                <div className="space-y-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-md"></div>
                  <div>
                    <div className="w-24 h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            <span>Total Tasks Pending</span>
            <span className="text-sm text-gray-500 ml-2">
              ({totalPendingTasks})
            </span>
          </h2>
        </div>
        <Button
          variant="link"
          className="text-green-600"
          onClick={handleViewAll}
        >
          View All
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {taskCategories.map((category) => (
          <Card
            key={category.title}
            className="bg-[#e6f3eb] border-green-600 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCategoryClick(category.category)}
          >
            <CardContent className="px-4 py-6">
              <div className="space-y-4">
                <div className="flex justify-start">
                  <div className="rounded-md border-2 border-green-600 p-2">
                    <img
                      src={category.icon}
                      alt={category.title}
                      className="w-5 h-5"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {category.title}
                  </p>
                  <p className="text-4xl font-bold text-green-700">
                    {category.count.toString().padStart(2, "0")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPendingTasks === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No pending tasks found.</p>
          <p className="text-sm">
            Tasks will appear here once they are assigned.
          </p>
        </div>
      )}
    </div>
  );
}
