# New Server Action

Create a new Server Action for form mutations or data operations.

## Requirements

- Read `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md` before proceeding
- Add `"use server"` at the top of the file
- Place in `app/<route>/_actions/` or `lib/actions/`
- Validate all inputs with Zod schemas before processing
- Return typed results — never throw from actions consumed by `useActionState`
- Use `revalidatePath()` or `revalidateTag()` to refresh cached data after mutations
- Verify authentication and authorization inside each action
- Keep the file focused — one logical action group per file

## Template

```ts
"use server";

import { revalidatePath } from "next/cache";

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function createItem(formData: FormData): Promise<ActionResult> {
  // 1. Validate input
  const rawData = {
    name: formData.get("name"),
  };

  // 2. Validate with Zod schema
  // const parsed = schema.safeParse(rawData);
  // if (!parsed.success) return { success: false, error: "Invalid input" };

  // 3. Authenticate / Authorize
  // 4. Perform mutation
  // 5. Revalidate
  revalidatePath("/items");

  return { success: true };
}
```
