import { ClientDashboardLayout } from "@/components/client/client-dashboard-layout";
import AuthGuard from "@/components/auth/AuthGuard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <ClientDashboardLayout>{children}</ClientDashboardLayout>;
}
