import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getSecuritySettings } from "@/lib/app-settings";
import { handleApiError, successResponse } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAdmin();
    const security = await getSecuritySettings();

    const verifiedCookie = request.cookies.get("admin_2fa_verified")?.value;
    const verified = !security.twoFactorEnabled || verifiedCookie === session.user.id;

    return successResponse({
      enabled: security.twoFactorEnabled,
      verified,
      sessionTimeout: security.sessionTimeout,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
