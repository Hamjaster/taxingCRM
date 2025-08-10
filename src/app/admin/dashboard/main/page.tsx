import { StatsCards } from "@/components/admin/stats-cards";
import { TasksPendingSection } from "@/components/admin/tasks-pending-section";
import { PendingTasksTable } from "@/components/admin/pending-tasks-table";

export default function MainDashboard() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to your admin dashboard. Here's an overview of your business.
        </p>
      </div>

      <StatsCards />

      <TasksPendingSection />

      <PendingTasksTable />
    </div>
  );
}
