import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { checkRateLimit, getClientIdentifier, adminRateLimit } from "@/lib/rate-limit";
import {
  getContactSettings,
  getSecuritySettings,
  saveContactSettings,
  saveSecuritySettings,
} from "@/lib/app-settings";
import { handleApiError, parseRequestBody, successResponse } from "@/lib/api-utils";

const updateEmailSettingsSchema = z.object({
  contactFormEmail: z.string().email().optional(),
  emailNotifications: z.boolean().optional(),
  twoFactorEnabled: z.boolean().optional(),
  sessionTimeout: z.number().int().min(5).max(1440).optional(),
}).refine(
  (value) =>
    value.contactFormEmail !== undefined ||
    value.emailNotifications !== undefined ||
    value.twoFactorEnabled !== undefined ||
    value.sessionTimeout !== undefined,
  {
    message: "At least one setting field must be provided",
  }
);

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(adminRateLimit, identifier);
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    const [contactSettings, securitySettings] = await Promise.all([
      getContactSettings(),
      getSecuritySettings(),
    ]);

    return successResponse({
      ...contactSettings,
      ...securitySettings,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();

    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(adminRateLimit, identifier);
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    const parseResult = await parseRequestBody(request, updateEmailSettingsSchema);
    if (!parseResult.success) {
      return parseResult.response;
    }

    const [currentContact, currentSecurity] = await Promise.all([
      getContactSettings(),
      getSecuritySettings(),
    ]);

    const [contactSettings, securitySettings] = await Promise.all([
      saveContactSettings({
        contactFormEmail: parseResult.data.contactFormEmail ?? currentContact.contactFormEmail,
        emailNotifications: parseResult.data.emailNotifications ?? currentContact.emailNotifications,
      }),
      saveSecuritySettings({
        twoFactorEnabled: parseResult.data.twoFactorEnabled ?? currentSecurity.twoFactorEnabled,
        sessionTimeout: parseResult.data.sessionTimeout ?? currentSecurity.sessionTimeout,
      }),
    ]);

    return successResponse({
      ...contactSettings,
      ...securitySettings,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
