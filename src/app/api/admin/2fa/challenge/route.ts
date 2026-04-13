import { NextRequest } from "next/server";
import { Resend } from "resend";
import { requireAdmin } from "@/lib/auth";
import { env } from "@/lib/env";
import { getSecuritySettings } from "@/lib/app-settings";
import { createTwoFactorChallenge, getTwoFactorChallengeCooldown } from "@/lib/two-factor";
import { errorResponse, handleApiError, successResponse } from "@/lib/api-utils";

export async function POST(_request: NextRequest) {
  try {
    const session = await requireAdmin();
    const security = await getSecuritySettings();

    if (!security.twoFactorEnabled) {
      return successResponse({ sent: false, required: false });
    }

    const recipient = session.user.email || env.ADMIN_EMAIL;
    if (!recipient) {
      return errorResponse("No recipient email configured for 2FA", 400, "MISSING_EMAIL");
    }

    const cooldown = await getTwoFactorChallengeCooldown(session.user.id);
    if (cooldown.throttled) {
      return successResponse({
        sent: false,
        required: true,
        throttled: true,
        retryAfterSeconds: cooldown.retryAfterSeconds,
      });
    }

    const code = await createTwoFactorChallenge(session.user.id, recipient);

    if (!env.RESEND_API_KEY) {
      if (env.NODE_ENV !== "production") {
        return successResponse({ sent: true, required: true, devCode: code });
      }
      return errorResponse("2FA email provider is not configured", 500, "EMAIL_NOT_CONFIGURED");
    }

    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Portfolio Security <onboarding@resend.dev>",
      to: [recipient],
      subject: "Your Admin 2FA Verification Code",
      text: `Your verification code is ${code}. It expires in 10 minutes.`,
      html: `<p>Your verification code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes.</p>`,
    });

    return successResponse({ sent: true, required: true });
  } catch (error) {
    return handleApiError(error);
  }
}
