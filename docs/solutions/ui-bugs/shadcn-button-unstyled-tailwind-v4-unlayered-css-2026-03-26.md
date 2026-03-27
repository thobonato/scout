---
title: "shadcn/ui Button Unstyled — Unlayered CSS Overriding Tailwind v4 Utilities"
date: 2026-03-26
problem_type: ui_bug
component: frontend_stimulus
root_cause: config_error
resolution_type: code_fix
severity: high
tags:
  - tailwind-v4
  - shadcn-ui
  - css-cascade
  - css-layers
  - globals-css
  - nextjs
---

## Problem

In a Next.js 16 / Tailwind CSS v4 / shadcn/ui project, the Button component rendered as completely unstyled plain text — no background, padding, or border-radius — despite being correctly installed and imported.

## Symptoms

- Button appeared as plain unstyled text/link with no visual styling
- `px-8` Tailwind utility class was present in the DOM but padding was not applied
- `bg-primary` class was present but the button appeared white/transparent
- Hard refresh and cache clearing did not resolve the issue
- CSS was confirmed loading via network inspection — the problem was cascade priority, not delivery

## What Didn't Work

- **Created `tailwind.config.ts`** — Tailwind v4 is CSS-first and does not use a config file; creating one would break the setup, not fix it
- **Hard refresh alone** — issue persisted because it was a cascade layer conflict, not a browser caching problem
- **Inspecting network assets** — confirmed CSS was loading but did not surface the layer conflict

## Solution

Move all CSS reset rules and body defaults from outside any `@layer` into `@layer base` in `globals.css`.

**Before (broken — unlayered CSS beats all `@layer` rules):**

```css
/* globals.css — these are outside any @layer */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0; /* ← overrides px-8 in @layer utilities */
}

body {
  background: var(--cream);
  color: var(--text-dark);
  font-family: var(--font-nunito);
  overflow-x: hidden;
}
```

**After (fixed — `@layer base` lets `@layer utilities` override as intended):**

```css
/* globals.css — wrapped in @layer base */
@layer base {
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background: var(--cream);
    color: var(--text-dark);
    font-family: var(--font-nunito);
    overflow-x: hidden;
  }
}
```

After editing `globals.css`, clear the Next.js build cache and restart:

```bash
rm -rf .next
pnpm dev
# Hard refresh browser: Cmd+Shift+R
```

## Why This Works

Tailwind v4 uses CSS cascade layers with a defined priority order:

```
@layer base  <  @layer components  <  @layer utilities  <  unlayered CSS
```

Any CSS written **outside** all `@layer` blocks is "unlayered" and wins over every layered rule regardless of specificity or source order. The `padding: 0` on the `*` selector was unlayered, so it silently overrode the button's `px-8` (which lives in `@layer utilities`). Moving the reset into `@layer base` restores the expected priority, allowing utility classes to win as intended.

This is a deliberate change from Tailwind v3, where `tailwind.config.ts` preflight handled resets automatically inside the layer system.

## Prevention

- **Always wrap custom CSS in a `@layer` block** in Tailwind v4 projects. Use `@layer base` for resets and element defaults, `@layer components` for component abstractions, `@layer utilities` for custom utility classes. Never write bare CSS outside a layer unless you explicitly want it to override everything — including all utilities.

- **Do not create `tailwind.config.ts`** in a Tailwind v4 project. Configuration belongs in `globals.css`. A config file will conflict with the CSS-first setup.

- **Keep shadcn imports at the top of `globals.css`** before any `@layer` declarations:

  ```css
  @import "tailwindcss";
  @import "tw-animate-css";
  @import "shadcn/tailwind.css";
  ```

- **When debugging missing styles**, open browser DevTools → Styles panel → look for strikethrough rules. In Tailwind v4, an unlayered `* { padding: 0 }` will appear winning over the utility class. The "Cascade" panel in Chrome DevTools shows layer origins explicitly.

- **Treat CSS resets as `@layer base` concerns** — they are defaults to be overridden, not absolute rules. This is the mental model Tailwind v4 is built around.
