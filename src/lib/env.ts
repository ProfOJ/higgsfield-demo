import "server-only";
import { z } from "zod";
import { logger } from "./logger";

const REQUIRED_ENV_KEYS = ["HF_API_KEY", "HF_SECRET"] as const;

const envSchema = z.object({
  HF_API_KEY: z.string().min(1, "HF_API_KEY is required"),
  HF_SECRET: z.string().min(1, "HF_SECRET is required"),
});

let cachedEnv: { HF_API_KEY: string; HF_SECRET: string } | null = null;

export function getEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  // Log environment variable presence (without values for security)
  const envStatus = REQUIRED_ENV_KEYS.map((key) => ({
    key,
    present: !!process.env[key],
    length: process.env[key]?.length || 0,
  }));
  logger.debug("Checking environment variables", { envStatus });

  const parsed = envSchema.safeParse({
    HF_API_KEY: process.env.HF_API_KEY,
    HF_SECRET: process.env.HF_SECRET,
  });

  if (!parsed.success) {
    const missing = REQUIRED_ENV_KEYS.filter((key) => !process.env[key]);
    logger.error("Missing or invalid environment variables", {
      missing,
      errors: parsed.error.flatten().fieldErrors,
      nodeEnv: process.env.NODE_ENV,
    });
    throw new Error(
      `Missing environment variables: ${missing.join(", ")}. Please set HF_API_KEY and HF_SECRET in your .env.local file or Vercel environment variables.`
    );
  }

  cachedEnv = parsed.data;
  logger.info("Environment validation succeeded", {
    envCount: REQUIRED_ENV_KEYS.length,
  });
  return cachedEnv;
}

// For backwards compatibility and tests
export const env = new Proxy({} as { HF_API_KEY: string; HF_SECRET: string }, {
  get(_target, prop: string) {
    return getEnv()[prop as keyof ReturnType<typeof getEnv>];
  },
});
