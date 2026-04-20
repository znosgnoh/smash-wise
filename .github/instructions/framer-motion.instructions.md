---
applyTo: "**/*.tsx"
---

# Framer Motion Animation Guidelines

## Import

- Always import from `motion/react` — NOT from `framer-motion`
- Import only what you need: `motion`, `AnimatePresence`, `useAnimate`, `useInView`

## Core Patterns

### Enter/Exit Animations

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
/>
```

### Conditional Rendering with AnimatePresence

```tsx
<AnimatePresence>
  {show && (
    <motion.div
      key="unique-key"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  )}
</AnimatePresence>
```

### Interactive Feedback

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
/>
```

### Layout Animations

```tsx
<motion.div layout>
  {/* Content that changes size/position */}
</motion.div>
```

## Performance

- Use `layout` prop sparingly — it causes reflows
- Prefer `transform` properties (scale, rotate, x, y) over layout properties (width, height)
- Set `will-change: transform` via className for frequently animated elements
- Keep animation durations between 0.3–0.8s — respect user motion preferences
- On mobile, prefer shorter durations (0.2–0.5s) to feel snappy on lower-powered devices

## Responsive Animation

- Keep animations subtle on mobile — avoid heavy entrance animations that block content visibility
- Use `whileTap` instead of `whileHover` for mobile touch feedback (hover doesn't exist on touch)

## Accessibility

- Respect `prefers-reduced-motion` — use `useReducedMotion()` hook or CSS media query
- Ensure animated content is accessible to screen readers via `aria-live` regions
- Modal animations must trap focus and return focus on close
