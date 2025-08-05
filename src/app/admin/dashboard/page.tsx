import { DashboardLayout } from "@/components/admin/dashboard-layout";
import { StatsCards } from "@/components/admin/stats-cards";
import { TasksPendingSection } from "@/components/admin/tasks-pending-section";
import { PendingTasksTable } from "@/components/admin/pending-tasks-table";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>

        <StatsCards />

        <TasksPendingSection />

        <PendingTasksTable />
      </div>
    </DashboardLayout>
  );
}
