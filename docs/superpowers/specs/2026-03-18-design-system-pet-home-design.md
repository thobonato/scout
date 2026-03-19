# Design System + Pet Home Page — Spec

Date: 2026-03-18
Phase: 1 (Foundation Sprint, Mar 23–27)
Status: Approved

---

## Overview

Two deliverables in this spec:

1. **Design system overhaul** — update Scout's brand tokens, integrate shadcn/ui, document the component library baseline
2. **Pet Home page** (`/home`) — the primary app screen post-login, built against mock data in Phase 1

---

## 1. Design System

### Token Updates (`app/globals.css`)

Replace the existing Chewy light-blue tokens with Scout's own identity. Also add a dark hover variant for scout-blue.

`:root` block changes:

```css
/* Remove */
--chewy-blue: #00aeef;
--chewy-blue-dark: #0092cc;
--text-dark: #1a1a2e;

/* Add */
--scout-blue: #1C49C2;
--scout-blue-dark: #1640a8;   /* hover state for scout-blue */
--text-dark: #121212;
```

`--chewy-orange: #f4791f` and `--chewy-orange-dark: #d96310` are intentionally kept under their existing names. Do not rename them.

`@theme inline` block — update to register new tokens as Tailwind utilities:

```css
@theme inline {
  /* Remove */
  --color-chewy-blue: var(--chewy-blue);
  --color-chewy-blue-dark: var(--chewy-blue-dark);

  /* Add */
  --color-scout-blue: var(--scout-blue);
  --color-scout-blue-dark: var(--scout-blue-dark);

  /* Update */
  --color-text-dark: var(--text-dark);   /* now resolves to #121212 */

  /* Keep unchanged */
  --color-chewy-orange: var(--chewy-orange);
  --color-chewy-orange-dark: var(--chewy-orange-dark);
  --color-cream: var(--cream);
  --color-warm-white: var(--warm-white);
  --color-text-mid: var(--text-mid);
  --color-text-muted: var(--text-muted);
  --font-fredoka: var(--font-fredoka);
  --font-nunito: var(--font-nunito);
}
```

This makes `bg-scout-blue`, `text-scout-blue`, `hover:bg-scout-blue-dark` available as Tailwind utility classes.

### shadcn/ui Integration (Tailwind v4 compatible)

shadcn added Tailwind v4 support. Use the current CLI which handles v4 automatically:

```bash
npx shadcn@latest init
```

CLI choices:
- TypeScript: yes
- CSS variables: yes
- Global CSS file: `app/globals.css`
- Components output: `components/ui/`
- Base color: neutral

**Important — Tailwind v4 / HSL format:** shadcn's generated components reference CSS variables as `hsl(var(--primary))`. Supply values in HSL, not hex, in the shadcn variable block that the CLI injects:

```css
/* shadcn variables block — injected by CLI, override values in HSL */
:root {
  --primary: 222 75% 42%;           /* #1C49C2 in HSL */
  --primary-foreground: 0 0% 100%;  /* white */
  --background: 33 100% 97%;        /* #fff8f0 cream */
  --card: 33 60% 99%;               /* #fffcf8 warm-white */
  --foreground: 0 0% 7%;            /* #121212 text-dark */
  --muted-foreground: 240 13% 54%;  /* #7a7a9a text-muted */
  --radius: 1rem;                   /* rounded-2xl equivalent */
}
```

This ensures shadcn components (Dialog, Sheet, Badge, Button) inherit Scout's palette automatically.

**`components/ui/` is committed to git.** shadcn generates source files that belong to the project. Do not gitignore this folder.

### First components to install

After init:

```bash
npx shadcn@latest add dialog sheet badge button skeleton
```

### Component conventions

- `components/ui/` is shadcn-generated — **never edit these files directly**
- To extend a shadcn component, wrap it in `components/` (e.g. `components/PetCTACard/PetCTACard.tsx`)
- Custom button class for primary actions: `bg-scout-blue hover:bg-scout-blue-dark text-white font-nunito font-bold px-6 py-3 rounded-full transition-colors`

### `components/CLAUDE.md` updates

- Replace all references to `chewy-blue` → `scout-blue` in token tables and button examples
- Add: `components/ui/` is shadcn-generated — do not modify. Wrap in `components/` instead.
- Add: `scout-blue-dark` is the hover token for scout-blue (analogous to the old `chewy-blue-dark`)

### Root `CLAUDE.md` updates

Add a "Project Overview" section at the top. See Section 3 of this spec.

---

## 2. Pet Home Page (`/home`)

### Route

`app/home/page.tsx` — new route. Does not replace `app/page.tsx` (the coming-soon splash stays).

### Mock data (`app/home/mock-data.ts`)

```ts
export const mockPet = {
  name: "Biscuit",
  breed: "Golden Retriever",
  age: "2 years",
  avatarUrl: null,
};

export const feedItems = [
  { id: "1", name: "Chicken & Rice", emoji: "🍗", category: "Dry Food" },
  { id: "2", name: "Salmon Pâté", emoji: "🐟", category: "Wet Food" },
  // ... ~6 total items
];

export const toyItems = [
  { id: "1", name: "Rope Tugger", emoji: "🪢", category: "Tug Toys" },
  { id: "2", name: "Tennis Ball", emoji: "🎾", category: "Fetch" },
  // ... ~6 total items
];

export const medicineItems = [
  { id: "1", name: "Heartworm Pill", emoji: "💊", notes: "Monthly" },
  { id: "2", name: "Flea Treatment", emoji: "🧴", notes: "Monthly" },
  // ... ~4 total items
];
```

