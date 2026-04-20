---
applyTo: "**/*.css"
---

# Tailwind CSS 4 Guidelines

## Setup

- This project uses Tailwind CSS v4 with `@tailwindcss/postcss`
- Use `@import "tailwindcss"` at the top of the global CSS file
- Use `@theme` directive to define custom design tokens (colors, fonts, spacing)

## Rules

- Utility classes exclusively — avoid custom CSS unless Tailwind utilities genuinely cannot achieve the result
- No `@apply` in Tailwind v4 — compose utilities in component markup, extract to React components instead
- Use CSS custom properties (`var(--...)`) for theme values in the rare cases where inline styles are needed
- Use `@layer` for any custom CSS that must interact with Tailwind's cascade

## Design Tokens

<!-- TODO: Update these tokens to match your project's design system -->

- Background: `bg-[#0a0a0a]`
- Surface: `bg-white/[0.02]` with `border-white/5`
- Primary accent: `cyan-400/500`
- Secondary accent: `amber-400/500`
- Tertiary accent: `purple-400/500`
- Success: `emerald-400/500`
- Text: `text-zinc-100` (primary), `text-zinc-400/500` (secondary/muted)
- Glow effects: `shadow-[0_0_Xpx_rgba(R,G,B,A)]` or `drop-shadow-[0_0_Xpx_rgba()]`

## Responsive Design

- **Mobile-first approach:** Base styles target mobile → `sm:` → `md:` → `lg:` for progressive enhancement
- Use responsive utilities (`sm:`, `md:`, `lg:`) over media queries
- Max container width: `max-w-5xl` with `px-4` padding
- Touch targets: minimum `44×44px` — use `p-2.5` or `min-h-11 min-w-11` for interactive elements
- Typography scaling: Use `text-sm sm:text-base` or `text-2xl sm:text-3xl` patterns
- Grid patterns: Start `grid-cols-1` on mobile, expand with `sm:grid-cols-2` / `lg:grid-cols-3`
- Gaps: Use tighter gaps on mobile (`gap-2 sm:gap-4`)
- Padding: Compact on mobile (`p-4 sm:p-6`) for cards and sections

## Grouping Convention

Order utility classes: layout → spacing → sizing → typography → colors → borders → effects
