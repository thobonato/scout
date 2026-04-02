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

Choose your operating system for setup instructions:

- **[macOS Setup](docs/setup/mac.md)** — Homebrew, NVM, Node, pnpm, and Doppler
- **[Ubuntu Setup](docs/setup/ubuntu.md)** — apt, NVM, Node, pnpm, and Doppler
- **[Windows Setup](docs/setup/windows.md)** — Direct installation and
  Chocolatey options

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

Doppler installation and configuration is included in your OS-specific setup
guide above. Once Doppler is installed and you've logged in, complete these
final steps:

```bash
doppler setup --project chewy --config dev
doppler secrets download --no-file --format env > .env.local
```

> We use a shared Doppler login — ask @Thomaz for the credentials.

> Re-run the `doppler secrets download` command any time secrets are updated.

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
