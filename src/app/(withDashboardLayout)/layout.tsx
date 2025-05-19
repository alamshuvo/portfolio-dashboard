import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/utils/authOptions";

// import { AppSidebar } from "@/component/module/dashboard/sidebar/app-sidebar";
// import {
//   SidebarProvider,
//   SidebarContent,

//   SidebarFooter,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
import AuthGuard from "@/component/module/auth/auth/AuthGuard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/login?callbackUrl=/admin`);
  }

  return (
    <AuthGuard role={"ADMIN"}>
    <main className="flex-1 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Mobile padding fix */}
        <div className="md:hidden h-8"></div>
        {children}
      </div>
    </main>
  </AuthGuard>
  );
}
