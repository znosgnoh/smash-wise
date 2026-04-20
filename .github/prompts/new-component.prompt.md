# New Component

Create a new React component following project conventions.

## Requirements

- Read `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` before deciding on Server vs Client Component
- Default to **Server Component** unless interactivity is required
- If interactivity is needed, add `'use client'` at the very top and keep the client boundary as small as possible
- Define a `Props` interface above the component named `<ComponentName>Props`
- Use named export (e.g. `export function MyComponent()`)
- Use Tailwind CSS 4 utility classes — no custom CSS
- Follow the project's design system (see `.github/skills/design-system.md`)
- Place the file in `app/_components/` or colocated in the relevant route as `_components/`
- One component per file, named after the component in PascalCase
- If the component is animated, import from `motion/react`

## Template (Server Component)

```tsx
interface {{ComponentName}}Props {
  // Define props here
}

export function {{ComponentName}}({}: {{ComponentName}}Props): React.ReactElement {
  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

## Template (Client Component with Animation)

```tsx
"use client";

import { motion } from "motion/react";

interface {{ComponentName}}Props {
  // Define props here
}

export function {{ComponentName}}({}: {{ComponentName}}Props): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/5 bg-white/[0.02]"
    >
      {/* Component content */}
    </motion.div>
  );
}
```
