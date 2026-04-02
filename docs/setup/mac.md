# macOS Setup

## Prerequisites

Complete these steps IF not already installed.

### 1. Homebrew

Homebrew is the package manager used to install most tools.

**Check if installed:**

```bash
brew --version
```

If not installed:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

If installed, make sure it's up to date:

```bash
brew update
```

### 2. NVM (Node Version Manager)

NVM lets you install and switch between Node versions.

**Check if installed:**

```bash
nvm --version
```

If not installed:

```bash
brew install nvm
```

Then follow the instructions printed at the end of the install to add NVM to
your shell profile (usually adding a few lines to `~/.zshrc`), and restart your
terminal.

If installed, upgrade:

```bash
brew upgrade nvm
```

### 3. Node

**Check if installed:**

```bash
node --version
```

Install or upgrade to the LTS version:

```bash
nvm install --lts
nvm use --lts
```

> Running these commands is safe even if Node is already installed — NVM will
> just switch to the latest LTS.

### 4. pnpm

This project uses pnpm instead of npm.

**Check if installed:**

```bash
pnpm --version
```

If not installed:

```bash
npm install -g pnpm
```

If installed, upgrade:

```bash
npm install -g pnpm@latest
```

### 5. Supabase CLI

The Supabase CLI is used for managing database migrations and local development.

**Check if installed:**

```bash
supabase --version
```

If not installed:

```bash
brew install supabase/tap/supabase
```

If installed, upgrade:

```bash
brew upgrade supabase
```

### 6. Link to Supabase Project

**⚠️ One-Time Setup (Project Maintainer Only)**

The `supabase/` directory is already version-controlled in git. **Do not run
`supabase init` or `supabase login` unless you are setting up a brand new
project.** These should only be done once per project.

As a developer, you only need to link your local CLI to the cloud project:

```bash
supabase link --project-ref your-project-ref
```

> Replace `your-project-ref` with the actual project reference from your
> Supabase dashboard URL: `https://app.supabase.com/project/{project-ref}`

For ongoing database work (creating migrations, pulling schema changes, etc.),
see [docs/database/MIGRATIONS.md](../../database/MIGRATIONS.md).

## Getting Secrets

We use Doppler to manage environment variables. You need to do this before the
app will run.

### 1. Install Doppler

```bash
brew install gnupg
brew install dopplerhq/cli/doppler
doppler update
```

### 2. Log in

```bash
doppler login
```

> We use a shared login — ask @Thomaz for the credentials.

### 3. Connect to the project

```bash
doppler setup --project chewy --config dev
```

### 4. Download secrets to a local env file

```bash
doppler secrets download --no-file --format env > .env.local
```

> Re-run step 4 any time secrets are updated.
