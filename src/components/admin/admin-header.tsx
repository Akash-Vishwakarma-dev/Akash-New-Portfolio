"use client";

import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function AdminHeader() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      await fetch("/api/admin/2fa/reset", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Continue sign-out even if cookie reset fails.
    }

    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Portfolio Admin</h2>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {session?.user && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{session.user.name || session.user.email}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
