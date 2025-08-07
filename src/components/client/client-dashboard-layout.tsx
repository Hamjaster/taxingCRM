"use client";

import type React from "react";
import { ClientSidebar } from "./client-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/admin/dashboard-header";

interface ClientDashboardLayoutProps {
  children: React.ReactNode;
}

export function ClientDashboardLayout({
  children,
}: ClientDashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <ClientSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 bg-gray-50">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
