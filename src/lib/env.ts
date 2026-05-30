// Centralized environment validation for the frontend.
// Prevents hard crashes (white screen) when required Vite env vars are missing.

export interface EnvCheckResult {
  ok: boolean;
  missing: string[];
  values: {
    VITE_SUPABASE_URL?: string;
    VITE_SUPABASE_PUBLISHABLE_KEY?: string;
    VITE_SUPABASE_PROJECT_ID?: string;
  };
}

const REQUIRED = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "VITE_SUPABASE_PROJECT_ID",
] as const;

export function checkEnv(): EnvCheckResult {
  const env = import.meta.env as Record<string, string | undefined>;
  const missing = REQUIRED.filter((k) => !env[k] || String(env[k]).trim() === "");
  return {
    ok: missing.length === 0,
    missing,
    values: {
      VITE_SUPABASE_URL: env.VITE_SUPABASE_URL,
      VITE_SUPABASE_PUBLISHABLE_KEY: env.VITE_SUPABASE_PUBLISHABLE_KEY,
      VITE_SUPABASE_PROJECT_ID: env.VITE_SUPABASE_PROJECT_ID,
    },
  };
}
