# New Page

Create a new Next.js App Router page.

## Requirements

- Read `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` before proceeding
- Create `app/{{routePath}}/page.tsx` as a Server Component (no `'use client'`) unless interactivity is needed
- If the page needs a unique layout, also create `app/{{routePath}}/layout.tsx`
- Create `app/{{routePath}}/loading.tsx` with a skeleton loading state
- Add metadata using `export const metadata` or `generateMetadata` for dynamic metadata
- Use Tailwind CSS 4 utility classes with the project's design system
- Follow TypeScript strict mode conventions
- Use `<Link>` from `next/link` for any internal links

## Template

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title — Smash Wise",
  description: "Page description",
};

export default function PageName(): React.ReactElement {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Page Title</h1>
        <p className="text-sm text-zinc-500">Page description</p>
      </div>
      {/* Page content */}
    </div>
  );
}
```

## Loading Template

```tsx
export default function Loading(): React.ReactElement {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      <div>
        <div className="h-8 w-48 rounded-lg bg-zinc-800" />
        <div className="mt-2 h-4 w-72 rounded bg-zinc-800" />
      </div>
      <div className="h-64 rounded-xl bg-zinc-800/50" />
    </div>
  );
}
```
