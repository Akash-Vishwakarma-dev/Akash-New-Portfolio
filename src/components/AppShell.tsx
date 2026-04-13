"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}
