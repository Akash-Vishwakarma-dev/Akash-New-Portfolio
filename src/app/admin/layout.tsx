"use client";

import { usePathname } from "next/navigation";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { Toaster } from "sonner";
import "@/app/globals.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const isVerifyPage = pathname === "/admin/verify-2fa";

  // Don't wrap login page with AdminGuard
  if (isLoginPage) {
    return (
      <ThemeProvider>
        <QueryProvider>
          {children}
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </ThemeProvider>
    );
  }

  if (isVerifyPage) {
    return (
      <ThemeProvider>
        <QueryProvider>
          <AdminGuard>
            {children}
            <Toaster position="top-right" richColors />
          </AdminGuard>
        </QueryProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <QueryProvider>
        <AdminGuard>
          <div className="min-h-screen bg-background">
            <AdminSidebar />
            <div className="pl-64">
              <AdminHeader />
              <main className="mt-16 p-6">{children}</main>
            </div>
            <Toaster position="top-right" richColors />
          </div>
        </AdminGuard>
      </QueryProvider>
    </ThemeProvider>
  );
}
