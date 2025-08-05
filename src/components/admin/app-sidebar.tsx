import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  PenTool,
  Settings,
  Building2,
  Menu,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Client List",
    icon: Users,
  },
  {
    title: "Client Profile",
    icon: UserCheck,
  },
  {
    title: "Documents",
    icon: FileText,
  },
  {
    title: "Create Blog",
    icon: PenTool,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200">
      <SidebarContent className="bg-[#e6f3eb]">
        <SidebarGroup>
          <div className="flex items-center justify-between px-4 py-6 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:justify-center">
            <img src="/icons/logo.svg" alt="TaxonTrack Logo" />
            <SidebarTrigger className="h-6 w-6 group-data-[collapsible=icon]:hidden" />
          </div>

          {/* Collapsible trigger for collapsed state */}
          <div className="hidden group-data-[collapsible=icon]:flex justify-center px-2 pb-4">
            <SidebarTrigger className="h-8 w-8 bg-gray-100 hover:bg-green-100 rounded-md">
              <Menu className="h-4 w-4" />
            </SidebarTrigger>
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.title}
                    className="data-[active=true]:bg-green-600 data-[active=true]:text-white hover:bg-green-100 group-data-[collapsible=icon]:justify-center"
                  >
                    <a href="#" className="flex items-center gap-3 px-4 py-2">
                      <item.icon className="h-4 w-4" />
                      <span className="group-data-[collapsible=icon]:sr-only">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 bg-[#e6f3eb] p-4 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Settings"
              className="hover:bg-green-100 group-data-[collapsible=icon]:justify-center"
            >
              <a href="#" className="flex items-center gap-3">
                <Settings className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:sr-only">
                  Settings
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="mt-4 flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-gray-500">john@doe1@gmail.com</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
