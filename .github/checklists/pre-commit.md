# Pre-Commit Checklist

Run through this before every commit.

## Code Quality
- [ ] `pnpm lint` passes with zero warnings
- [ ] `pnpm build` succeeds
- [ ] No `console.log` left in committed code (use `console.error` for actual errors only)
- [ ] No `any` types — use proper typing or `unknown` with narrowing
- [ ] No unused imports or variables

## UI / Design
- [ ] UI matches design system — correct colors, spacing, typography
- [ ] Animations import from `motion/react` (not `framer-motion`)
- [ ] Interactive elements have hover/tap feedback
- [ ] Text is readable (WCAG AA contrast)

## Architecture
- [ ] Server Components by default — `'use client'` only when truly needed
- [ ] `'use client'` boundary is as low in the tree as possible
- [ ] No business logic in components — extract to `lib/`
- [ ] New shared types added to appropriate type files

## Accessibility
- [ ] Semantic HTML (`<button>`, `<nav>`, `<main>`, not div-soup)
- [ ] All interactive elements keyboard accessible
- [ ] `alt` text on meaningful images; `alt=""` on decorative
- [ ] Form inputs have associated labels
