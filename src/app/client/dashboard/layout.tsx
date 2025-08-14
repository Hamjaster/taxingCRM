import { ClientDashboardLayout } from "@/components/client/client-dashboard-layout";
import AuthGuard from "@/components/auth/AuthGuard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard requiredRole="client">
      <ClientDashboardLayout>{children}</ClientDashboardLayout>
    </AuthGuard>
  );
}
