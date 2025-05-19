"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { SidebarProvider } from "@/context/sidebar-context";

import { usePathname } from "next/navigation";
import Loader from "@/component/shared/Loader";
import Header from "@/common/Header";
import { SideBar } from "@/common/SideBar";

export default function AuthGuard({
  role,
  children,
}: {
  role: "ADMIN" | string;
  children: React.ReactNode;
}) {
  const { data, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const allowedPathsMap: Record<string, string[]> = {
    ADMIN: ["/admin"],
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      const currentPath = pathname || "/";
      const roleKey = role as "ADMIN";
      const allowedPaths = allowedPathsMap[roleKey!] || [];

      // Check if current path starts with any allowed path
      const isAllowed = allowedPaths.some((allowedPath) =>
        currentPath.startsWith(allowedPath)
      );

      if (!isAllowed) {
        // Default redirect based on role
        const defaultPath =
          role === "ADMIN"
            ? "/admin/dashboard"
            : `/${role?.toLowerCase()}/dashboard`;

        router.push(defaultPath);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, data, role, router, pathname]);

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <Header role={"ADMIN"} />
        <div className="flex flex-col md:flex-row">
          <SideBar role={"ADMIN"} />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
