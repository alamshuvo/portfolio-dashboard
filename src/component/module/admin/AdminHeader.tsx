'use client';


import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/sidebar-context";
import { signOutUser } from "@/utils/signOutUser";

import {  ShieldAlert, Menu, X, LogOut } from "lucide-react";
import Link from "next/link";


export function AdminHeader() {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <header className="shadow-sm border-b z-[60] bg-white dark:bg-accent sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="md:hidden p-2"
            onClick={toggleSidebar}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="flex items-center gap-2 text-red-600">
            <ShieldAlert className="h-6 w-6" />
            <span className="font-semibold hidden sm:inline">Admin Dashboard</span>
            <span className="font-semibold sm:hidden">Admin</span>
          </div>
        </div>

        <Link
          href="/admin"
          className="flex items-center gap-2 text-orange-600 font-bold text-xl"
        >
          
          Portfolio
        </Link>

        <div className="flex items-center gap-4">
          {/* <ThemeToggle/> */}
          <Button
            onClick={() => signOutUser()}
            variant="ghost"
            className="gap-1.5 text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}