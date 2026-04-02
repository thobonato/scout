# Scout — Agent Guidelines

## Project Overview

Scout is a gamified pet care platform that helps families and kids care for a
real pet by combining daily routine tracking, health management, and a virtual
pet experience. It supports shared caregiving — owners can invite pet sitters or
family members to log updates, follow instructions, and keep care consistent.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
shadcn/ui · pnpm · Vercel

## Branches

- `development` — daily work
- `main` — production; always go through a PR

**Never push directly to `development` or `main`.** Always branch off
`development`:

```bash
git checkout development
git pull
git checkout -b <github-username>/<feature-name>/<optional-subname>
```

## Before Pushing

```bash
pnpm lint    # ESLint — must pass with no errors
pnpm build   # type-checks + builds — run before any PR
```

Prettier and ESLint run automatically on commit via Husky.

## Commands

```bash
pnpm dev          # start local dev server
pnpm lint         # run ESLint
pnpm build        # lint + type-check + build
pnpm deploy:prod  # deploy to production, AGENTS CANNOT RUN THIS
```

---

## Architecture

**The most important rule: frontend components never import from `lib/`
directly.**

All business logic lives in `lib/`. The only bridge to the frontend is an API
route.

```
React component
  → fetch("/api/...")
    → app/api/.../route.ts    ← thin bridge
      → lib/...               ← all business logic
```

If you're in a component and about to import from `lib/`, stop — create an API
route instead.

### File Structure

```
app/
  layout.tsx
  page.tsx
  [route]/
    page.tsx
    components/       # components used only by this route
  api/
    [endpoint]/
      route.ts        # thin: validate input → call lib → return response
components/           # shared components (used in 2+ places)
  ui/                 # shadcn primitives — do not modify directly
  PawIcon.tsx         # example shared component
hooks/                # client-side hooks for state, effects, etc.
  useActionLog.ts     # example: localStorage logic (client-only)
lib/                  # business logic — no React, no "use client"
  queries.ts          # database query helpers
  [domain].ts         # domain-specific logic (achievements, mood, xp, etc.)
  utils.ts            # cn() utility (clsx + tailwind-merge)
  types/
    database.ts       # Supabase database model interfaces
types/
  api.ts              # API request/response types (centralized)
  views.ts            # frontend/component types (centralized)
```

**Key organizational principles:**

1. **Types are centralized, not scattered**
   - `types/api.ts` — all API endpoint types
   - `types/views.ts` — all component/page types
   - `lib/types/database.ts` — database models (maps to Supabase)
   - Never create isolated `types.ts` files in route/component folders

