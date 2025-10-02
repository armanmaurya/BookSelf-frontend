# Copilot Instructions for BookSelf Frontend

## Core architecture
- Monorepo managed with Turborepo (`turbo.json`) and npm workspaces; the main app lives in `apps/web` and ships a Next.js 14 App Router experience.
- UI is composed of local packages published under the `@bookself/*` scope (sidebar, loading, context menu, slate editor pieces, design tokens). Prefer reusing these before pulling external libraries.
- Data flows primarily through a Django-backed GraphQL API at `NEXT_PUBLIC_API_URL`, accessed via Apollo clients (`src/lib/ServerClient.ts` for SSR with cookies, `src/lib/apolloClient.ts` for client mutations/uploads).

## Local development & builds
- Install deps once at the repo root: `yarn install` (uses the workspace graph).
- Run the web app with env injection via Turborepo: `yarn dev:web`; alternatively `yarn workspace web run dev` skips Turbo.
- Production build uses `yarn build:web`; lint with `yarn lint`. Node `>=20.15.1` is required per `package.json`.
- Create `apps/web/.env` with at least `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GOOGLE_OAUTH2_CLIENT_ID`, and `NEXT_PUBLIC_GOOGLE_REDIRECT_URL_ENDPOINT`; analytics features also read `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

## Routing & page structure
- App Router segments group customer-facing pages under `src/app/(browser)` and lightweight embeds under `src/app/(webview)`; keep layout providers concentrated in the group layout files.
- Server components default to data fetching; mark interactive pieces with `"use client"` and colocate them in `src/components`.

## Data & state conventions
- Server GraphQL calls must flow through `createServerClient()` so `sessionid`/`csrftoken` cookies are forwarded; client code should use the shared Apollo client (already configured with upload support).
- REST endpoints are centralized in `src/app/utils.ts` (`API_ENDPOINT` map); reuse helpers like `getData`, `checklogin`, and `getGoogleAuthUrl` instead of hard-coding URLs.
- Global app state lives in React context providers: `ContextProvider` (UI chrome & auth probe), `UserProvider` (current user with `useUser()`), `ArticleProvider` (article editing). Wrap new routes with the appropriate provider before calling their hooks.
- Loading UX is standardized through `@bookself/react-loading`; retrieve the spinner API with `useLoading()` instead of custom spinners.

## UI & styling patterns
- Tailwind CSS is globally configured in `apps/web/tailwind.config.ts` with dark mode via class toggles; utility helpers should route through `cn` in `src/lib/utils.ts`.
- Shadcn UI primitives live in `src/components/ui`; extend them by editing those files or colocated wrappers (e.g. `ui/button.tsx`, `ui/card.tsx`).
- Shared navigation pieces come from `TopBar`, `SideNav`, and the `@bookself/react-sidebar` package; when adding menu items, update both the UI package (if structural) and the consuming component.

## Rich text & content tooling
- Editor-related functionality is split between `packages/slate-*` and local TipTap components; follow existing patterns in `packages/slate-editor/src` when adding blocks or marks.
- Markdown conversion helpers (`SlateToMarkdown`, `markdownTokenizer`) sit in `src/app/utils.ts`; reuse them for exports instead of introducing new parsers.

## Fetching patterns & examples
- Home feed (`src/app/(browser)/page.tsx`) shows the canonical pattern: guard unauthenticated users via cookies, fetch with Apollo, and render typed `ArticleCard`s.
- Notebook pages (`src/app/(browser)/user/[username]/notebook/[notebook]/page.tsx`) illustrate server-side GraphQL queries with route params—mirror this shape for other dynamic resources.
- Mutations that redirect (e.g. `NewArticleButton`) kick off loaders via `useLoading()` and navigate with `next/navigation`; keep that flow for consistency.

## Integration notes
- Google Analytics embeds through `components/GoogleAnalytics.tsx`; set the env var before assuming analytics APIs exist.
- External REST endpoints expect session cookies; ensure `credentials: "include"` is set on fetches and run locally against the Django backend (`python manage.py migrate` errors usually mean the backend stack isn't up).

## Contributor checklist for features
- Confirm new files respect the workspace alias (`@/`) rather than relative `../../` imports.
- Prefer colocating feature-specific types in `src/types` and import them into components/hooks for type safety.
- When touching shared packages under `packages/`, remember they're consumed by the app via workspaces—adjust exports in each package `src/index.ts` and bump usages accordingly.
