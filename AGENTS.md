# Scout — Agent Guidelines

## Project Overview

Scout is a gamified pet care platform that helps families and kids care for a real pet by combining daily routine tracking, health management, and a virtual pet experience. It supports shared caregiving — owners can invite pet sitters or family members to log updates, follow instructions, and keep care consistent.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · pnpm · Vercel

## Branches

- `development` — daily work
- `main` — production; always go through a PR

**Never push directly to `development` or `main`.** Always branch off `development`:

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

**The most important rule: frontend components never import from `lib/` directly.**

All business logic lives in `lib/`. The only bridge to the frontend is an API route.

```
React component
  → fetch("/api/...")
    → app/api/.../route.ts    ← thin bridge
      → lib/...               ← all business logic
```

If you're in a component and about to import from `lib/`, stop — create an API route instead.

### File Structure

```
app/
  layout.tsx
  page.tsx
  [route]/
    page.tsx
    components/       # components used only by this route
    types.ts
  api/
    [endpoint]/
      route.ts        # thin: validate → call lib → return
      types.ts        # request/response types
components/           # shared components (used in 2+ places)
  ui/                 # shadcn primitives — do not modify directly
  PawIcon.tsx         # example shared component
lib/                  # business logic — no React, no "use client"
  utils.ts            # cn() utility (clsx + tailwind-merge)
types/
  types.ts            # shared types used across multiple areas
```

Import directly from the source file:

```ts
// ✅ Good
import { PawIcon } from "@/components/PawIcon";

// ❌ Bad — no barrel files (index.ts that just re-exports)
import { PawIcon } from "@/components";
```

**Never create `index.ts` files that only re-export things.** Import directly from the source file.

**shadcn wrapper pattern:** When you need a custom variant of a shadcn component, create a wrapper in `components/` (e.g. `components/PrimaryButton.tsx`) rather than importing from `components/ui/` directly with ad-hoc class overrides. `components/ui/` wrappers that don't exist yet should be created on first use.

**One permitted `lib/` import:** `cn` from `@/lib/utils` may be imported directly in any component or layout — it is a pure style utility, not business logic. Everything else in `lib/` goes through an API route.

---

## Code Style

- **Readability over cleverness** — an intern should understand any function at a glance
- **Early returns** — handle edge cases at the top, happy path at the bottom (no nesting)
- **One concept per line** — don't chain multiple operations together
- **Small functions** — if a function exceeds ~30 lines, break it up
- **Descriptive names** — `filteredActiveUsers` over `data2`, `isLoading` over `loading`
- **Booleans:** prefix with `is`, `has`, or `can`
- **Comments:** explain _why_, not _what_ — if you need a comment to explain what the code does, rewrite the code

## TypeScript

- Always type function parameters and return values explicitly
- `interface` for object shapes, `type` for unions/aliases
- No `any` — use `unknown` and narrow it
- Props interface at the top of each component file, named `[ComponentName]Props`

## Exports

- **Always use named exports** — never default exports
- Exception: Next.js requires defaults for `page.tsx`, `layout.tsx`, `route.ts`, `not-found.tsx`

---

## Components

- One component per file
- Never fetch data directly inside a component — use a hook or receive data as props
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

See `components/CLAUDE.md` for the full design system reference: brand tokens, font usage rules (Fredoka vs Nunito), spacing, border radius, animation utilities, and color palette. **Always read it before writing any UI.** Key rules:

- Use brand token classes (`bg-chewy-blue`, `text-chewy-orange`, `font-fredoka`) — never hardcode hex values or `var()` calls in JSX
- Fredoka for big/expressive text, Nunito for everything else

## shadcn/ui

- shadcn components live in `components/ui/` — **do not edit them directly**
- Extend shadcn components by wrapping them in a new component in `components/`, not by modifying `components/ui/`
- Use `class-variance-authority` (bundled with shadcn) for custom variants
- Prefer the shadcn wrapper for styled components; use Radix primitives directly only when you need unstyled behavior

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
  request: NextRequest,
): Promise<NextResponse<GetUserResponse>> {
  const user = await getUserById(params.id);

  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
```

## lib/

- Pure functions where possible — inputs in, outputs out, no side effects
- No `"use client"`, no React imports — always server-side
- One domain per file (`users.ts`, `pets.ts` — not a giant `utils.ts`)
- Named exports only
