# Ubuntu Setup

## Prerequisites

Complete these steps IF not already installed.

### 1. Package Manager

Update your package manager first:

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. NVM (Node Version Manager)

NVM lets you install and switch between Node versions.

**Check if installed:**

```bash
nvm --version
```

If not installed, use curl to install NVM:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

After installation, reload your shell configuration:

```bash
source ~/.bashrc
# or if using zsh:
source ~/.zshrc
```

Verify NVM is installed:

```bash
nvm --version
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

If not installed, download and install the native Linux binary:

**Step 1: Download the Package**

```bash
wget https://github.com/supabase/cli/releases/download/v2.84.2/supabase_2.84.2_linux_amd64.deb
```

**Step 2: Install the Package**

```bash
sudo dpkg -i supabase_2.84.2_linux_amd64.deb
```

**Step 3: Verify and Clean Up**

```bash
# Verify the CLI is in your PATH and working
supabase --version

# Remove the installer file
rm supabase_2.84.2_linux_amd64.deb
```

> Check [supabase/cli releases](https://github.com/supabase/cli/releases) for
> the latest version if you need a newer release.

### 6. Docker Engine

Docker is required for Supabase local development (migrations, schema pulls,
etc.).

**Step 1: Install Docker Engine**

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2
```

**Step 2: Start Docker**

When you need to use Docker (e.g., when running `supabase db pull`), start the
daemon:

```bash
sudo systemctl start docker
```

**Step 3: Verify Installation**

```bash
sudo docker --version
sudo docker run hello-world
```

**Optional: Enable auto-start on boot**

If you want Docker to start automatically when your system boots:

```bash
sudo systemctl enable docker
```

**Optional: Run docker without sudo**

If you want to avoid typing `sudo` with docker commands, add your user to the
docker group:

```bash
sudo usermod -aG docker $USER
```

You must log out and back in (or start a new terminal) for the group changes to
take effect. Then you can run `docker` commands without `sudo`.

**For WSL2 Users:** If you're running Ubuntu on WSL2, these steps install Docker
Engine inside WSL2. This is the recommended approach for WSL2 development. If
you have Docker Desktop installed on Windows, you can alternatively use its WSL2
integration instead of running Docker Engine in WSL2 — but running Docker Engine
inside WSL2 is simpler and avoids Windows integration complexity.

### 7. Link to Supabase Project

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
sudo apt install gnupg
curl -Ls --tlsv1.2 --proto "=https" --url "https://cli.doppler.com/install.sh" | sudo sh
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
