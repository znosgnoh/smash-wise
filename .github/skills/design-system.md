# Smash Wise Design System Skill

Use this skill when creating or updating any UI component. It contains the complete design token reference and component patterns.

<!-- TODO: Fill in your project's specific design tokens and component patterns -->

## Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0a0a0a` | Page background |
| Surface | `zinc-900` / `zinc-900/50` | Card backgrounds, modals |
| Border | `zinc-800` | Subtle dividers, card borders |
| Text Primary | `zinc-100` | Headings, body text |
| Text Secondary | `zinc-400` | Labels, descriptions |
| Text Muted | `zinc-500` | Timestamps, metadata |
| Primary | `cyan-400` / `cyan-500` | Key actions, progress, links |
| Secondary | `amber-400` / `amber-500` | Highlights, badges |
| Tertiary | `purple-400` / `purple-500` | Gradients, accents |
| Success | `green-400` / `green-500` | Positive states |
| Danger | `red-400` / `red-500` | Delete, destructive |

## Glow Effects

```
shadow-[0_0_15px_rgba(R,G,B,0.3)]    // Adjust RGB values to match accent colors
```

## Typography

- **Font**: Geist Sans (`var(--font-geist-sans)`)
- **Headings**: `text-2xl font-bold` to `text-4xl font-bold`
- **Gradient text**: `bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent`
- **Body**: `text-sm` to `text-base`, `text-zinc-300`
- **Labels**: `text-xs uppercase tracking-wider text-zinc-500`

## Layout

- **Max width**: `max-w-5xl mx-auto`
- **Page padding**: `px-4`
- **Section gap**: `space-y-8` or `gap-8`
- **Card padding**: `p-4 sm:p-6`
- **Card style**: `bg-zinc-900/50 border border-zinc-800 rounded-xl backdrop-blur`

## Responsive Patterns

- **Mobile-first:** Base styles target mobile, use `sm:` / `md:` / `lg:` breakpoints
- **Typography:** Scale headings `text-2xl sm:text-3xl`, body `text-xs sm:text-sm`
- **Grids:** Start `grid-cols-1`, expand `sm:grid-cols-2`, `lg:grid-cols-3`
- **Gaps/Padding:** Compact on mobile: `gap-2 sm:gap-4`, `p-4 sm:p-6`
- **Touch targets:** Minimum `44×44px` for all tappable elements

## Animation Patterns (Framer Motion)

```tsx
// Fade in from below
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}

// Staggered children
variants={{
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}}

// Interactive feedback
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

## Component Patterns

### Card
```tsx
<div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 backdrop-blur">
  {children}
</div>
```

### Badge
```tsx
<span className="px-2 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400">
  {label}
</span>
```

### Button Primary
```tsx
<button className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-medium hover:bg-cyan-400 transition-colors">
  {label}
</button>
```

### Section Header
```tsx
<h2 className="text-xl font-bold text-zinc-100">{title}</h2>
<p className="text-sm text-zinc-400">{description}</p>
```
