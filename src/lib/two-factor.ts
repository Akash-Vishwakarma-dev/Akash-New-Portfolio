import { createHash, randomInt } from "crypto";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

const SETTINGS_COLLECTION = "app_settings";
const CHALLENGE_PREFIX = "two_factor_challenge:";
const CHALLENGE_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type ChallengeValue = {
  codeHash: string;
  issuedAt: string;
  expiresAt: string;
  attempts: number;
  email: string;
};

function getChallengeKey(userId: string): string {
  return `${CHALLENGE_PREFIX}${userId}`;
}

function hashCode(userId: string, code: string): string {
  return createHash("sha256")
    .update(`${userId}:${code}:${env.NEXTAUTH_SECRET}`)
    .digest("hex");
}

async function readChallenge(userId: string): Promise<ChallengeValue | null> {
  const key = getChallengeKey(userId);
  const result = (await prisma.$runCommandRaw({
    find: SETTINGS_COLLECTION,
    filter: { key },
    limit: 1,
  })) as {
    cursor?: {
      firstBatch?: Array<{ value?: ChallengeValue }>;
    };
  };

  return result?.cursor?.firstBatch?.[0]?.value || null;
}

async function writeChallenge(userId: string, value: ChallengeValue): Promise<void> {
  const now = new Date();
  const key = getChallengeKey(userId);

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

export async function clearTwoFactorChallenge(userId: string): Promise<void> {
  await prisma.$runCommandRaw({
    delete: SETTINGS_COLLECTION,
    deletes: [{ q: { key: getChallengeKey(userId) }, limit: 1 }],
  });
}

export async function createTwoFactorChallenge(userId: string, email: string): Promise<string> {
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const nowIso = new Date().toISOString();
  const value: ChallengeValue = {
    codeHash: hashCode(userId, code),
    issuedAt: nowIso,
    expiresAt: new Date(Date.now() + CHALLENGE_TTL_MS).toISOString(),
    attempts: 0,
    email,
  };

  await writeChallenge(userId, value);
  return code;
}

export async function getTwoFactorChallengeCooldown(
  userId: string,
  cooldownMs: number = 60_000
): Promise<{ throttled: boolean; retryAfterSeconds: number }> {
  const challenge = await readChallenge(userId);
  if (!challenge) {
    return { throttled: false, retryAfterSeconds: 0 };
  }

  const now = Date.now();
  const expiresAt = new Date(challenge.expiresAt).getTime();
  if (!Number.isFinite(expiresAt) || expiresAt <= now) {
    await clearTwoFactorChallenge(userId);
    return { throttled: false, retryAfterSeconds: 0 };
  }

  const issuedAt = new Date(challenge.issuedAt).getTime();
  if (!Number.isFinite(issuedAt)) {
    return { throttled: false, retryAfterSeconds: 0 };
  }

  const nextAllowedAt = issuedAt + cooldownMs;
  if (nextAllowedAt <= now) {
    return { throttled: false, retryAfterSeconds: 0 };
  }

  return {
    throttled: true,
    retryAfterSeconds: Math.max(1, Math.ceil((nextAllowedAt - now) / 1000)),
  };
}

export async function verifyTwoFactorChallenge(
  userId: string,
  code: string
): Promise<{ success: boolean; reason?: "missing" | "expired" | "invalid" | "too-many-attempts" }> {
  const challenge = await readChallenge(userId);

  if (!challenge) {
    return { success: false, reason: "missing" };
  }

  if (new Date(challenge.expiresAt).getTime() < Date.now()) {
    await clearTwoFactorChallenge(userId);
    return { success: false, reason: "expired" };
  }

  if (challenge.attempts >= MAX_ATTEMPTS) {
    await clearTwoFactorChallenge(userId);
    return { success: false, reason: "too-many-attempts" };
  }

  const expected = hashCode(userId, code);
  if (expected === challenge.codeHash) {
    await clearTwoFactorChallenge(userId);
    return { success: true };
  }

  await writeChallenge(userId, {
    ...challenge,
    attempts: challenge.attempts + 1,
  });

  return { success: false, reason: "invalid" };
}
