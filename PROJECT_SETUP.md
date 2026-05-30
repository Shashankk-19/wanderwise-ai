# Project Setup — Wanderly

AI travel planner. React + Vite + Tailwind + ShadCN on the frontend, Lovable Cloud (Supabase: Postgres + Auth + Edge Functions) on the backend, Lovable AI Gateway for model calls.

## Prerequisites

- Node 18+ and `bun` (or npm)
- A Lovable Cloud-connected project (provides Supabase + `LOVABLE_API_KEY`)

## Install & run

```bash
bun install
cp .env.example .env   # then fill in the VITE_* values
bun run dev
```

Open the preview URL printed by Vite.

## Environment

See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for the full variable reference. TL;DR:

- `.env` (frontend, committed-ignored): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`
- Lovable Cloud secrets (backend): `LOVABLE_API_KEY` (auto-provisioned)

If any frontend variable is missing, the app renders a friendly configuration screen (`src/components/ConfigError.tsx`) instead of a white screen.

## Project structure

```
src/
  components/        UI + feature components (TripForm, ItineraryDisplay, Chatbot, ...)
  pages/             Routes (Index, Auth, Profile, SavedTrips, ...)
  integrations/
    supabase/        Auto-generated Supabase client + types (do not edit)
  lib/               env validator, destination helpers, image helpers
  contexts/          AuthContext
supabase/
  functions/
    chat/                  AI chatbot (Lovable AI Gateway, streaming)
    generate-itinerary/    Personality-aware itinerary generation
    refine-itinerary/      Conversational itinerary editing
  config.toml        Edge function config (verify_jwt = false for public functions)
```

## Edge functions

All three functions use `LOVABLE_API_KEY` to call `https://ai.gateway.lovable.dev/v1/chat/completions` with a Gemini model. They are deployed automatically by Lovable — no manual deploy step.

## Database

Managed by Lovable Cloud. Schema (profiles, saved trips, etc.) is created via migrations. Types regenerate into `src/integrations/supabase/types.ts` automatically.

## Common issues

- **White screen** → `.env` is missing or empty. See ENVIRONMENT_SETUP.md.
- **Itinerary generation fails with 402** → AI credits exhausted in Lovable Cloud workspace.
- **Itinerary generation fails with 429** → Rate-limited; retry shortly.
- **Edge function 401** → `verify_jwt` mismatch in `supabase/config.toml` or missing `Authorization` header.

## Security

- `.env` is git-ignored.
- Only publishable keys are exposed to the browser (`VITE_*`).
- Private secrets live in Supabase Edge Function secrets only.
- See `ENVIRONMENT_SETUP.md` for the full security checklist.
