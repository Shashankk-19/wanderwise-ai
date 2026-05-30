# Environment Setup

Wanderly needs a small set of environment variables to boot. If `.env` is missing the app now renders a **configuration error page** instead of a blank white screen (see `src/lib/env.ts` and `src/components/ConfigError.tsx`).

## Frontend variables (Vite, exposed to the browser)

These live in `.env` at the project root and are loaded by Vite as `import.meta.env.*`.

| Variable | Used in | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | `src/integrations/supabase/client.ts`, `src/components/Chatbot.tsx`, `src/components/ItineraryRefiner.tsx`, `src/pages/Index.tsx` | Base URL of the Lovable Cloud (Supabase) project. Used by the Supabase client and for direct edge-function `fetch` calls. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | same files as above | Public anon key sent as `Authorization: Bearer` to edge functions and used by the Supabase JS client. Safe to ship to the browser. |
| `VITE_SUPABASE_PROJECT_ID` | reserved for tooling / future use | Project reference id. Kept in env so it can be read without parsing the URL. |

> All three are **publishable** values. Do not put service-role keys or any private secret behind a `VITE_` prefix — anything prefixed `VITE_` is bundled into the client.

## Backend variables (Edge Function secrets)

These are stored in **Lovable Cloud → Project Secrets** (Supabase Edge Function secrets). They are read inside `supabase/functions/*` via `Deno.env.get(...)` and are **never** exposed to the frontend.

| Secret | Used in | Purpose |
|---|---|---|
| `LOVABLE_API_KEY` | `supabase/functions/chat/index.ts`, `supabase/functions/generate-itinerary/index.ts`, `supabase/functions/refine-itinerary/index.ts` | Auth for the Lovable AI Gateway (`ai.gateway.lovable.dev`). Auto-provisioned by Lovable Cloud. |

Supabase also auto-injects the following into every edge function — you do not need to set them:
`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`, `SUPABASE_JWKS`, `SUPABASE_PUBLISHABLE_KEY`.

## Where each variable lives

| Variable | Stored in | Editable by |
|---|---|---|
| `VITE_SUPABASE_URL` | `.env` (auto-managed by Lovable) | Lovable platform |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `.env` (auto-managed) | Lovable platform |
| `VITE_SUPABASE_PROJECT_ID` | `.env` (auto-managed) | Lovable platform |
| `LOVABLE_API_KEY` | Supabase Edge Function secrets | Lovable Cloud (auto) |

## Recovering a missing `.env`

If you see the "Configuration required" screen:

1. Confirm `.env` exists at the project root. If it doesn't, copy `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Fill in the three `VITE_*` values from Lovable Cloud → Project settings (or the Supabase project dashboard).
3. Restart the dev server.

In Lovable, the `.env` file is regenerated automatically from project metadata — if it disappears, a fresh build/preview should restore it.

## Security checklist

- `.env` is listed in `.gitignore` and must never be committed.
- `.env.example` contains **names only**, no values — safe to commit.
- Never move `LOVABLE_API_KEY` (or any private key) into a `VITE_` variable.
- Service-role keys must only ever be read inside edge functions.
