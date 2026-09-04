# SprintDesk Marketing Website

Premium product-led marketing website for SprintDesk, showing the path from personal capture to coordinated team execution.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/sprintdesk-marketing/src/App.tsx` — marketing routes, product demonstrations, metadata, and shared shell
- `artifacts/sprintdesk-marketing/src/index.css` — dark-first SprintDesk visual system and responsive styles
- `artifacts/sprintdesk-marketing/public/robots.txt` — crawler rules
- `artifacts/sprintdesk-marketing/public/sitemap.xml` — public marketing URL map
- `.agents/skills/sprintdesk-frontend-experience/SKILL.md` — frontend/design authority
- `.agents/skills/sprintdesk-seo-content-system/SKILL.md` — SEO/content authority
- Always apply both SprintDesk skills when extending the marketing site.

## Architecture decisions

- The first build is a frontend-only marketing app; product demonstrations use local interactive state rather than invented backend data.
- Wouter routes all public marketing, resource, and legal paths through one shared shell.
- The homepage and feature routes use product UI as the primary explanatory asset, with the personal-focus × team-execution workflow as the narrative spine.
- Metadata and JSON-LD are updated per route from the same React surface to keep page intent and visible content aligned.

## Product

- Product-led SprintDesk homepage and capability library
- Capture Inbox, triage, personal/team workspace, Sprint Board, calendar, Command Center, and automation demonstrations
- How-it-works workflow narrative
- Audience-specific manager, remote-team, and individual solution pages
- Pricing, blog, guides, templates, article, and legal routes

## User preferences

No additional preferences recorded.

## Gotchas

- The marketing site is rooted at `/`; keep route links compatible with the artifact base path.
- Keep marketing claims aligned with the approved SprintDesk product prompt and avoid adding unverified integrations, metrics, testimonials, or AI capabilities.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
