# Pet Home Page — Spec

**Route:** `/dog/[id]/home`
**Purpose:** The main daily interaction screen. Shows the dog's avatar front and center with quick-action CTAs (Feed, Play, Medicine) and a gamified item selection modal for each action.

---

## Layout

```
┌─────────────────────────────────┐
│  ← Back to Profile     [Edit]  │  <- top bar
│                                 │
│         ┌──────────┐            │
│         │  Avatar   │           │  <- cartoon avatar (large, centered)
│         │  (alive)  │           │
│         └──────────┘            │
│          werwAt                  │  <- dog name below avatar
│                                 │
│   ┌─────┐  ┌─────┐  ┌─────┐   │
│   │ Feed │  │ Play│  │ Meds│   │  <- 3 CTA buttons in a row
│   └─────┘  └─────┘  └─────┘   │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Fulfillment Meters        │  │  <- hunger, exercise, meds bars
│  │ 🍖 ████████░░  80%       │  │
│  │ 🎾 ██████░░░░  60%       │  │
│  │ 💊 ██████████  100%      │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Today's Activity Log      │  │  <- recent check-offs
│  │ Fed breakfast — 8:02am    │  │
│  │ Morning walk — 7:15am     │  │
│  └───────────────────────────┘  │
│                                 │
│  BottomStrip                    │
└─────────────────────────────────┘
```

---

## Sections

### 1. Avatar Display

- Large cartoon avatar (generated via `/api/avatar`) centered on the page
- Idle animation: gentle breathing/bob (CSS, similar to existing `animate-wag`)
- Reacts to CTA actions — e.g. eating animation after Feed, tail wag after Play
- Fallback: if no avatar, show oversized PawIcon with "Upload a photo to meet your pup!" prompt
- Dog name in `font-fredoka text-2xl` below the avatar

### 2. Action CTAs

Three pill buttons in a horizontal row:

| CTA      | Icon      | Color             | Opens                              |
| -------- | --------- | ----------------- | ---------------------------------- |
| Feed     | Bowl icon | `bg-chewy-orange` | Item selection modal (food items)  |
| Play     | Ball icon | `bg-chewy-blue`   | Item selection modal (toys)        |
| Medicine | Pill icon | `bg-chewy-orange` | Item selection modal (medications) |

**Button style:** `rounded-full`, icon + label, `font-nunito font-bold`, `shadow-sm`, slight `hover:scale-105` transition.

Each button opens the **Item Selection Modal** filtered to its category.

### 3. Item Selection Modal

A bottom-sheet style modal that slides up when a CTA is tapped.

**Structure:**

```
┌─────────────────────────────────┐
│  ── drag handle ──              │
│                                 │
│  Feed Your Dog                  │  <- title (category-specific)
│                                 │
│  ┌─────┐  ┌─────┐  ┌─────┐    │
│  │ 🍖  │  │ 🦴  │  │ 🥩  │   │  <- item grid (scrollable)
│  │Kibble│  │Treat│  │ Wet │   │
│  └─────┘  └─────┘  └─────┘    │
│                                 │
│  [ Confirm ]                    │  <- confirm button
└─────────────────────────────────┘
```

**Behavior:**

- Items displayed in a 3-column grid of cards (`bg-warm-white rounded-2xl p-4 shadow-sm`)
- Each card: icon/emoji, item name, optional Chewy product reference
- Tap to select (highlighted with `border-2 border-chewy-blue` ring)
- Confirm button at bottom → logs the action, triggers avatar celebration animation, updates fulfillment meter
- For MVP: items are hardcoded per category. Post-MVP: pulled from the dog's routine items

**Categories & default items:**

| Category | Items                                          |
| -------- | ---------------------------------------------- |
| Feed     | Kibble, Wet Food, Treat, Custom                |
| Play     | Fetch, Tug, Walk, Free Play                    |
| Medicine | Morning Meds, Evening Meds, Supplement, Custom |

### 4. Fulfillment Meters

Horizontal progress bars showing daily status for each care area.

