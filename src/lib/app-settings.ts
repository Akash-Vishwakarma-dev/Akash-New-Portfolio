import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

const SETTINGS_COLLECTION = "app_settings";
const CONTACT_SETTINGS_KEY = "contact";
const SECURITY_SETTINGS_KEY = "security";

export type ContactSettings = {
  contactFormEmail: string;
  emailNotifications: boolean;
};

export type SecuritySettings = {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
};

async function readSettingsValue<T>(key: string): Promise<Partial<T>> {
  const result = (await prisma.$runCommandRaw({
    find: SETTINGS_COLLECTION,
    filter: { key },
    limit: 1,
  })) as {
    cursor?: {
      firstBatch?: Array<{ value?: Partial<T> }>;
    };
  };

  const doc = result?.cursor?.firstBatch?.[0];
  return doc?.value || {};
}

async function writeSettingsValue(key: string, value: unknown): Promise<void> {
  const now = new Date();

  await prisma.$runCommandRaw({
    update: SETTINGS_COLLECTION,
    updates: [
      {
        q: { key },
        u: {
          $set: {
            key,
            value: value as any,
            updatedAt: now,
          },
          $setOnInsert: {
            createdAt: now,
          },
        },
        upsert: true,
      },
    ],
  });
}

function getDefaultContactSettings(): ContactSettings {
  return {
    contactFormEmail: env.ADMIN_EMAIL || "",
    emailNotifications: true,
  };
}

function getDefaultSecuritySettings(): SecuritySettings {
  return {
    twoFactorEnabled: false,
    sessionTimeout: 30,
  };
}

export async function getContactSettings(): Promise<ContactSettings> {
  const saved = await readSettingsValue<ContactSettings>(CONTACT_SETTINGS_KEY);
  const defaults = getDefaultContactSettings();

  return {
    contactFormEmail:
      typeof saved?.contactFormEmail === "string" && saved.contactFormEmail.trim()
        ? saved.contactFormEmail
        : defaults.contactFormEmail,
    emailNotifications:
      typeof saved?.emailNotifications === "boolean"
        ? saved.emailNotifications
        : defaults.emailNotifications,
  };
}

export async function saveContactSettings(settings: ContactSettings): Promise<ContactSettings> {
  const normalized: ContactSettings = {
    contactFormEmail: settings.contactFormEmail.trim(),
    emailNotifications: !!settings.emailNotifications,
  };

  await writeSettingsValue(CONTACT_SETTINGS_KEY, normalized);

  return normalized;
}

export async function getSecuritySettings(): Promise<SecuritySettings> {
  const saved = await readSettingsValue<SecuritySettings>(SECURITY_SETTINGS_KEY);
  const defaults = getDefaultSecuritySettings();

  return {
    twoFactorEnabled:
      typeof saved?.twoFactorEnabled === "boolean"
        ? saved.twoFactorEnabled
        : defaults.twoFactorEnabled,
    sessionTimeout:
      typeof saved?.sessionTimeout === "number" && Number.isFinite(saved.sessionTimeout)
        ? Math.min(Math.max(Math.floor(saved.sessionTimeout), 5), 1440)
        : defaults.sessionTimeout,
  };
}

export async function saveSecuritySettings(settings: SecuritySettings): Promise<SecuritySettings> {
  const normalized: SecuritySettings = {
    twoFactorEnabled: !!settings.twoFactorEnabled,
    sessionTimeout: Math.min(Math.max(Math.floor(settings.sessionTimeout), 5), 1440),
  };

  await writeSettingsValue(SECURITY_SETTINGS_KEY, normalized);

  return normalized;
}