`notes` on medicine items is metadata only — displayed as a small muted caption below the item name in the item grid (same visual slot as `category` on other items). The item card component renders the third line as `category ?? notes` so one component handles all three types.

### Layout

- Centered container: `max-w-md mx-auto px-4 py-8` on mobile; `max-w-lg` on `sm:` and above
- Full viewport height, cream gradient background (`.bg-page`)
- Flex column layout, `gap-8` between avatar section and CTA grid

### Avatar section

- Circular frame: `w-32 h-32 rounded-full overflow-hidden mx-auto`
- Content: shadcn `<Skeleton className="w-32 h-32 rounded-full" />` (pulse shimmer)
- Pet name: `font-fredoka text-2xl font-bold text-text-dark text-center mt-4`
- Breed + age: `font-nunito text-sm text-text-muted text-center`
- Generating label: `font-nunito text-xs text-text-muted text-center mt-1` → `"Generating your avatar..."`

### CTA Grid — Feed / Play / Medicine

- `grid grid-cols-3 gap-3`
- Each card: `bg-warm-white rounded-2xl p-4 shadow-sm border border-black/5 flex flex-col items-center gap-2 cursor-pointer`
- Hover: `hover:scale-[1.03] hover:shadow-md transition-all duration-150`
- Emoji: `text-3xl` (native emoji, no icon library needed)
- Label: `font-nunito font-bold text-sm text-text-dark`
- Accent ring on hover per card:
  - Feed: `hover:border-chewy-orange/40`
  - Play: `hover:border-scout-blue/40`
  - Medicine: `hover:border-text-muted/40`
- After logging (confirmed from modal): card shows a small `✓` badge. See "Confirm badge" below.

**Confirm badge:** A `w-5 h-5 rounded-full bg-scout-blue` circle with a white checkmark SVG inside, positioned `absolute -top-1.5 -right-1.5` relative to the card (card gets `relative`). Appears with `animate-pop-in`. Replaces itself if re-logged.

### Gamified Item Modal

**Breakpoint detection:** Render both `Sheet` and `Dialog` in the DOM but show only one via CSS:
- `Sheet` has `className="sm:hidden"` — visible on mobile only
- `Dialog` has `className="hidden sm:block"` — visible on sm and above

This avoids hydration mismatch from JS-based `useMediaQuery`. Both components share the same open state and item selection state via props.

**Modal content (shared between Sheet and Dialog):**

Header title (per CTA type):
- Feed: `"What did [petName] eat today?"`
- Play: `"Pick a toy for [petName]"`
- Medicine: `"Log [petName]'s medicine"`

Item grid:
- `grid grid-cols-2 sm:grid-cols-3 gap-3`
- Each item card: `bg-warm-white rounded-2xl p-4 border-2 border-transparent cursor-pointer transition-all`
- Selected state: `border-scout-blue bg-scout-blue/5`
- Selected checkmark badge: `w-5 h-5 rounded-full bg-scout-blue` with white `✓` SVG, `absolute -top-1.5 -right-1.5`, `animate-pop-in`
- Item card content (top to bottom):
  1. Emoji: `text-4xl`
  2. Name: `font-nunito text-sm font-bold text-text-dark`
  3. Category/notes: `font-nunito text-xs text-text-muted` — renders `item.category ?? item.notes`
- Multi-select: yes (array of selected IDs in local state)

Footer CTA:
- `"Log it"` (no emoji in the button text — the paw in the spec draft was illustrative)
- Disabled when `selectedIds.length === 0`: `opacity-50 cursor-not-allowed`
- Enabled: `bg-scout-blue hover:bg-scout-blue-dark text-white font-nunito font-bold px-6 py-3 rounded-full transition-colors w-full`
- On confirm: close modal, show confirm badge on the triggering CTA card

### Component structure

```
app/home/
  page.tsx                  # route — assembles layout, owns modal open state
  mock-data.ts              # mock pet + item arrays
  types.ts                  # Pet, FeedItem, ToyItem, MedicineItem, ModalType interfaces
  components/
    PetAvatar/
      PetAvatar.tsx         # shimmer skeleton circle + name/breed/generating label
      index.ts
    PetCTACard/
      PetCTACard.tsx        # single Feed/Play/Medicine card with confirm badge logic
      index.ts
    ItemModal/
      ItemModal.tsx         # thin wrapper: owns which Sheet/Dialog to show (CSS only), passes props
      ItemModalContent.tsx  # shared content: header + item grid + footer CTA
      ItemGrid.tsx          # grid of selectable ItemCards
      ItemCard.tsx          # single selectable item card
      index.ts
```

`ItemModal.tsx` is kept thin (renders `Sheet` + `Dialog` with CSS visibility, nothing else). Business logic lives in `ItemModalContent.tsx`.

---

## 3. Root CLAUDE.md — Project Overview Section

Add at the top of `/CLAUDE.md`, before the Stack section:

```md
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
```

---

## What's Not In Scope (Phase 1)

- Real pet data from API (Phase 2)
- Real avatar image (Phase 2 — fal.ai endpoint)
- Logging to database (Phase 2)
- Auth/session — `/home` is accessible without login in Phase 1
