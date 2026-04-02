# Windows Setup

## Prerequisites

Complete these steps IF not already installed.

> **Recommended:** Use
> [Windows Subsystem for Linux (WSL2)](https://learn.microsoft.com/en-us/windows/wsl/install)
> with Ubuntu for the smoothest experience. If using WSL2, follow the
> [Ubuntu setup guide](./ubuntu.md) instead.

### 1. Node.js & npm

Download and install Node.js from [nodejs.org](https://nodejs.org/) (LTS
version).

**Verify installation:**

```bash
node --version
npm --version
```

### 2. NVM for Windows (Optional but Recommended)

If you want to manage multiple Node versions, install
[nvm-windows](https://github.com/coreybutler/nvm-windows):

1. Download the latest installer from
   [releases](https://github.com/coreybutler/nvm-windows/releases)
2. Run the installer and follow the prompts
3. Restart your terminal

**Verify installation:**

```bash
nvm --version
```

Then install Node via NVM:

```bash
nvm install latest
nvm use latest
```

### 3. pnpm

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

**Option A: Using Scoop (Recommended)**

If you have [Scoop](https://scoop.sh/) installed:

```powershell
scoop install supabase
```

**Option B: Using Chocolatey**

If you have [Chocolatey](https://chocolatey.org/) installed:

```powershell
choco install supabase
```

**Option C: Manual Installation**

Download the latest Windows binary from
[supabase/cli releases](https://github.com/supabase/cli/releases), extract it,
and add it to your PATH.

**Verify installation:**

```bash
supabase --version
```

### 5. Link to Supabase Project

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

### 6. Git

Download and install Git from [git-scm.com](https://git-scm.com/download/win).

**Verify installation:**

```bash
git --version
```

## Getting Secrets

We use Doppler to manage environment variables. You need to do this before the
app will run.

### 1. Install Doppler

Download the Doppler CLI installer from
[doppler.com/cli](https://doppler.com/cli).

Or use PowerShell:

```powershell
choco install doppler
```

(Requires Chocolatey — install from
[chocolatey.org](https://chocolatey.org/install) if needed)

**Verify installation:**

```bash
doppler --version
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
