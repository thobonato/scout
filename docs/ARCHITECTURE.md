# Scout Architecture & Implementation

Codebase structure, data flow, and implementation roadmap for Scout.

**See [AGENTS.md](../AGENTS.md) for complete code style, TypeScript conventions,
and component guidelines.**

---

## System Architecture

### Overall Data Flow

```
React Component
    ↓
fetch("/api/...") ← API route is thin bridge
    ↓
app/api/.../route.ts ← validates input
    ↓
lib/... ← all business logic here
    ↓
Supabase PostgreSQL
```

**Critical rule:** Frontend components never import from `lib/` directly. All
communication flows through API routes.

### File Structure

```
app/
  layout.tsx
  page.tsx
  [route]/
    page.tsx
    components/         # components used only by this route
    types.ts
  api/
    [endpoint]/
      route.ts          # thin: validate → call lib → return
      types.ts          # request/response types

components/             # shared components (used 2+ places)
  ui/                   # shadcn primitives—don't edit
  PawIcon.tsx          # example shared component

lib/                    # business logic—no React
  queries.ts           # database queries (getTodayLogs, etc.)
  supabase.ts          # Supabase client initialization
  actions.ts           # domain-specific actions
  avatar.ts            # avatar generation
  recommendations.ts   # product recommendation logic
  utils.ts             # cn() utility and helpers
  types/
    database.ts        # Supabase table interfaces

types/
  types.ts             # shared types across multiple areas

docs/
  DATABASE.md          # schema reference
  DESIGN.md            # design tokens & UI patterns
  SETUP.md             # setup guide
  ARCHITECTURE.md      # this file
  PAGES.md             # UI page specifications
```

**Import rules:**

- ✅ Import directly from source files:
  `import { PawIcon } from "@/components/PawIcon"`
- ❌ Never create `index.ts` barrel files that just re-export
- ✅ `cn` from `@/lib/utils` is the only library function allowed in components
- Everything else in `lib/` goes through an API route

---

## Database Architecture

Scout uses **Supabase (PostgreSQL)** with 10 tables:

| Table                     | Purpose                                   |
| ------------------------- | ----------------------------------------- |
| `profiles`                | User accounts (owners & sitters)          |
| `user_settings`           | Notification & preference settings        |
| `pets`                    | Pet information                           |
| `daily_logs`              | Activity records (feed, walk, meds, play) |
| `daily_tasks`             | Recurring task templates                  |
| `streaks`                 | Consecutive perfect day tracking          |
| `sitter_invites`          | Token-based sitter invitations            |
| `sitter_sessions`         | Active caregiving sessions                |
| `inventory`               | Supply tracking (food, toys, meds)        |
| `product_recommendations` | AI product suggestions                    |

**See [DATABASE.md](DATABASE.md) for complete schema with relationships, fields,
and query helpers.**

---

## API Endpoints

| Endpoint               | Method | Purpose                       | Status             |
| ---------------------- | ------ | ----------------------------- | ------------------ |
| `/api/actions`         | GET    | Fetch today's activity logs   | ✅ Working         |
| `/api/actions`         | POST   | Log new activity              | ✅ Working         |
| `/api/fulfillment`     | GET    | Calculate pet fulfillment %   | ✅ Working         |
| `/api/tracker`         | GET    | Fetch daily tasks + streaks   | ✅ Working         |
| `/api/tracker`         | PATCH  | Mark task complete/incomplete | ✅ Working         |
| `/api/avatar`          | POST   | Generate pet avatar           | ⚠️ Partial         |
| `/api/settings`        | GET    | Fetch user settings           | ⚠️ Needs auth      |
| `/api/settings`        | PATCH  | Update user settings          | ⚠️ Needs auth      |
| `/api/recommendations` | GET    | Fetch product recommendations | ⚠️ Not implemented |
| `/api/sitters/invite`  | POST   | Create sitter invitation      | ⚠️ Needs email     |

---

## Core Concepts

### Activity Types (daily_logs)

- `feeding` — food given to pet
- `walk` — outdoor walk/exercise
- `medication` — medicine/supplement
- `play` — playtime/interaction

### Task Categories (daily_tasks)

- `food` — feeding tasks
- `exercise` — walk/play tasks
- `medicine` — medication tasks

### Streaks

