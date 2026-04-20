# Copilot Instructions — Smash Wise

## Product Vision

**Smash Wise** — Share badminton money and sweat

A shared expense tracker for a badminton friend group. Log expenses after each session, split costs among attendees, and see who owes whom at a glance. Built as a mobile-first web app for a single trusted group. See `docs/product-bible.md` for full product spec and `.github/skills/product-knowledge.md` for quick reference.

## Tech Stack

- **Runtime:** Node.js (pnpm as package manager)
- **Framework:** Next.js (App Router only — no Pages Router)
- **UI:** React with Server Components by default
- **Styling:** Tailwind CSS 4 (via `@tailwindcss/postcss`)
- **Animation:** Framer Motion (via `motion` package)
- **Language:** TypeScript (strict mode)
- **Linting:** ESLint flat config with `eslint-config-next`
- **Validation:** Zod for schemas
- **Database:** SQLite via Prisma (future: PostgreSQL)
- **Path alias:** `@/*` maps to project root

## Critical: Next.js Docs

Before writing any Next.js code, **always** read the relevant guide in `node_modules/next/dist/docs/` — your training data may be outdated. Key differences include new caching behavior, updated API signatures, and changed file conventions.

## Commands

| Task    | Command        |
| ------- | -------------- |
| Dev     | `pnpm dev`     |
| Build   | `pnpm build`   |
| Start   | `pnpm start`   |
| Lint    | `pnpm lint`    |
| Install | `pnpm install` |

Always run `pnpm install` before building after dependency changes. Always run `pnpm lint` before committing.

## Project Structure

```
app/              → App Router routes, layouts, pages
  layout.tsx      → Root layout
  page.tsx        → Home page
  globals.css     → Global styles / Tailwind imports
  _components/    → Shared UI components
lib/              → Shared utilities, business logic, types
public/           → Static assets
prisma/
  schema.prisma   → Database schema
```

<!-- TODO: Update this structure to match your project -->

### File Conventions

- **Pages:** `app/<route>/page.tsx`
- **Layouts:** `app/<route>/layout.tsx`
- **Loading UI:** `app/<route>/loading.tsx`
- **Error UI:** `app/<route>/error.tsx` (must be Client Component)
- **API routes:** `app/api/<route>/route.ts`
- **Server Actions:** `lib/actions/<domain>.ts` or `app/<route>/_actions/<domain>.ts`
- **Components:** `app/_components/` (shared) or `app/<route>/_components/` (colocated)
- **Libraries/utils:** `lib/` at project root
- **Types:** `types/` at project root or colocated `.types.ts` files
- **Hooks:** `hooks/` at project root

## Design System

### Visual Direction

- **Theme:** Dark mode primary
- **Background:** `#0a0a0a`
- **Accent colors:** `cyan-400/500` (primary), `amber-400/500` (secondary highlights), `purple-400/500` (tertiary)
- **Typography:** Geist Sans (variable `--font-geist-sans`), Geist Mono for code
- **Effects:** Subtle glows, gradient text, backdrop blur, smooth Framer Motion transitions
- **Layout:** Max-width `5xl` (1024px), centered with `px-4`
- **Responsive:** Mobile-first design; base styles target mobile, `sm:` / `md:` / `lg:` for progressive enhancement

<!-- TODO: Customize these design tokens to match your brand -->

## Coding Standards

### TypeScript

- Enable and respect `strict: true` — no `any` types
- Prefer `interface` for extendable object shapes; `type` for unions/intersections
- Explicit return types on exported functions
- `unknown` over `any`; narrow with type guards or Zod
- `as const` for literal constants and exhaustive switch patterns

### React & Next.js

- **Server Components by default** — only `'use client'` for state/effects/events/browser APIs
- Keep `'use client'` boundaries as low in the tree as possible
- `<Link>` for navigation, `<Image>` for images, Metadata API for SEO
- Fetch data in Server Components; pass to Client Components as props
- Server Actions (`'use server'`) for mutations — validate with Zod
- `loading.tsx` + `<Suspense>` for streaming
- `error.tsx` (Client Component) for error boundaries
- Route Handlers (`route.ts`) for API endpoints — never call from Server Components
- **Viewport** must be a separate `export const viewport: Viewport` — never inside `metadata`
- `suppressHydrationWarning` on `<html>` to silence `next/font` class hash mismatches in dev

### Framer Motion

- Import from `motion/react` (not `framer-motion`)
- Use `motion.div` for animated elements
- Prefer `initial`/`animate`/`exit` pattern with `AnimatePresence`
- Use `layout` prop for layout animations
- Keep animations subtle and purposeful — 0.3–0.8s duration
- Use `whileHover`/`whileTap` for interactive feedback

### Tailwind CSS 4

- Utility classes exclusively — avoid custom CSS
- `@theme` directive for design tokens
- **Mobile-first:** Base styles target mobile; use `sm:` / `md:` / `lg:` for larger screens
- Group: layout → spacing → typography → colors → effects
- No `@apply` in Tailwind v4 — extract to components instead

### General

- Named exports (except pages/layouts which require default)
- Early returns to reduce nesting
- One component per file
- Colocate tests, types, utilities near related code
- `const` over `let`; never `var`
- Template literals over concatenation
- `??` and `?.` over manual null checks
- Validate at system boundaries (API, forms, URL params)

### Accessibility

- Keyboard accessible interactive elements
- Semantic HTML (`<nav>`, `<main>`, `<button>`, etc.)
- Meaningful `alt` text; `alt=""` for decorative images
- Labels for all form inputs
- WCAG AA contrast ratios

### Performance

- Minimize `'use client'` surface area
- `next/dynamic` for heavy client components
- `<Suspense>` for streaming
- `loading.tsx` for route-level loading states
- Proper `revalidate` values for cached data

