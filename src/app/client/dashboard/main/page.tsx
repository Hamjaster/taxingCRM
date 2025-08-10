import { ClientProfile } from "@/components/client/client-profile";
import { ClientTasks } from "@/components/client/client-tasks";

export default function MainDashboard() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's an overview of your account.
        </p>
      </div>
      <ClientProfile />
      <ClientTasks />
    </div>
  );
}
