# Scout Setup Guide

Complete step-by-step setup from prerequisites through database configuration.

## Prerequisites

Install these tools once (check if installed before repeating):

### Homebrew

```bash
brew --version
# If not installed:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### NVM (Node Version Manager)

```bash
nvm --version
# If not installed:
brew install nvm
# Then add to ~/.zshrc (follow printed instructions)
```

### Node (via NVM)

```bash
nvm install --lts
nvm use --lts
```

### pnpm

```bash
pnpm --version
# If not installed:
npm install -g pnpm
```

---

## Step 1: Setup Environment

### 1.1 Create .env.local

In the project root, create `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_xxxxx"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."
```

To get these from Supabase:

1. Go to https://app.supabase.com → Your project
2. Settings → API (left sidebar)
3. Copy the anon/public key (starts with `sb_`)
4. Copy the Service Role key (starts with `ey`, much longer)

### 1.2 Install Dependencies

```bash
pnpm install
pnpm add @supabase/supabase-js
```

---

## Step 2: Run Database Migration

The migration creates all 10 tables needed by Scout.

### 2.1 Open Supabase SQL Editor

1. Go to https://app.supabase.com → Your project
2. Left sidebar → SQL Editor
3. Click "+ New Query"

### 2.2 Load & Run Migration

1. Open: `supabase/migrations/001_create_scout_schema.sql`
2. Copy entire file (Cmd+A / Ctrl+A, then Cmd+C / Ctrl+C)
3. Paste into Supabase SQL Editor
4. Click blue "Run" button (or Cmd+Enter / Ctrl+Enter)

### 2.3 Verify Success

You should see:

```
Query successful, completed in XXX ms.

DROP TABLE ...
CREATE TABLE ...
CREATE INDEX ...
CREATE POLICY ...
(... repeats for all tables)
```

Then verify in **Table Editor** (left sidebar) — you should see 10 tables:

- ✅ profiles
- ✅ user_settings
- ✅ pets
- ✅ daily_logs
- ✅ daily_tasks
- ✅ streaks
- ✅ sitter_invites
- ✅ sitter_sessions
- ✅ inventory
- ✅ product_recommendations

---

## Step 3: Test the Connection

### 3.1 Start Dev Server

```bash
pnpm dev
```

You should see:

```
▲ Next.js 16.0.0
  ✓ compiled client and server successfully
```

### 3.2 Test API Connection

1. Open http://localhost:3000
2. Press F12 → Console tab
3. Paste:
   ```js
   fetch('/api/tracker?petId=test-id')
     .then((r) => r.json())
     .then((data) => console.log(data));
   ```
4. You should see:
   ```json
   { "error": "Pet not found" }
   ```

**Success!** This error means:

- ✅ Supabase connection works
- ✅ API route works
- ✅ Database queries work
- ✅ RLS policies work (correctly rejected unknown pet)

---

## Step 4: Create Test Pet (Optional)

To test with real data:

1. Go to Supabase → Table Editor → `pets`
2. Click "+ Insert"
3. Fill in:
   ```
   id: 550e8400-e29b-41d4-a716-446655440000
   owner_id: 550e8400-e29b-41d4-a716-446655440001
   name: "Biscuit"
   species: "dog"
   breed: "Golden Retriever"
   ```
4. Click Save

Then test with:

```js
fetch('/api/tracker?petId=550e8400-e29b-41d4-a716-446655440000')
  .then((r) => r.json())
  .then((data) => console.log(data));
```

Should return:

```json
{
  "data": {
    "date": "2026-04-02",
    "petName": "Biscuit",
    "tasks": [],
    "streaks": { "food": 0, "exercise": 0, "medicine": 0 }
  }
}
```

---

## Troubleshooting

### Error: "NEXT_PUBLIC_SUPABASE_URL not found"

**Cause:** Environment variables not loaded

**Fix:**

1. Check `.env.local` exists in project root
2. Check variable names match exactly (case-sensitive)
3. Restart dev server: `Ctrl+C` then `pnpm dev`

### Error: "conn refused" or "ECONNREFUSED"

**Cause:** Supabase project paused

**Fix:**

1. Go to Supabase dashboard
2. Project Settings → General
3. Check if "Paused" → Click "Resume" if so

### Error: "table 'daily_logs' does not exist"

**Cause:** Migration didn't run successfully

**Fix:**

1. Go back to Supabase SQL Editor
2. Manually delete remaining tables:
   ```sql
   DROP TABLE IF EXISTS product_recommendations CASCADE;
   DROP TABLE IF EXISTS inventory CASCADE;
   DROP TABLE IF EXISTS sitter_sessions CASCADE;
   DROP TABLE IF EXISTS sitter_invites CASCADE;
   DROP TABLE IF EXISTS streaks CASCADE;
   DROP TABLE IF EXISTS daily_tasks CASCADE;
   DROP TABLE IF EXISTS daily_logs CASCADE;
   DROP TABLE IF EXISTS pets CASCADE;
   DROP TABLE IF EXISTS user_settings CASCADE;
   DROP TABLE IF EXISTS profiles CASCADE;
   ```
3. Run the migration again

### Error: "Policy violation" or "permission denied"

**Cause:** RLS policies working correctly (preventing unauthorized access)

**Fix:**

- This is expected behavior
- Make sure you're testing with the correct `owner_id` on the pet
- In production, use Supabase Auth to set user context

---

## Next Steps

Once setup is complete:

1. **Review Architecture** — See `docs/ARCHITECTURE.md` for implementation
   roadmap
2. **Understand Database** — See `docs/DATABASE.md` for full schema
3. **Learn Design System** — See `docs/DESIGN.md` before building UI
4. **Check Code Style** — See `AGENTS.md` for development guidelines
