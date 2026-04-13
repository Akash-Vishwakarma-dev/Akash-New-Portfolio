import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { getSecuritySettings } from "@/lib/app-settings";
import { verifyTwoFactorChallenge } from "@/lib/two-factor";
import { errorResponse, handleApiError, parseRequestBody, successResponse } from "@/lib/api-utils";
import { env } from "@/lib/env";

const verifySchema = z.object({
  code: z.string().regex(/^\d{6}$/),
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();
    const security = await getSecuritySettings();

    if (!security.twoFactorEnabled) {
      const response = successResponse({ verified: true, required: false });
      response.cookies.delete("admin_2fa_verified");
      return response;
    }

    const parseResult = await parseRequestBody(request, verifySchema);
    if (!parseResult.success) {
      return parseResult.response;
    }

    const result = await verifyTwoFactorChallenge(session.user.id, parseResult.data.code);
    if (!result.success) {
      const reason = result.reason || "invalid";
      const message =
        reason === "expired"
          ? "Verification code expired. Request a new code."
          : reason === "too-many-attempts"
            ? "Too many attempts. Request a new code."
            : "Invalid verification code.";

      return errorResponse(message, 400, "INVALID_2FA_CODE", { reason });
    }

    const response = successResponse({ verified: true, required: true });
    response.cookies.set("admin_2fa_verified", session.user.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      path: "/",
      maxAge: security.sessionTimeout * 60,
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
