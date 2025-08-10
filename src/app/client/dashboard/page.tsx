import { redirect } from "next/navigation";

export default function ClientDashboard() {
  // Redirect to the main dashboard page
  redirect("/client/dashboard/main");
}
