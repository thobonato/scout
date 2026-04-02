# Documentation Index

Scout's single, consolidated documentation system.

---

## 📖 Main Documents

### [AGENTS.md](AGENTS.md) — **Start here for development**

Your daily reference for code standards and architecture.

**Contains:**

- Project overview & tech stack
- Branch strategy & contributing setup
- Architecture system (critical rule: components never import from `lib/`)
- File structure & import patterns
- Code style guidelines (readability, early returns, naming conventions)
- TypeScript rules & exports
- Component best practices
- Design system overview
- shadcn/ui patterns
- API route structure
- `lib/` layer organization

**Read this:** Before writing any code or reviewing someone else's.

---

### [README.md](README.md) — **Project overview**

Quick-start and navigation guide.

**Contains:**

- Project summary & stack
- Quick start steps
- Documentation table (which doc to read for what)
- Development commands
- Branch model

**Read this:** First, to understand the project layout.

---

## 🔧 Setup & Configuration

### [docs/SETUP.md](docs/SETUP.md) — **Complete setup guide**

One document for all setup needs (prerequisites through database testing).

**Contains:**

- Prerequisites (Homebrew, NVM, Node, pnpm)
- Environment setup (.env.local, dependencies)
- Database migration steps
- Connection testing
- Optional: Creating test data
- Comprehensive troubleshooting

**Read this:** When setting up Scout for the first time.

---

## 🏗️ Architecture & Implementation

### [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — **System design & roadmap**

How Scout is built and what's being implemented.

**Contains:**

- System architecture & data flow
- File structure deep-dive
- Database architecture overview (10 tables)
- API endpoints status
- Core concepts (activity types, task categories, streaks, sitter system)
- Implementation roadmap (phases, what's done/in-progress/planned)
- Testing checklist
- Development commands

**Read this:** To understand how the system works and what needs to be built.

---

## 💾 Data Layer

### [docs/DATABASE.md](docs/DATABASE.md) — **Comprehensive schema reference**

Everything about the database structure.

**Contains:**

- Architecture diagram
- All 10 tables in detail:
  - Field definitions
  - Relationships
  - Used by (which API routes/features)
- Setup steps (Supabase project creation & migration)

**Read this:** When working with database queries or understanding data
relationships.

---

## 🎨 Design & UI

### [docs/DESIGN.md](docs/DESIGN.md) — **Design system (brand tokens, colors, typography)**

Single source of truth for visual design.

**Contains:**

- Brand colors (Chewy Blue, Chewy Orange, text colors, backgrounds)
- Color opacity variants & CSS variables
- Typography (Fredoka vs Nunito, type scale)
- Component patterns (badges, buttons, bottom bar)
- Iconography (Paw icon usage)
- Animations
- Aesthetics (minimal, warm, friendly)
- Spacing & border radius rules
- Button styles with examples

**Read this:** Before building any UI component.

**Rule:** Always use `bg-chewy-blue`, `text-chewy-orange` classes — never
hardcode hex values.

---

### [docs/PAGES.md](docs/PAGES.md) — **UI page specifications**

Detailed specs for Scout's pages and layouts.

**Contains:**

- Pet Home Page (`/dog/[id]/home`)
  - Layout diagram
  - Avatar display
  - Action CTAs (Feed, Play, Meds)
  - Item selection modal behavior
  - Fulfillment meters
  - Activity log section
  - TypeScript types
- Dashboard overview
- Tracker specifications
- Settings page
- Sitter dashboard

**Read this:** When implementing a new page or component.

---

## 🔍 Troubleshooting

### [docs/solutions/](docs/solutions/)

Specific solutions to known bugs and issues.

**Currently contains:**

- UI shadcn/button styling with Tailwind v4

**Read this:** When you encounter a specific error or bug that might be
documented.

---

## Quick Navigation by Task

| I need to...           | Read...                            |
| ---------------------- | ---------------------------------- |
| Understand the project | README.md                          |
| Set up Scout locally   | docs/SETUP.md                      |
| Learn code standards   | AGENTS.md                          |
| Build a new component  | docs/DESIGN.md + docs/PAGES.md     |
| Work with the database | docs/DATABASE.md                   |
| Implement an API route | docs/ARCHITECTURE.md (API section) |
| Fix a specific bug     | docs/solutions/                    |
| Understand system flow | docs/ARCHITECTURE.md               |

---

## Deleted (Consolidated Into Above)

The following files were consolidated into the documents above to eliminate
redundancy:

- ❌ SETUP_STATUS.md → docs/SETUP.md
- ❌ SETUP_CHECKLIST.md → docs/SETUP.md
- ❌ MIGRATION_QUICKSTART.md → docs/SETUP.md
- ❌ MIGRATION_EXPLANATION.md → docs/SETUP.md
- ❌ MIGRATION_FIX.md → docs/SETUP.md
- ❌ SETUP_GUIDE.md → docs/SETUP.md
- ❌ QUICK_START.md → docs/ARCHITECTURE.md
- ❌ IMPLEMENTATION.md → docs/ARCHITECTURE.md
- ❌ IMPLEMENTATION_COMPLETE.md → docs/ARCHITECTURE.md
- ❌ PET_HOME_SPEC.md → docs/PAGES.md
- ❌ CLAUDE.md (all 3 instances) → Redundant pointers deleted