2. **Client-side concerns go in hooks/**
   - localStorage logic belongs in hooks, not lib/
   - Client state management must be marked with `'use client'`
   - lib/ is server-side only (no React, no client directives)

3. **lib/ is purely server-side logic**
   - ✅ Database queries, API helpers, business logic, pure functions
   - ❌ No React imports, no `'use client'` directives, no localStorage
   - Export only named exports (const functions, const objects, types)

**Import patterns:**

```ts
// ✅ Good
import { PawIcon } from '@/components/PawIcon';
import type { DogProfile, ActionLog } from '@/types/views';
import type { GetActionsResponse } from '@/types/api';
import { cn } from '@/lib/utils';
import { getTodayLogs } from '@/lib/queries';

// ❌ Bad
import { PawIcon } from '@/components'; // use direct path
import types from '@/types'; // no default imports
import { cn } from '@/lib'; // import directly, not from lib root
import { localStorage } from '@/lib/actions'; // localStorage is client-side
```

**Never create `index.ts` or `types.ts` files that only re-export things.**
Import directly from source files.

---

## Code Style

- **Readability over cleverness** — an intern should understand any function at
  a glance
- **Early returns** — handle edge cases at the top, happy path at the bottom (no
  nesting)
- **One concept per line** — don't chain multiple operations together
- **Small functions** — if a function exceeds ~30 lines, break it up
- **Descriptive names** — `filteredActiveUsers` over `data2`, `isLoading` over
  `loading`
- **Booleans:** prefix with `is`, `has`, or `can`
- **Comments:** explain _why_, not _what_ — if you need a comment to explain
  what the code does, rewrite the code

## TypeScript

**Follow Google TypeScript Style Guide.**

### Declarations & Types

- Always type function parameters and return values explicitly
- `interface` for object shapes, `type` for unions/aliases
- No `any` — use `unknown` and narrow it instead
- No wrapper types (`String`, `Boolean`, `Number`) — use lowercase primitives
- Use `readonly` modifier for immutable properties
- Use `Record<K, V>` instead of `{ [key: K]: V }` for object maps

```ts
// ✅ Good
interface UserSettings {
  readonly id: string;
  name: string;
  preferences: Record<string, boolean>;
}

type UserRole = 'admin' | 'user';

// ❌ Bad
let settings: any;
type UserSettings = { [key: string]: string };
const name: String = 'John';
```

### Imports & Exports

- **Always use named exports** — never default exports (except Next.js:
  `page.tsx`, `layout.tsx`, `route.ts`, `not-found.tsx`)
- **Separate type imports:** use `import type` and `export type` for types-only
  imports
- **Never export mutable variables** (`export let`) — use functions instead

```ts
// ✅ Good
export type DogProfile = { name: string; age: number };
export function getDog(id: string): DogProfile { ... }
export const DEFAULT_CONFIG = { ... };

// ❌ Bad
export default function Dog() { ... }  // unless it's page.tsx
export let currentDog = null;          // mutable export
export { Dog as default };
```

### Variables & Functions

- Always use `const` by default, `let` only if reassignment needed, never `var`
- Declare one variable per statement (no comma-separated)
- Use default parameters instead of in-function checks
- Prefer `function foo() {}` for named functions, arrow `() => {}` for callbacks
- Always use triple equals `===` and `!==`

```ts
// ✅ Good
const count = 10;
let index = 0;
function calculateTotal(items: Item[] = []) { ... }
const handleClick = () => { ... };

// ❌ Bad
var count = 10;
const count = 10, total = 5;  // comma-separated
function process(items?: Item[]) { if (!items) items = []; }
```

### Naming

- **Classes/Interfaces/Types:** `UpperCamelCase` (`UserProfile`, `ActionLog`)
- **Variables/Functions/Methods:** `lowerCamelCase` (`getUserProfile`,
  `actionLog`)
- **Constants:** `CONSTANT_CASE` if global/static; otherwise treat as variables
- **Booleans:** prefix with `is`, `has`, or `can` (`isActive`, `hasPermission`,
  `canEdit`)
- No leading/trailing underscores for private members — use `private` keyword

```ts
// ✅ Good
interface UserProfile { ... }
const getUserProfile = () => { ... };
const isLoggedIn = true;
private readonly token: string;

// ❌ Bad
interface user_profile { ... }
const get_user_profile = () => { ... };
const logged_in = true;
private _token: string;
```

### Props Interface

Every component file should have a props interface at the top:

```ts
// ✅ Good
interface DogCardProps {
  dog: DogProfile;
  onSelect: (id: string) => void;
  className?: string;
}

export function DogCard({ dog, onSelect, className }: DogCardProps) {
  ...
}

// ❌ Bad
export function DogCard(props: any) { ... }
export function DogCard({ dog, onSelect, className }: { dog, onSelect, className }) { ... }
```

## Exports

- **Always use named exports** — never default exports
- Exception: Next.js requires defaults for `page.tsx`, `layout.tsx`, `route.ts`,
  `not-found.tsx`

---

## Components

- One component per file
- Never fetch data directly inside a component — use a hook or receive data as
  props
- Use early returns for conditional rendering
- If a component exceeds ~80 lines, break it into smaller pieces

```ts
interface UserCardProps {
  name: string;
  isActive: boolean;
}

export function UserCard({ name, isActive }: UserCardProps) {
  if (!isActive) return null;

  return <div>{name}</div>;
}
```

## Design System

See `components/CLAUDE.md` for the full design system reference: brand tokens,
font usage rules (Fredoka vs Nunito), spacing, border radius, animation
utilities, and color palette. **Always read it before writing any UI.** Key
rules:

- Use brand token classes (`bg-chewy-blue`, `text-chewy-orange`, `font-fredoka`)
  — never hardcode hex values or `var()` calls in JSX
- Fredoka for big/expressive text, Nunito for everything else

## shadcn/ui

- shadcn components live in `components/ui/` — **do not edit them directly**
- Extend shadcn components by wrapping them in a new component in `components/`,
  not by modifying `components/ui/`
- Use `class-variance-authority` (bundled with shadcn) for custom variants
- Prefer the shadcn wrapper for styled components; use Radix primitives directly
  only when you need unstyled behavior

```ts
// ✅ Extend by wrapping
export function PrimaryButton(props: ButtonProps) {
  return <Button variant="default" className="rounded-full" {...props} />;
}

// ❌ Don't edit components/ui/button.tsx directly
```

---

## API Routes

- Keep routes thin: validate input → call `lib/` → return response
- Always respond with `{ data }` or `{ error }` shape
- Use correct HTTP status codes
- Validate and sanitize all inputs before passing to `lib/`

```ts
export async function GET(
  request: NextRequest
): Promise<NextResponse<GetUserResponse>> {
  const user = await getUserById(params.id);

  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ user });
}
```

## lib/

- Pure functions where possible — inputs in, outputs out, no side effects
- No `"use client"`, no React imports — always server-side
- One domain per file (`users.ts`, `pets.ts` — not a giant `utils.ts`)
- Named exports only
