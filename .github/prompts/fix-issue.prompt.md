# Fix Issue

Diagnose and fix a bug or issue in the codebase.

## Workflow

1. **Understand**: Read the error message or description carefully. Identify the affected file(s).
2. **Reproduce**: Locate the relevant code. Check the component tree, data flow, and recent changes.
3. **Diagnose**: Trace the root cause — don't just fix symptoms. Check:
   - TypeScript type mismatches
   - Missing `'use client'` directive on interactive components
   - Incorrect import paths (use `@/` alias)
   - Server/client boundary violations (passing non-serializable props)
   - Missing `await` on `params` or `searchParams` (Next.js requirement)
   - Stale cache or missing revalidation
4. **Fix**: Make the minimal change needed. Don't refactor unrelated code.
5. **Validate**: Run `pnpm lint` and `pnpm build` to verify the fix doesn't introduce new issues.

## Common Next.js Pitfalls

- `params` and `searchParams` are **Promises** in pages/layouts — must `await` them
- Read `node_modules/next/dist/docs/` for the correct API if unsure
- Server Components cannot use hooks, state, or event handlers
- Client Components cannot use `async/await` at the component level

## Project-Specific Checks

<!-- TODO: Add your project-specific debugging checks here -->
- Verify state management hooks are used inside the correct provider tree
- Check that animations import from `motion/react`, not `framer-motion`
- Ensure dark theme colors are maintained — no light mode leaking
