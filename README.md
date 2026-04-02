# Scout

Scout is a gamified pet care platform that helps families and kids care for a
real pet by combining daily routine tracking, health management, and a virtual
pet experience.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
shadcn/ui · Supabase · pnpm · Vercel

---

## Quick Start

### 1. Setup Environment

```bash
# Install dependencies
pnpm install
pnpm add @supabase/supabase-js

# Create .env.local with Supabase credentials
# See: docs/SETUP.md
```

### 2. Run Database Migration

1. Go to https://app.supabase.com → Your project
2. SQL Editor → New Query
3. Copy & paste: `supabase/migrations/001_create_scout_schema.sql`
4. Click "Run"

**Detailed setup:** See [docs/SETUP.md](docs/SETUP.md)

### 3. Start Dev Server

```bash
pnpm dev
```

Open http://localhost:3000

---

## Documentation

| Document                                     | Purpose                                                     |
| -------------------------------------------- | ----------------------------------------------------------- |
| [AGENTS.md](AGENTS.md)                       | **Code style, architecture rules, contribution guidelines** |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, API endpoints, implementation roadmap        |
| [docs/SETUP.md](docs/SETUP.md)               | Complete setup & configuration guide                        |
| [docs/DATABASE.md](docs/DATABASE.md)         | Database schema reference (10 tables with relationships)    |
| [docs/DESIGN.md](docs/DESIGN.md)             | Design system (colors, typography, components)              |
| [docs/PAGES.md](docs/PAGES.md)               | UI page specifications                                      |

**Start with:** `AGENTS.md` for code standards, then `docs/SETUP.md` for
configuration.

---

## Development

### Before Pushing

```bash
pnpm lint    # ESLint - must pass
pnpm build   # Type-check + build
```

Commit messages follow convention: `feat:`, `fix:`, `refactor:`, etc.

See [AGENTS.md](AGENTS.md) for complete guidelines.

### Repository Branch Model

- **main** — production (always through PR)
- **development** — daily work
- **Feature branches:** `git checkout -b <github-username>/<feature-name>`

Never push directly to `main` or `development`.

```bash
npm install -g pnpm@latest
```

---

## Project Setup

### 1. Clone the repo

```bash
git clone <repo-url>
cd scout
```

### 2. Install dependencies

```bash
pnpm install
```

---

## Getting Secrets

Scout uses Supabase for the backend database. You need to set up these
credentials.

### Quick Start

Follow the **[Complete Setup Guide](docs/SETUP_GUIDE.md)** for step-by-step
instructions:

1. ✅ Get Supabase keys
2. ✅ Add to `.env.local`
3. ✅ Install dependencies
4. ✅ Run database migration
5. ✅ Test the connection

**Time: ~15 minutes**

### If using Doppler (optional)

We also have Doppler for centralized secrets management:

#### 1. Install Doppler

```bash
brew install gnupg
brew install dopplerhq/cli/doppler
doppler update
```

#### 2. Log in

```bash
doppler login
```

> Ask @Thomaz for Doppler credentials

#### 3. Connect to the project

```bash
doppler setup --project chewy --config dev
```

#### 4. Download secrets

```bash
doppler secrets download --no-file --format env > .env.local
```

> Re-run step 4 any time secrets are updated.

---

## Running Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Contributing

### Branching

- Work off of the `development` branch
- Open a PR to merge back into `development` — direct pushes are not allowed

### Committing

We use Husky + ESLint as a pre-commit hook. Your commit will be blocked if there
are lint errors.

- Fix any errors the hook reports before committing
- The error output is explicit about what needs to be changed

### Previews

Every commit automatically deploys a preview environment on Vercel.

---

## Deploying

To deploy to production:

```bash
pnpm deploy:prod
```

This script:

1. Pulls the latest `development` branch
2. Rebases `main` on top of `development`
3. Force-pushes `main` (which triggers the Vercel production deploy)
4. Returns you to the `development` branch

> Only run this when `development` is in a stable, tested state.
