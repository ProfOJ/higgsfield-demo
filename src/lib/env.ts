import "server-only";
import { z } from "zod";

const envSchema = z.object({
  HF_API_KEY: z.string().min(1, "HF_API_KEY is required"),
  HF_SECRET: z.string().min(1, "HF_SECRET is required"),
});

let cachedEnv: { HF_API_KEY: string; HF_SECRET: string } | null = null;

export function getEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse({
    HF_API_KEY: process.env.HF_API_KEY,
    HF_SECRET: process.env.HF_SECRET,
  });

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error(
      "Missing or invalid environment variables. Please set HF_API_KEY and HF_SECRET in your .env.local file."
    );
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

// For backwards compatibility and tests
export const env = new Proxy({} as { HF_API_KEY: string; HF_SECRET: string }, {
  get(_target, prop: string) {
    return getEnv()[prop as keyof ReturnType<typeof getEnv>];
  },
});
