## Project Overview

Scout is a Chewy product — an AI-powered pet care companion app.

**What it does:**

- Pet owners add their pets (name, breed, age, photo)
- The app generates an AI avatar of the pet (fal.ai → Supabase storage)
- Daily tracker: owners log food, play, and medicine each day (streak + progress UI)
- AI recommendations: ranked toys and food products from the Chewy catalog, personalized to the pet
- AI health insights: weekly summary card (food trend, exercise streak, med compliance) powered by an LLM
- Sitter invite: owners can share a scoped link so a pet sitter can log daily activity

**Tech stack highlights:**

- Frontend: Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui
- Backend: Supabase (Postgres + RLS + Storage), Next.js API routes
- AI: fal.ai for avatar generation, OpenRouter/Groq LLM for recommendations + health insights

**Phase 1 (Mar 23–27):** UI built against local mock data — no real API calls
**Phase 2 (Mar 30–Apr 6):** Wire frontend to real Supabase + AI endpoints
**Phase 3 (Apr 6–13):** Polish, demo prep, presentation

---

# Scout — Claude Code Guidelines

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Package manager:** pnpm
- **Secrets:** Doppler CLI
- **Deploy:** Vercel via `pnpm deploy:prod`

## Branches

- `development` — daily work happens here
- `main` — production; always go through a PR

**Never push directly to `development` or `main`.** Always create a new branch and open a PR.

```bash
git checkout development
git pull
git checkout -b your-feature-name
```

## Before Committing

Always run these before pushing:

```bash
pnpm lint         # ESLint — must pass with no errors
```

Prettier runs automatically on commit via Husky. ESLint is also enforced at commit time — fix any errors before pushing.

## Commands

```bash
pnpm dev          # start local dev server
pnpm lint         # run ESLint
pnpm deploy:prod  # deploy to production
```

---

## Code Philosophy

**The most important thing: write code that anyone on the team can read and understand in seconds.**

### Readability over cleverness

- **Never** sacrifice clarity for brevity or "elegance"
- If you're proud of how clever a line is, rewrite it
- An intern dev should be able to understand any function without asking for help

### Use early returns

Handle edge cases and errors at the top of the function, then write the happy path at the bottom with no extra nesting.

```ts
// ✅ Good — problems handled first, logic is flat
function getUsername(user: User | null): string {
  if (!user) {
    return "Guest";
  }
  if (!user.name) {
    return "Unknown";
  }
  return user.name;
}

// ❌ Bad — nested conditions, harder to follow
function getUsername(user: User | null): string {
  if (user) {
    if (user.name) {
      return user.name;
    } else {
      return "Unknown";
    }
  } else {
    return "Guest";
  }
}
```

### Make code skimmable

- **One concept per line** — don't chain multiple operations together
- **Descriptive names** — `filteredActiveUsers` beats `data2`
- **Small functions** — if a function is longer than ~30 lines, break it up
- **Blank lines between logical steps** — whitespace is free, use it

```ts
// ✅ Good — each step is obvious
const activeUsers = users.filter((user) => user.isActive);
const sortedUsers = activeUsers.sort((a, b) => a.name.localeCompare(b.name));
const userNames = sortedUsers.map((user) => user.name);

// ❌ Bad — one line, nothing is skimmable
const userNames = users
  .filter((u) => u.isActive)
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((u) => u.name);
```

### Avoid cleverness

- No one-liners that require a second read
- Avoid ternary chains (`a ? b : c ? d : e`)
- Avoid tricks, hacks, or non-obvious shortcuts
- Prefer explicit `if/else` over clever short-circuiting when there's any ambiguity

### Naming

- **Variables:** describe what they contain (`isLoading`, `userList`, `errorMessage`)
- **Functions:** describe what they do (`fetchUserById`, `formatDate`, `handleSubmit`)
- **Booleans:** prefix with `is`, `has`, or `can` (`isVisible`, `hasError`, `canEdit`)
- Avoid abbreviations unless they're universally known (`id`, `url`, `ctx` are fine; `usr`, `cfg` are not)

### Comments

- Comment **why**, not **what** — the code shows what, comments explain non-obvious reasoning
- If you need a comment to explain what code does, the code needs to be rewritten
- `// TODO:` is fine for known gaps; don't leave mystery code unexplained

---

## File & Folder Structure

Follow Next.js App Router conventions:

```
app/
  layout.tsx          # root layout
  page.tsx            # home page
  [route]/
    page.tsx          # route page
    components/       # components used only by this route
    types.ts          # types/schemas for this route
  api/
    [endpoint]/
      route.ts        # API route handler (GET, POST, etc.)
      types.ts        # request/response types for this endpoint
components/           # shared components
lib/                  # shared utilities and helpers
types/                # shared types used across multiple areas
  types.ts
```

### Types

- All types and schemas for a given folder live in a `types.ts` file **in that folder**
- Never scatter type definitions across implementation files
- Only put types in the top-level `types/types.ts` if they're shared across multiple areas

### API Routes

Use Next.js route handlers in `app/api/`:

```ts
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { GetUsersResponse } from "./types";

export async function GET(
  request: NextRequest,
): Promise<NextResponse<GetUsersResponse>> {
  const users = await fetchUsers();
  return NextResponse.json({ users });
}
```

## TypeScript

- Always type function parameters and return values
- Prefer `interface` for object shapes, `type` for unions/aliases
- Avoid `any` — use `unknown` and narrow it if you truly don't know the type

## Exports

- **Always use named exports** — never default exports
- Exception: Next.js requires default exports for `page.tsx`, `layout.tsx`, `route.ts`, and `not-found.tsx` — those files only

```ts
// ✅ Good
export function UserCard() { ... }
export function formatDate() { ... }

// ❌ Bad
export default function UserCard() { ... }
```

## Components

- One component per file
- Keep components focused — if a component does more than one thing, split it
- Props interface defined at the top of the file, named `[ComponentName]Props`

```ts
interface UserCardProps {
  name: string;
  email: string;
  isActive: boolean;
}

export function UserCard({ name, email, isActive }: UserCardProps) {
  if (!isActive) {
    return null;
  }

  return (
    <div>
      <p>{name}</p>
      <p>{email}</p>
    </div>
  );
}
```

## Pre-Push Checklist

Before pushing any code, review your changes against this checklist.

### Code quality

- [ ] Code is skimmable — a teammate can understand any function in seconds without asking
- [ ] No clever one-liners, ternary chains, or non-obvious shortcuts
- [ ] Early returns used — edge cases handled at the top, happy path at the bottom
- [ ] Functions are not broken into too many small pieces — related logic stays together
- [ ] No changes included that aren't strictly required for the task

### State & types

- [ ] State is minimized — arguments are narrowed, nothing is optional unless it truly can be absent
- [ ] Discriminated unions used where a value can be one of several distinct types
- [ ] All cases of a union or variant type are exhaustively handled — unknown types throw or assert
- [ ] No defensive code — trust that values are what the types say they are
- [ ] Asserts used when loading data that must exist, instead of try/catch or fallback defaults

### Arguments & interfaces

- [ ] Argument count is low — no unnecessary overrides or configuration options
- [ ] No optional arguments that are actually always required
- [ ] Highly opinionated about what gets passed around — if it must exist, require it

### Lint & formatting

- [ ] `pnpm lint` passes with no errors
