# Scout

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Getting Secrets](#getting-secrets)
4. [Running Locally](#running-locally)
5. [Contributing](#contributing)
6. [Deploying](#deploying)

---

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

Then follow the instructions printed at the end of the install to add NVM to your shell profile (usually adding a few lines to `~/.zshrc`), and restart your terminal.

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

> Running these commands is safe even if Node is already installed — NVM will just switch to the latest LTS.

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

We use Doppler to manage environment variables. You need to do this before the app will run.

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

We use Husky + ESLint as a pre-commit hook. Your commit will be blocked if there are lint errors.

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
