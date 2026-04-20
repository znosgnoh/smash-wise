---
applyTo: "**/*.tsx"
---

# React/TSX Component Guidelines

## Server vs Client Components

- Components are **Server Components by default**. Only add `'use client'` at the top when the component needs:
  - State (`useState`, `useReducer`)
  - Effects (`useEffect`, `useLayoutEffect`)
  - Event handlers (`onClick`, `onChange`, `onSubmit`)
  - Browser APIs (`window`, `localStorage`, `navigator`)
  - Custom hooks that use any of the above

- Keep `'use client'` boundaries as low in the component tree as possible. Extract interactive pieces into small Client Components and keep the parent as a Server Component.

## Component Structure

- Use explicit return types on exported components: `export function Component(): React.ReactElement`
- Prefer function declarations (`function MyComponent()`) over arrow functions for components
- Props interfaces must be defined above the component and named `<ComponentName>Props`
- Never use `index.tsx` as a component file name outside of route files — name files after the component
- One component per file, named in PascalCase matching the filename

## Imports & Navigation

- Use `<Link>` from `next/link` for internal navigation — never `<a>` tags
- Use `<Image>` from `next/image` for all images
- Use the Metadata API for `<head>` management
- Import motion from `motion/react` (NOT `framer-motion`)

## Styling

- Use Tailwind CSS utility classes exclusively
- **Mobile-first:** Base styles target mobile, use `sm:` / `md:` / `lg:` for progressive enhancement
- Group utilities: layout → spacing → sizing → typography → colors → effects
- Touch targets: minimum `44×44px` (`p-2.5` or `min-h-11 min-w-11`) for tappable elements on mobile

## Animation Patterns

- Use `motion.div` with `initial`/`animate`/`exit` for enter/exit animations
- Wrap conditional renders in `<AnimatePresence>`
- Use `layout` prop for smooth layout shifts
- Use `whileHover`/`whileTap` for interactive feedback
- Keep durations between 0.3–0.8s for subtlety
- Use spring physics for bouncy/celebration effects

## Accessibility

- All `<button>` elements must have visible text or `aria-label`
- Interactive elements need keyboard support and focus indicators
- Use semantic HTML: `<nav>`, `<main>`, `<section>`, `<button>`
- Dynamic content updates should use `aria-live` regions
