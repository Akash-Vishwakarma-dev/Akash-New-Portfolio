"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, RefreshCw } from "lucide-react";

const AUTO_SEND_KEY = "admin-2fa-auto-send-at";

export default function Verify2FAPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const sendCode = async () => {
    setSending(true);
    try {
      const response = await fetch("/api/admin/2fa/challenge", {
        method: "POST",
        credentials: "include",
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.error?.message || "Failed to send code");
      }

      if (payload?.data?.throttled) {
        const retryAfter = Number(payload?.data?.retryAfterSeconds) || 60;
        toast.info(`Code already sent. Please wait ${retryAfter}s before requesting again.`);
        return;
      }

      if (payload?.data?.devCode) {
        toast.success(`Development code: ${payload.data.devCode}`);
      } else {
        toast.success("Verification code sent to your email");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send code";
      toast.error(message);
    } finally {
      setSending(false);
    }
  };

  const verifyCode = async () => {
    if (!/^\d{6}$/.test(code.trim())) {
      toast.error("Enter a valid 6-digit code");
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch("/api/admin/2fa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code: code.trim() }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.error?.message || "Invalid code");
      }

      toast.success("2FA verified successfully");
      router.push("/admin/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Verification failed";
      toast.error(message);
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    const now = Date.now();
    const lastAuto = Number(window.sessionStorage.getItem(AUTO_SEND_KEY) || "0");
    if (now - lastAuto < 60_000) {
      return;
    }

    window.sessionStorage.setItem(AUTO_SEND_KEY, String(now));
    sendCode().catch(() => {
      // handled in sendCode
    });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 dark:from-slate-950 dark:to-slate-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Two-Factor Verification</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your admin email to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </div>

          <Button className="w-full" onClick={verifyCode} disabled={verifying}>
            {verifying ? "Verifying..." : "Verify and Continue"}
          </Button>

          <Button className="w-full" variant="outline" onClick={sendCode} disabled={sending}>
            {sending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend Code"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
