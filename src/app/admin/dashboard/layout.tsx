import { DashboardLayout } from "@/components/admin/dashboard-layout";
import AuthGuard from "@/components/auth/AuthGuard";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export default function AdminDashboardLayout({
  children,
}: AdminDashboardLayoutProps) {
  return (
    <AuthGuard requiredRole="admin">
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
