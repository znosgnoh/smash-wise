---
applyTo: "prisma/**,lib/prisma*,app/generated/**"
---

# Prisma & Database Guidelines

## Setup

- Database: PostgreSQL (Vercel Postgres / Neon)
- Schema: `prisma/schema.prisma`
- Config: `prisma.config.ts` (Prisma 7 — URLs go here, not in schema)
- Generated client: `app/generated/prisma`

## Schema Conventions

- Use `cuid()` for primary key IDs
- Use `@updatedAt` for automatic update timestamps
- Use `@default(now())` for creation timestamps
- Add `@@index` for frequently queried fields
- Use `onDelete: Cascade` for parent-child relationships

## Client Usage

- Import from `@/app/generated/prisma` (generated output path)
- Create a singleton Prisma client in `lib/prisma.ts`
- Use `server-only` package to prevent client-side imports
- Always handle Prisma errors gracefully — never expose raw DB errors to users

## Migrations

- Run `pnpm prisma migrate dev --name <description>` for schema changes
- Run `pnpm prisma generate` after schema changes to regenerate client
- Migration names should be descriptive: `add-user-model`, `add-post-status`
- Never manually edit migration SQL files

## Query Patterns

- Use `select` to limit returned fields when not all columns are needed
- Use `include` sparingly — prefer explicit `select` for nested relations
- Use transactions for multi-table mutations
- Add pagination (`skip`/`take`) for list queries
