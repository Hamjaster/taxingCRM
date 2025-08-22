"use client";
import { StatsCards } from "@/components/admin/stats-cards";
import { TasksPendingSection } from "@/components/admin/tasks-pending-section";
import { PendingTasksTable } from "@/components/admin/pending-tasks-table";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchTasks } from "@/store/slices/taskSlice";
import { useEffect } from "react";

export default function MainDashboard() {
  const { tasks } = useAppSelector((state) => state.tasks);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTasks({}));
  }, []);

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to your admin dashboard. Here's an overview of your business.
        </p>
      </div>

      <StatsCards />

      <PendingTasksTable
        tasks={tasks}
        title="Pending Tasks"
        description="Manage and track all pending tasks"
      />
    </div>
  );
}
