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
