# Refactor

Improve code quality without changing external behavior.

## Workflow

1. **Identify**: What specific concern needs refactoring? (duplication, complexity, readability, performance)
2. **Plan**: Outline the changes before making them. Consider:
   - Can Server/Client Component boundaries be optimized?
   - Is there duplicated logic that can be extracted to `lib/`?
   - Are there components doing too many things that should be split?
   - Can types be tightened or shared?
3. **Execute**: Make changes incrementally. One concern per commit.
4. **Verify**: Ensure behavior is unchanged:
   - `pnpm lint` passes
   - `pnpm build` succeeds
   - Existing tests still pass

## Principles

- Extract shared logic into `lib/` utilities
- Extract shared UI into `app/_components/`
- Move `'use client'` boundaries lower in the tree when possible
- Replace `any` types with proper typing
- Use discriminated unions for variant states
- Prefer composition over prop drilling
- Keep files under ~200 lines — split if larger

## Project-Specific Refactoring

<!-- TODO: Add domain-specific refactoring notes -->
- Business logic should live in `lib/` — not in components
- Animation variants can be extracted to shared constants if reused
- Import animations from `motion/react` (not `framer-motion`)
- Shared types belong in `lib/` or `types/`
