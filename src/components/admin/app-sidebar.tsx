"use client";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  PenTool,
  Settings,
  Building2,
  Menu,
  ChevronUp,
  LogOut,
  User,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard/main",
  },
  {
    title: "Client List",
    icon: Users,
    href: "/admin/dashboard/clients",
  },
  {
    title: "Client Profile",
    icon: UserCheck,
    href: "/admin/dashboard/profile",
  },
  {
    title: "Documents",
    icon: FileText,
    href: "/admin/dashboard/documents",
  },
  {
    title: "Create Blog",
    icon: PenTool,
    href: "/admin/dashboard/blog",
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const signOut = () => {
    router.push("/");
    // Implement sign out logic here
  };
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
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="data-[active=true]:bg-green-600 data-[active=true]:text-white hover:bg-green-100 group-data-[collapsible=icon]:justify-center"
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-2"
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="group-data-[collapsible=icon]:sr-only">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 bg-[#e6f3eb] p-4 group-data-[collapsible=icon]:p-2">
        <div className="mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-gray-50 transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>MA</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-medium">M Ali</span>
                  <span className="text-xs text-gray-500">
                    johndoe1@gmail.com
                  </span>
                </div>
                <ChevronUp className="h-4 w-4 text-gray-400 group-data-[collapsible=icon]:hidden" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              className="w-56 mb-2"
              sideOffset={8}
            >
              <div className="flex items-center gap-3 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>MA</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">M Ali</span>
                  <span className="text-xs text-gray-500">
                    johndoe1@gmail.com
                  </span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut()}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
