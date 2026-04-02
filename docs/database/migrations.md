# Database Migrations & Updates

This guide explains how to manage database schema changes in Scout using
Supabase migrations.

## Overview

- **Migrations** are version-controlled SQL files that define incremental
  database changes
- Each change gets its own migration file with a timestamp
- Migrations are applied in order, ensuring consistency across environments
- **Never edit the `supabase/` directory directly** unless you know what you're
  doing

---

## One-Time Setup (Already Done)

The project maintainer has already run:

```bash
supabase init          # Created supabase/ directory
supabase login         # Authenticated with Supabase
supabase link          # Linked to cloud project
```

**As a developer, you do NOT need to run these commands.** The `supabase/`
directory is version-controlled in git.

---

## Developer Workflow

### 1. Pull Latest Changes

Make sure you have the latest migrations:

```bash
git pull origin development
```

### 2. Link to Cloud Project (First Time Only)

If you haven't already, link your local CLI to the cloud project:

```bash
supabase link --project-ref your-project-ref
```

> Replace `your-project-ref` with the actual project reference from your
> Supabase dashboard URL: `https://app.supabase.com/project/{project-ref}`

### 3. Sync Local Database

Pull the latest schema from the cloud:

```bash
supabase db pull
```

This downloads the remote schema and creates a new migration file locally (for
your reference).

---

## Making Schema Changes

### Step 1: Create a Migration

When you need to add a table, column, or policy, create a new migration:

```bash
supabase migration new add_users_table
```

This creates a file like
`supabase/migrations/20260402235959_add_users_table.sql`.

### Step 2: Write SQL

Edit the migration file and add your SQL. Example:

```sql
-- supabase/migrations/20260402235959_add_users_table.sql

CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_users_email ON public.users(email);
```

> Always include:
>
> - Comments explaining the change
> - Proper constraints and defaults
> - Indexes for performance-critical columns

### Step 3: Test Locally

Run the migration against your local database:

```bash
supabase db reset
```

This resets your local database and applies all migrations in order. Use this to
verify your migration works.

**Note:** This is local only — it doesn't affect the cloud project.

### Step 4: Commit and Push

Once tested and working:

```bash
git add supabase/migrations/20260402235959_add_users_table.sql
git commit -m "add users table with email index"
git push origin arvinduh/backend  # or your feature branch
```

### Step 5: Deploy to Cloud

Once the PR is merged to `development`:

```bash
# Pull latest development
git pull origin development

# Apply migrations to cloud
supabase db push
```

This applies any new migrations to the Supabase cloud project.

---

## Viewing Migrations

### List All Migrations

```bash
ls supabase/migrations/
```

### Inspect Migration

```bash
cat supabase/migrations/20260402235959_add_users_table.sql
```

### Check Status

```bash
supabase migration list --linked
```

Shows which migrations have been applied to the cloud project.

---

## Common Tasks

### Add a Column

```sql
-- supabase/migrations/20260403120000_add_avatar_to_users.sql

ALTER TABLE public.users
ADD COLUMN avatar_url TEXT;
```

### Create an Index

```sql
-- supabase/migrations/20260403120001_index_users_created_at.sql

CREATE INDEX idx_users_created_at ON public.users(created_at DESC);
```

### Create a Policy

```sql
-- supabase/migrations/20260403120002_add_user_rls_policy.sql

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);
```

### Drop a Table (Be Careful!)

```sql
-- supabase/migrations/20260403120003_drop_old_table.sql

-- Always add a comment explaining why
-- This table was replaced by new_table_name

DROP TABLE IF EXISTS public.old_table CASCADE;
```

---

## ⚠️ Important Rules

1. **Never directly edit `supabase/config.toml`** — this is auto-managed by the
   CLI
2. **Never run raw SQL in the Supabase dashboard** — always use migrations for
   reproducibility
3. **Always test locally with `supabase db reset`** before pushing
4. **Never skip migrations** — apply them in order
5. **Write idempotent SQL** — use `IF NOT EXISTS`, `IF EXISTS` clauses
6. **Document complex changes** — add SQL comments explaining the "why"

---

## Troubleshooting

### Migration Failed Locally

If `supabase db reset` fails:

1. Check the error message (it will tell you which line failed)
2. Fix the SQL in your migration file
3. Run `supabase db reset` again
4. Don't commit until it passes

### Lost Connection to Cloud

Reconnect:

```bash
supabase link --project-ref your-project-ref
```

### Need to Undo a Migration

**Before deploying to cloud:**

Simply delete or edit the migration file before pushing.

**After deploying to cloud:**

Create a new migration that reverts the changes:

```bash
supabase migration new revert_bad_change
```

Then write SQL to undo the previous change (e.g., drop the column/table/policy
that was added).

---

## Review Process

1. **Feature branch** — Developer writes migration + SQL
2. **Local testing** — `supabase db reset` verifies it works
3. **Code review** — Team reviews SQL + logic
4. **Merge to development** — Migration added to main branch
5. **Push to cloud** — Run `supabase db push`

Always review SQL changes carefully — bad migrations can corrupt data.

---

## Rollback Procedure

If something goes wrong in production:

1. Identify which migration caused the issue
2. Create a new migration that fixes it:
   ```bash
   supabase migration new fix_production_issue
   ```
3. Test locally
4. Deploy: `supabase db push`

**Never delete old migrations** — always create new ones to fix issues.

---

## References

- [Supabase Migrations Docs](https://supabase.com/docs/guides/cli/local-development#creating-migrations)
- [SQL Best Practices](https://supabase.com/docs/guides/database/postgres/best-practices)
- [RLS (Row-Level Security)](https://supabase.com/docs/guides/database/postgres/row-level-security)
