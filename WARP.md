# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project summary
This is a Vite + React + TypeScript single-page app for the “Oppo-JA / MaxwellConnect” job marketplace. Data persistence and auth are handled via Supabase (no separate backend in this repo).

## Common commands
All commands below are run from the repo root.

### Install
- Install deps: `npm install`

### Run the app (dev)
- Start dev server: `npm run dev`
  - Vite is configured to run on port **3000** (see `vite.config.ts`).

### Build / preview
- Production build: `npm run build`
  - Output directory is `docs/` (configured for GitHub Pages).
- Preview production build: `npm run preview`

### Typecheck
There is no dedicated npm script for typechecking; use:
- `npx tsc --noEmit`

### Lint / tests
- No linter or test runner is currently configured (no `lint`/`test` scripts in `package.json`).

## Environment / configuration
- `GEMINI_API_KEY` is expected in `.env.local` (used by Vite `define` in `vite.config.ts` to populate `process.env.GEMINI_API_KEY`).
- Supabase client expects Vite-style env vars:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  (see `lib/supabaseClient.ts`)

### Supabase schema setup (required for the data layer)
The app expects tables, RLS policies, and an auth trigger to exist in the Supabase project.
- Run `supabase-schema.sql` in the Supabase SQL Editor.
  - This creates the tables and the `on_auth_user_created` trigger that `api/auth.ts` relies on to auto-create `public.users` rows.

### If you see TypeScript errors in `/api`
See `TYPESCRIPT_ERRORS.md`. In short: if the API files show “`never`”/overload TypeScript errors, the project expects the Supabase schema to be created and types to line up with it; the code currently uses `as any` in a few places as a workaround.

## High-level architecture
### App entrypoints
- `index.html` mounts `#root` and loads `index.tsx`.
- `index.tsx` sets up a simple React error boundary and renders `App`.
- `App.tsx` contains most of the UI and page logic in a single file (many “sub-components” and page components are defined inline).

### UI layout and navigation
- `components/Layout.tsx` is the shared chrome (top nav, mobile menu, footer) and performs role-based nav filtering.
- Navigation appears to be driven by an in-memory “page” state in `App.tsx` (no router library).

### Data layer (Supabase)
- `lib/supabaseClient.ts` creates the `supabase` client and exports `isSupabaseConfigured()` for runtime diagnostics.
- `/api/*.ts` is the application’s data-access layer. `App.tsx` imports these modules and calls them directly.
  - `api/auth.ts`: Supabase Auth sign-up/sign-in/sign-out, profile fetch/update, auth-state subscription.
  - `api/jobs.ts`: `job_listings` queries and mutations.
  - `api/applications.ts`: `applications` table operations.
  - `api/verifications.ts`: `verification_requests` workflow.
  - `api/savedJobs.ts`: `saved_jobs` bookmarking.
  - `api/admin.ts`: admin/CEO aggregations and a few demo-only operations.

### Database schema and its implications
- `supabase-schema.sql` is the source-of-truth schema for the Supabase project:
  - Creates `users`, `job_listings`, `applications`, `verification_requests`, `saved_jobs`.
  - Enables RLS and defines policies for typical access patterns (self-service user data, business-owned jobs/apps, admin verification queue).
  - Defines `public.handle_new_user()` and an `auth.users` trigger (`on_auth_user_created`) to auto-create a row in `public.users` from auth metadata.
    - `api/auth.ts` assumes this trigger exists and waits briefly after sign-up before fetching the profile.

### Types and “UI ↔ DB” shape conversions
- `types.ts` contains UI-facing enums and interfaces (e.g. `JobType` values like `"Full-time"`).
- `types/database.ts` contains Supabase table typings used by `lib/supabaseClient.ts`.
- Several API calls convert between UI enums and DB enum-like strings, e.g. `JobType` ↔ `job_listings.type` via `toLowerCase().replace('-', '_')` (see `api/jobs.ts`).

### Styling
- Tailwind is configured via `tailwind.config.js` with custom `brand` and `jamaica` color palettes.
- Global styles live in `index.css`.