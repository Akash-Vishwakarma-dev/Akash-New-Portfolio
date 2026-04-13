"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LottieLoader } from "@/components/admin/lottie-loader";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isTwoFactorLoading, setIsTwoFactorLoading] = useState(true);
  const [isTwoFactorRequired, setIsTwoFactorRequired] = useState(false);
  const [isTwoFactorVerified, setIsTwoFactorVerified] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadTwoFactorStatus = async () => {
      if (status !== "authenticated" || !session?.user || (session.user as any).role !== "ADMIN") {
        if (mounted) setIsTwoFactorLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/admin/2fa/status", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          if (mounted) {
            setIsTwoFactorRequired(false);
            setIsTwoFactorVerified(true);
          }
          return;
        }

        const payload = await response.json();
        if (mounted) {
          setIsTwoFactorRequired(!!payload?.data?.enabled);
          setIsTwoFactorVerified(!!payload?.data?.verified);
        }
      } catch {
        if (mounted) {
          setIsTwoFactorRequired(false);
          setIsTwoFactorVerified(true);
        }
      } finally {
        if (mounted) setIsTwoFactorLoading(false);
      }
    };

    setIsTwoFactorLoading(true);
    loadTwoFactorStatus();

    return () => {
      mounted = false;
    };
  }, [status, session?.user, pathname]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (session?.user && (session.user as any).role !== "ADMIN") {
      router.push("/");
    } else if (
      status === "authenticated" &&
      session?.user &&
      (session.user as any).role === "ADMIN" &&
      !isTwoFactorLoading
    ) {
      if (isTwoFactorRequired && !isTwoFactorVerified && pathname !== "/admin/verify-2fa") {
        router.push("/admin/verify-2fa");
      }
      if ((!isTwoFactorRequired || isTwoFactorVerified) && pathname === "/admin/verify-2fa") {
        router.push("/admin/dashboard");
      }
    }
  }, [status, session, router, pathname, isTwoFactorLoading, isTwoFactorRequired, isTwoFactorVerified]);

  if (status === "loading" || (status === "authenticated" && isTwoFactorLoading)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LottieLoader size={120} />
      </div>
    );
  }

  if (
    status === "unauthenticated" ||
    (session?.user && (session.user as any).role !== "ADMIN") ||
    (isTwoFactorRequired && !isTwoFactorVerified && pathname !== "/admin/verify-2fa")
  ) {
    return null;
  }

  return <>{children}</>;
}
