# New API Route

Create a new Next.js App Router API route handler.

## Requirements

- Read `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` before proceeding
- Create the file at `app/api/{{routePath}}/route.ts`
- Export named functions for each HTTP method needed: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- Validate all inputs at the handler boundary (use Zod for schema validation)
- Return `NextResponse.json()` with appropriate HTTP status codes
- Type the request body and response shapes
- Add error handling with try/catch, returning structured error responses
- Never expose internal error details to the client
- Keep handlers thin — delegate business logic to functions in `lib/`
- Always verify the user owns the resource being accessed

## Template

```ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Implementation
    return NextResponse.json({ data: null });
  } catch (error) {
    console.error("[API] GET /api/{{routePath}}:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    // Validate body with Zod
    // Implementation
    return NextResponse.json({ data: null }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/{{routePath}}:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```
