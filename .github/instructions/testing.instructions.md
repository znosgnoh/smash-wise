---
applyTo: "**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx"
---

# Testing Guidelines

- Use descriptive test names that explain the expected behavior: `it('renders the title when data is loaded')`
- Follow Arrange-Act-Assert pattern
- Test behavior, not implementation details — avoid testing internal state
- Mock external dependencies (API calls, database), not internal modules
- For React components, prefer `@testing-library/react`:
  - Query by role, label, or text — not by CSS class or test ID
  - Use `screen` for queries
  - Use `userEvent` over `fireEvent` for user interactions
- Keep test files colocated with source files or in a `__tests__/` directory next to them
- One test file per module/component
