---
applyTo: "**/*.ts"
---

# TypeScript Guidelines

## Strict Mode

- Strict mode is enabled — respect all strict checks
- No `any` types — use `unknown` and narrow with type guards or Zod schemas

## Type Definitions

- Prefer `interface` for extendable object shapes; use `type` for unions, intersections, tuples, and mapped types
- Name types in PascalCase with descriptive nouns
- Use discriminated unions for state machines and variant types
- Prefer `as const` assertions for literal objects and arrays
- Use `satisfies` operator to validate types while preserving inference

## Functions

- Use explicit return types on all exported functions
- Prefer `readonly` for arrays and properties that shouldn't be mutated
- Handle `null` and `undefined` explicitly — no silent coercion

## Validation

- Validate all external data at system boundaries with Zod
- Define Zod schemas alongside their inferred types: `type X = z.infer<typeof XSchema>`
- Use `.safeParse()` for graceful error handling, `.parse()` only when errors should throw