### Security

- Never expose secrets — only `NEXT_PUBLIC_` env vars on client
- Validate/sanitize all user inputs server-side
- `server-only` package for server-exclusive modules
- CSRF protection for mutations
- Content Security Policy headers in production
- Sanitize dynamic content to prevent XSS

---

## Automatic Agent & Resource Routing

This project has specialized agents, prompts, skills, checklists, and instructions. **Use them automatically** — do not wait for the user to mention them by name. Match the task to the right resource and invoke it.

### Decision Matrix — Agents

Detect the user's intent and **delegate to the matching agent via `runSubagent`**. Multiple agents can be used in sequence for complex tasks.

| When the user wants to…                                        | Invoke agent            |
| -------------------------------------------------------------- | ----------------------- |
| Review code / get a PR review                                  | `code-reviewer`         |
| Optimize performance, bundle size, Core Web Vitals             | `perf-optimizer`        |
| Write marketing copy, app text, notification wording           | `copywriter`            |
| Design UI/UX, layouts, visual patterns, component styling      | `ui-ux-designer`        |
| Audit accessibility, WCAG compliance, screen reader support    | `a11y-auditor`          |
| Plan sprints, prioritize features, write user stories          | `product-manager`       |
| Write tests, define test strategy, create test plans           | `qa-engineer`           |
| Design system architecture, scalability, tech decisions        | `tech-architect`        |
| Set up CI/CD, deployment, Docker, monitoring                   | `devops-engineer`       |
| Analyze metrics, retention, engagement, A/B tests              | `data-analyst`          |
| Plan growth strategy, acquisition, conversion funnels          | `growth-hacker`         |

<!-- TODO: Add domain-specific agents as needed (e.g., game-designer, ml-engineer) -->

**Multi-agent workflows** — For large features, chain agents:
1. `product-manager` → define the feature spec
2. `ui-ux-designer` → design the interface
3. Implement the code (use instructions + skills as context)
4. `code-reviewer` → review the implementation
5. `qa-engineer` → validate with tests
6. `a11y-auditor` → audit accessibility

### Decision Matrix — Prompts

When the user's request matches a prompt template, **read the prompt file** from `.github/prompts/` and follow its workflow step-by-step.

| When the user wants to…                               | Read & follow prompt                      |
| ------------------------------------------------------ | ----------------------------------------- |
| Refine a product idea into a full product bible        | `product-idea.prompt.md`                  |
| Create a new React component                           | `new-component.prompt.md`                 |
| Create a new page/route                                | `new-page.prompt.md`                      |
| Create a new API route                                 | `new-api-route.prompt.md`                 |
| Create a new server action                             | `new-server-action.prompt.md`             |
| Write a feature spec / PRD                             | `feature-spec.prompt.md`                  |
| Fix a bug or diagnose an issue                         | `fix-issue.prompt.md`                     |
| Refactor existing code                                 | `refactor.prompt.md`                      |
| Plan a sprint or break down work                       | `sprint-planning.prompt.md`               |
| Write landing page copy                                | `landing-page.prompt.md`                  |
| Create a pitch deck / investor materials               | `pitch-deck.prompt.md`                    |
| Plan or conduct user research                          | `user-research.prompt.md`                 |

### Decision Matrix — Skills (Context Enrichment)

Skills are **reference knowledge** — read them to enrich your context before generating code or making decisions. Load the relevant skill file(s) from `.github/skills/` automatically.

| When working on…                                       | Load skill                |
| ------------------------------------------------------ | ------------------------- |
| Colors, typography, spacing, component styling         | `design-system.md`        |
| Product positioning, terminology, target users, phases | `product-knowledge.md`    |

<!-- TODO: Add domain-specific skills as needed -->

**Always load `product-knowledge.md`** when the user asks about the product, discusses product direction, or needs terminology guidance.

**Always load `design-system.md`** before creating or styling any UI component.

### Decision Matrix — Checklists

Run through the relevant checklist automatically at the right moment. Read the checklist from `.github/checklists/` and verify each item.

| Trigger                                                 | Run checklist             |
| ------------------------------------------------------- | ------------------------- |
| User says "commit", "push", or code is ready to save   | `pre-commit.md`           |
| A new feature is complete / ready for review            | `new-feature.md`          |
| User asks about launch, deploy, or going live           | `launch-readiness.md`     |

**Pre-commit is mandatory** — Always run through `pre-commit.md` before finalizing any code change, even if the user doesn't ask. Mention any failing items.

### Combining Resources

Most tasks benefit from **layering multiple resources**. Examples:

- **"Create the settings page"** →
  1. Load `product-knowledge.md` + `design-system.md` (skills)
  2. Read `new-page.prompt.md` (prompt workflow)
  3. Delegate visual design to `ui-ux-designer` if complex (agent)
  4. Run `new-feature.md` + `pre-commit.md` checklists when done

- **"Review my PR"** →
  1. Delegate to `code-reviewer` (agent)
  2. Then `a11y-auditor` for accessibility (agent)
  3. Then `perf-optimizer` for performance (agent)
  4. Run `pre-commit.md` checklist on findings

### Rules for Auto-Routing

1. **Don't ask permission** — detect intent and route automatically
2. **Layer resources** — most tasks need 2-4 resources combined
3. **Skills are context, not actions** — always read them before generating; never skip
4. **Checklists are gates** — run them at completion points, not mid-work
5. **Agents are specialists** — delegate when domain expertise matters
6. **Prompts are workflows** — follow their step-by-step structure for scaffolding tasks
7. **Instructions are rules** — they auto-apply via `applyTo` patterns; do not ignore them
8. **When in doubt, over-include** — loading an extra skill or running an extra checklist costs nothing
