# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.
Product: **ClashLayoutsHub** — Clash of Clans base layout library.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, Tailwind CSS, Wouter router, TanStack Query
- **Auth**: Custom JWT (`clh_token`), Google OAuth backend flow
- **Captcha**: Cloudflare Turnstile (custom `TurnstileWidget.tsx`)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Important Constants

- `GOLD = "#D4AF37"` — brand gold color used throughout
- API server port: `8080`
- Admin auth key: `admin_token` in localStorage
- JWT key: `clh_token` in localStorage
- `SESSION_SECRET` env var for JWT signing; `ADMIN_EMAIL` controls `is_admin` flag

## Architecture Notes

- Dynamic sitemap at `/sitemap.xml` — proxied from API server (`GET /sitemap.xml` in `app.ts`)
- Static `public/sitemap.xml` is a fallback; dynamic version queries DB for approved base slugs
- `useSEO` hook: `src/hooks/useSEO.ts` — sets title, description, OG, Twitter, canonical
- Pages with SEO: `HomePage`, `BlogPage`, `BlogDetailPage`, `THPage`, `BaseDetailPage`
- Custom `TurnstileWidget.tsx` (NOT `@marsidev/react-turnstile` — causes React conflict)
- Google OAuth: pure backend flow; redirects to `/auth/callback?token=...&user=...`; `AuthCallbackPage` reads params

## Pre-launch Audit Status (COMPLETED)

- ✅ CoC-themed 404 page ("Village Not Found!", skull icon, gold theme, TH quick links)
- ✅ Mobile responsiveness — tested iPhone 15 Pro Max (390px) and desktop (1280px)
- ✅ Lazy loading — all `<img>` tags have `loading` attribute (lazy/eager as appropriate)
- ✅ LCP images: `BlogDetailPage` featured image has `loading="eager" fetchPriority="high"`
- ✅ Broken link fixed: `/my-submissions` → `/profile` in Header (both mobile + desktop menus)
- ✅ `useSEO` added to `HomePage` and `BlogPage`
- ✅ Dynamic sitemap endpoint at `/sitemap.xml` (API server, proxied through Vite)
