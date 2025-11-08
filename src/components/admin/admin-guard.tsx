"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LottieLoader } from "@/components/admin/lottie-loader";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (session?.user && (session.user as any).role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <LottieLoader size={120} />
      </div>
    );
  }

  if (status === "unauthenticated" || (session?.user && (session.user as any).role !== "ADMIN")) {
    return null;
  }

  return <>{children}</>;
}
