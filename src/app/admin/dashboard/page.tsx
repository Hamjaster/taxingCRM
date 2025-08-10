import { redirect } from "next/navigation";

export default function AdminDashboard() {
  // Redirect to the main dashboard page
  redirect("/admin/dashboard/main");
}
