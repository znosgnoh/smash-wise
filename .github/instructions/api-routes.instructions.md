---
applyTo: "app/api/**"
---

# API Route Handler Guidelines (Next.js App Router)

- Export named HTTP method functions: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- Always validate request body and query params at the boundary (use Zod or similar)
- Return `NextResponse.json()` with appropriate status codes
- Handle errors with try/catch and return structured error responses:
  ```ts
  return NextResponse.json({ error: "message" }, { status: 400 })
  ```
- Use `server-only` imports for sensitive logic
- Never expose internal error details to clients
- Add rate limiting for public endpoints
- Validate authentication/authorization at the start of each handler
- Use TypeScript to type request and response shapes
- Keep route handlers thin — delegate business logic to service functions in `lib/`
