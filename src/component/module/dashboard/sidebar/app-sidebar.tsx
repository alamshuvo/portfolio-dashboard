"use client";

import * as React from "react";
import {
  Bot,
  Briefcase,
  LayoutDashboard,
  Layers,
  Notebook,
  Settings,
  User,
} from "lucide-react";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NavMain } from "./nav-main";

const navItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    url: "/admin/projects",
    icon: Layers,
    items: [
      { title: "All Projects", url: "/admin/projects" },
      { title: "Create Project", url: "/admin/projects/create" },
    ],
  },
  {
    title: "Skills",
    url: "/admin/skills",
    icon: Bot,
  },
  {
    title: "Blogs",
    url: "/admin/blogs",
    icon: Notebook,
    items: [
      { title: "All Blogs", url: "/admin/blogs" },
      { title: "Create Blog", url: "/admin/blogs/create" },
    ],
  },
  {
    title: "Experience",
    url: "/admin/experience",
    icon: Briefcase,
  },
  {
    title: "Profile",
    url: "/admin/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="bg-white border-r" {...props}>
      {/* Logo / Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-blue-600">Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation Menu */}
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      {/* Optional Footer */}
      <SidebarFooter>
        {/* Optional: add user info, logout, version info etc. */}
        <div className="text-xs text-gray-500 px-4 py-2">v1.0.0</div>
      </SidebarFooter>
    </Sidebar>
  );
}
