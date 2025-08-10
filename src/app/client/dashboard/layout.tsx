import { ClientDashboardLayout } from "@/components/client/client-dashboard-layout";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ClientDashboardLayout>
      {children}
    </ClientDashboardLayout>
  );
}