| Meter    | Color             | Calculation                               |
| -------- | ----------------- | ----------------------------------------- |
| Hunger   | `bg-chewy-orange` | % of scheduled meals completed today      |
| Exercise | `bg-chewy-blue`   | % of scheduled walks/play completed today |
| Medicine | `bg-chewy-orange` | % of scheduled meds completed today       |

- Bar style: `rounded-full h-3 bg-black/5` track, colored fill inside
- Label + percentage to the right
- Animated fill on change (CSS transition)
- For MVP: meters are driven by action log count vs. hardcoded daily goals (e.g. 3 meals, 2 walks, 1 med dose)

### 5. Today's Activity Log

Reverse-chronological list of actions taken today.

- Each entry: action icon, description, timestamp
- Style: simple list in a `bg-warm-white rounded-2xl` card
- Max 5 visible, "See all" link if more
- For MVP: stored in localStorage alongside dog profile

---

## Data

### New types needed (`app/dog/[id]/home/types.ts`)

```ts
export type ActionCategory = "feed" | "play" | "medicine";

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

export interface FulfillmentState {
  hunger: number; // 0–100
  exercise: number;
  medicine: number;
}
```

### Storage (MVP)

- Action logs: `localStorage` key `scout_action_log_{dogId}`
- Fulfillment: calculated from today's action logs vs. daily goals
- Post-MVP: move to Supabase with real-time sync for sitter view

---

## API Routes Needed

| Endpoint           | Method | Purpose                                       |
| ------------------ | ------ | --------------------------------------------- |
| `/api/actions`     | POST   | Log a care action (category, item, timestamp) |
| `/api/actions`     | GET    | Fetch today's action log for a dog            |
| `/api/fulfillment` | GET    | Calculate fulfillment percentages for a dog   |

All route handlers delegate to `lib/actions.ts` and `lib/fulfillment.ts`.

---

## File Structure

```
app/dog/[id]/home/
  page.tsx                          # Pet Home page
  types.ts                          # ActionCategory, CareItem, ActionLog, FulfillmentState
  components/
    AvatarDisplay/AvatarDisplay.tsx  # Large avatar with idle animation
    ActionCTAs/ActionCTAs.tsx        # Feed/Play/Medicine button row
    ItemModal/ItemModal.tsx          # Bottom-sheet item selection modal
    FulfillmentMeters/FulfillmentMeters.tsx
    ActivityLog/ActivityLog.tsx
app/api/actions/
  route.ts
  types.ts
app/api/fulfillment/
  route.ts
  types.ts
lib/
  actions.ts                        # action logging logic
  fulfillment.ts                    # meter calculation logic
```

---

## Animations

| Trigger            | Animation                   | How                                                     |
| ------------------ | --------------------------- | ------------------------------------------------------- |
| Page load          | Avatar fades in with pop-in | Existing `animate-pop-in`                               |
| Idle               | Avatar gentle bob           | New `animate-breathe` keyframe (subtle translateY loop) |
| Feed confirmed     | Avatar eating animation     | CSS class swap or Kimi-generated clip (post-MVP)        |
| Play confirmed     | Avatar tail wag / jump      | CSS class swap                                          |
| Medicine confirmed | Avatar calm nod             | CSS class swap                                          |
| Modal open         | Slides up from bottom       | `translate-y-full` → `translate-y-0` transition         |
| Meter fill         | Bar width animates          | `transition-all duration-500`                           |

---

## MVP Scope vs. Post-MVP

| Feature               | MVP                                             | Post-MVP                                |
| --------------------- | ----------------------------------------------- | --------------------------------------- |
| Avatar display        | Static image with CSS idle animation            | Kimi k2.5 generated micro-animations    |
| Item selection        | Hardcoded items per category                    | Pulled from dog's routine items in DB   |
| Fulfillment meters    | Based on local action count vs. hardcoded goals | Real daily goals from routine builder   |
| Activity log          | localStorage                                    | Supabase with real-time sync            |
| Celebration animation | CSS scale/confetti burst                        | Custom per-action Kimi animations       |
| Chewy product links   | Display only                                    | Deep link to Chewy app/site for reorder |
