# New Feature Checklist

Follow this when shipping any new feature.

## Before Starting
- [ ] Feature is documented (in a feature spec or issue)
- [ ] Acceptance criteria are clear and testable
- [ ] Design tokens referenced from `.github/skills/design-system.md`

## Implementation
- [ ] Read relevant Next.js docs in `node_modules/next/dist/docs/` if using new APIs
- [ ] Types defined first — interfaces for data shapes, types for unions
- [ ] Server Components for data fetching, Client Components for interactivity
- [ ] Zod validation at system boundaries (forms, APIs, URL params)
- [ ] Loading states: `loading.tsx` for routes, `<Suspense>` for sections
- [ ] Error states: `error.tsx` for routes, graceful fallbacks in components

## Visual Quality
- [ ] Matches project design system
- [ ] Entry animations on page/section load (fade in, slide up)
- [ ] Feedback animations on user actions (press, complete)
- [ ] Responsive: looks good from 375px to 1280px+
- [ ] Empty states are designed (not just blank space)

## Pre-Ship
- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds
- [ ] Tested on Chrome + Safari (minimum)
- [ ] Keyboard navigation works end-to-end
- [ ] No console errors or warnings
- [ ] Feature is useful — would YOU want to use it?