Tracks consecutive "perfect days" where all tasks in a category are completed.

**How streaks work:**

1. When all `daily_tasks` for a pet+category are marked complete on a date
2. If yesterday also had a complete streak, increment `current_streak`
3. Otherwise reset to 1
4. Update `last_completed_date` = today

### Sitter System

- **Token-based invites** — 7-day expiry, unique secret link
- **Permission levels** — `full_access` or `view_only`
- **Active sessions** — determine who can log activities right now
- **RLS policies** — prevent sitters from accessing other pets

---

## Implementation Roadmap

### Phase 1: Setup ✅ Complete

- [x] Create Supabase project
- [x] Run database migration (10 tables)
- [x] Add environment variables
- [x] Install @supabase/supabase-js
- [x] Create TypeScript database interfaces
- [x] Initialize Supabase client

### Phase 2: Core Queries ✅ Complete

- [x] `getTodayLogs(petId)` — fetch activity records
- [x] `logActivity(petId, userId, category, notes, photoUrl)` — create log
- [x] `getDailyTasks(petId, date)` — fetch task templates
- [x] `toggleTaskCompletion(taskId, complete)` — mark done/undone
- [x] `getStreaks(petId)` — fetch streak data
- [x] `updateStreak(petId, category)` — increment/reset

### Phase 3: API Routes ⚠️ In Progress

**Working:**

- [x] GET `/api/actions` — uses getTodayLogs
- [x] POST `/api/actions` — uses logActivity
- [x] GET `/api/fulfillment` — calculates hunger/exercise/meds %
- [x] GET `/api/tracker` — uses getDailyTasks + getStreaks
- [x] PATCH `/api/tracker` — uses toggleTaskCompletion

**Needs Completion:**

- [ ] POST `/api/avatar` — implement avatar generation (placeholder exists)
- [ ] GET `/api/settings` — fetch user settings (add auth check)
- [ ] PATCH `/api/settings` — update settings (add auth check)
- [ ] GET `/api/recommendations` — fetch/generate product recommendations
- [ ] POST `/api/sitters/invite` — create invite + send email

### Phase 4: Frontend Components ⚠️ In Progress

**Pages with API integration:**

- [ ] Dashboard — show pet summary, activity feed, sitter info
- [ ] Tracker — display daily tasks + streaks
- [ ] Pet home — activity logging with avatar reactions
- [ ] Settings — user preferences
- [ ] Sitter dashboard — activity feed for active sessions

**Components:**

- [ ] ActionLog — display activity entries
- [ ] TaskListItem — tracker task with checkbox
- [ ] StreakBadge — display streak count
- [ ] FulfillmentMeter — progress bar for hunger/exercise/meds
- [ ] AvatarDisplay — pet avatar with animation

### Phase 5: Authentication

- [ ] Supabase Auth setup
- [ ] Login/signup pages
- [ ] Protected routes
- [ ] RLS policy enforcement
- [ ] Session management

### Phase 6: Advanced Features

- [ ] Multi-image upload for activity logs
- [ ] Product recommendation generation
- [ ] Email notifications
- [ ] Sitter invite system
- [ ] Analytics dashboard

---

## Testing Checklist

Before pushing to `development`:

- [ ] Run `pnpm build` — no type errors
- [ ] Run `pnpm lint` — ESLint passes
- [ ] Test API endpoints with real petId
- [ ] Verify RLS policies (unauthorized access blocked)
- [ ] Check component styling matches design system
- [ ] Test on mobile (Tailwind responsive classes)
- [ ] Commit message follows convention: `feat:`, `fix:`, `refactor:`

---

## Development Commands

```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Lint + type-check + build
pnpm lint         # Run ESLint
pnpm deploy:prod  # Deploy to production (AGENTS CANNOT RUN)
```

Before pushing, always run:

```bash
pnpm lint    # Must pass with no errors
pnpm build   # Type-check + build
```

---

## Related Documentation

- [AGENTS.md](../AGENTS.md) — Code style, TypeScript, component guidelines
- [DATABASE.md](DATABASE.md) — Complete schema reference with all fields
- [DESIGN.md](DESIGN.md) — Design tokens, colors, typography
- [PAGES.md](PAGES.md) — UI page specifications
- [SETUP.md](SETUP.md) — Setup and configuration guide
