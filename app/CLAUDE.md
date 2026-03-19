# App Architecture Guidelines

## Frontend / Backend Separation

**The most important rule: frontend components never import from `lib/` directly.**

All backend logic lives in `lib/`. The only way frontend accesses it is through an API route in `app/api/`.

```
Browser (React component)
  → fetch("/api/users")
    → app/api/users/route.ts     ← the only bridge
      → lib/users.ts             ← business logic lives here
        → database / external services
```

If you're in a component and you're about to import something from `lib/`, stop. Create an API route instead.

---

## Frontend — Components

### Where components live

```
components/
  Button/
    Button.tsx
    index.ts          # re-exports Button
  Card/
    Card.tsx
    index.ts
  ...
app/
  [route]/
    components/       # components used ONLY by this route
      HeroSection/
        HeroSection.tsx
        index.ts
```

- **Shared components** (used in 2+ places) → `components/` at the root
- **Route-specific components** (used in only one place) → `app/[route]/components/`
- Each component gets its own folder so it can grow (add a `types.ts`, sub-components, etc.) without cluttering other files
- `index.ts` re-exports the component so imports stay clean: `import { Button } from "@/components/Button"`

### Component rules

- One component per file
- Props interface at the top of the file, named `[ComponentName]Props`
- Use early returns for conditional rendering
- If a component exceeds ~80 lines, break it into smaller components
- Never fetch data directly inside a component — use a custom hook or pass data as props

---

## Backend — `lib/`

`lib/` contains all business logic: database queries, external API calls, data transformations, validation.

```
lib/
  users.ts          # user-related logic
  products.ts       # product-related logic
  utils/
    formatDate.ts
    parseQuery.ts
```

### Rules for `lib/`

- Functions are pure where possible — take inputs, return outputs, no side effects
- No `"use client"` — `lib/` is always server-side
- Never import React or any UI code
- Each file focused on one domain (users, orders, products — not a giant `utils.ts`)
- Always export named functions, never defaults

---

## API Routes — `app/api/`

API routes are the only bridge between frontend and `lib/`. Keep them thin — they should validate input, call a `lib/` function, and return the result.

```ts
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/lib/users";
import type { GetUserResponse } from "./types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<GetUserResponse>> {
  const user = await getUserById(params.id);

  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
```

### Rules for API routes

- Validate and sanitize all inputs before passing to `lib/`
- Return consistent response shapes — always `{ data }` or `{ error }`
- Use appropriate HTTP status codes
- Types for request/response shapes go in `app/api/[endpoint]/types.ts`
