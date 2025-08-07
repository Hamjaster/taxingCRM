import { ClientDashboardLayout } from "@/components/client/client-dashboard-layout";
import { ClientProfile } from "@/components/client/client-profile";
import { ClientTasks } from "@/components/client/client-tasks";

export default function ClientDashboard() {
  return (
    <ClientDashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        <ClientProfile />
        <ClientTasks />
      </div>
    </ClientDashboardLayout>
  );
}
