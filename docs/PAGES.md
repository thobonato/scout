# Scout UI Pages Specification

Detailed specifications for Scout pages, components, and layouts.

---

## Pet Home Page

**Route:** `/dog/[id]/home`  
**Purpose:** Main daily interaction screen. Shows pet avatar with quick-action
CTAs.

### Layout

```
┌─────────────────────────────────┐
│  ← Back to Profile     [Edit]  │
│                                 │
│         ┌──────────┐            │
│         │  Avatar   │           │ ← cartoon avatar (large, centered)
│         │  (alive)  │           │
│         └──────────┘            │
│          Biscuit                 │ ← dog name
│                                 │
│   ┌─────┐  ┌─────┐  ┌─────┐   │
│   │ Feed │  │ Play│  │ Meds│   │ ← 3 CTA buttons in row
│   └─────┘  └─────┘  └─────┘   │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Fulfillment Meters        │  │
│  │ 🍖 ████████░░  80%       │  │
│  │ 🎾 ██████░░░░  60%       │  │
│  │ 💊 ██████████  100%      │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Today's Activity Log      │  │
│  │ Fed breakfast — 8:02am    │  │
│  │ Morning walk — 7:15am     │  │
│  └───────────────────────────┘  │
│                                 │
│  BottomNav                      │
└─────────────────────────────────┘
```

### Sections

#### 1. Avatar Display

- **Size:** Large, centered, prominent
- **Animation:** Idle breathing/bob (CSS, similar to `animate-wag`)
- **Reactions:** Eating animation after Feed, tail wag after Play, etc.
- **Fallback:** Oversized PawIcon with "Upload a photo to meet your pup!" prompt
- **Text:** Dog name below avatar in `font-fredoka text-2xl`

#### 2. Action CTAs

Three pill buttons in horizontal row:

| CTA      | Icon    | Color             | Opens                       |
| -------- | ------- | ----------------- | --------------------------- |
| Feed     | 🍖 Bowl | `bg-chewy-orange` | Item selection modal (food) |
| Play     | 🎾 Ball | `bg-chewy-blue`   | Item selection modal (toys) |
| Medicine | 💊 Pill | `bg-chewy-orange` | Item selection modal (meds) |

**Style:**

- `rounded-full`
- Icon + label
- `font-nunito font-bold`
- `shadow-sm`
- `hover:scale-105` transition

#### 3. Item Selection Modal

Bottom-sheet style modal that slides up when CTA is tapped.

```
┌─────────────────────────────────┐
│  ── drag handle ──              │
│                                 │
│  Feed Your Dog                  │ ← category-specific title
│                                 │
│  ┌─────┐  ┌─────┐  ┌─────┐    │
│  │ 🍖  │  │ 🦴  │  │ 🥩  │   │ ← 3-column item grid
│  │Kibble│  │Treat│  │ Wet │   │
│  └─────┘  └─────┘  └─────┘    │
│                                 │
│  [ Confirm ]                    │ ← confirm button
└─────────────────────────────────┘
```

**Behavior:**

- Items in 3-column grid of cards (`bg-warm-white rounded-2xl p-4 shadow-sm`)
- Tap to select (highlighted: `border-2 border-chewy-blue`)
- Confirm button at bottom → logs action, triggers avatar celebration, updates
  fulfillment
- For MVP: hardcoded items per category

**Default items:**

| Category | Items                                          |
| -------- | ---------------------------------------------- |
| Feed     | Kibble, Wet Food, Treat, Custom                |
| Play     | Fetch, Tug, Walk, Free Play                    |
| Medicine | Morning Meds, Evening Meds, Supplement, Custom |

#### 4. Fulfillment Meters

Horizontal progress bars showing daily status.

| Meter    | Color             | Calculation                               |
| -------- | ----------------- | ----------------------------------------- |
| Hunger   | `bg-chewy-orange` | % of scheduled meals completed today      |
| Exercise | `bg-chewy-blue`   | % of scheduled walks/play completed today |
| Medicine | `bg-chewy-orange` | % of scheduled meds completed today       |

**Style:**

- Track: `rounded-full h-3 bg-black/5`
- Fill: colored, animated on update
- Label + percentage to right
- MVP: driven by action log count vs. hardcoded goals (3 meals, 2 walks, 1 med)

#### 5. Today's Activity Log

Reverse-chronological list of today's actions.

- Each entry: action icon + description + timestamp
- Style: simple list in `bg-warm-white rounded-2xl` card
- Max 5 visible, "See all" link if more
- MVP: stored in localStorage alongside pet profile

### Types

```ts
export type ActionCategory = 'feed' | 'play' | 'medicine';

export interface CareItem {
  id: string;
  category: ActionCategory;
  name: string;
  icon: string; // emoji or icon identifier
  chewyProductRef?: string; // optional Chewy product link
}

export interface ActionLog {
  id: string;
  category: ActionCategory;
  itemName: string;
  timestamp: string; // ISO string
}
```

---

## Dashboard

**Route:** `/dashboard`  
**Purpose:** Overview of all pets, sitter activity, and quick actions.

**Sections:**

- Pet summary cards (name, avatar, status)
- Sitter activity feed (if sitters are active)
- Sitter link/invite button
- Bottom navigation

---

## Tracker

**Route:** `/tracker`  
**Purpose:** Daily task checklist with streak tracking.

**Sections:**

- Today's date
- Task list by category (Food, Exercise, Medicine)
- Streak badges for each category
- Ability to toggle tasks complete/incomplete

---

## Settings

**Route:** `/settings`  
**Purpose:** User preferences and notification settings.

**Sections:**

- Notification preferences (daily reminders, missed task alerts, etc.)
- Theme selector (light/dark)
- Language selector
- Sitter management (invite, revoke, view sessions)

---

## Sitter Dashboard

**Route:** `/dashboard/session/[sessionId]`  
**Purpose:** Simplified view for active sitters during a caregiving session.

**Sections:**

- Pet name and avatar
- Quick action buttons (Feed, Play, Meds)
- Session duration and owner contact
- Activity log for this session only
- "End session" button

---

## Design System Reference

See [DESIGN.md](DESIGN.md) for:

- Brand colors (Chewy Blue, Chewy Orange)
- Typography (Fredoka vs Nunito)
- Component patterns (buttons, badges, cards)
- Animations and transitions
- Spacing and border radius rules

Key rules:

- Use Tailwind brand token classes: `bg-chewy-blue`, `text-chewy-orange`
- Fredoka for big/expressive text, Nunito for everything else
- `rounded-2xl` for cards, `rounded-full` for buttons
- `gap-16 / py-16` for section spacing
- `.bg-page` utility for gradient page backgrounds
