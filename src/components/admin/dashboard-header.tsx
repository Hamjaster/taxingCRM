import { Search, Bell, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "../ui/sidebar";

export function DashboardHeader() {
  return (
    <div className="flex flex-row h-16 w-full  items-center justify-between gap-4 border-b border-gray-200 bg-white px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="w-1/2 flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search" className="w-64 pl-10" />
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-end gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>

        <Button variant="ghost" className="gap-2">
          <span>English</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
