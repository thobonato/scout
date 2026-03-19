# Frontend Design & Styling Guidelines

Scout is a Chewy product. The design should feel warm, friendly, and minimal — consistent with the Chewy brand.

---

## Brand Tokens

All design tokens are defined as CSS variables in `app/globals.css` and registered as Tailwind utilities via `@theme inline`. **Always use the Tailwind classes — never hardcode hex values.**

### Colors

| Token                 | Value     | Tailwind class                          | Use for                               |
| --------------------- | --------- | --------------------------------------- | ------------------------------------- |
| `--scout-blue`        | `#1C49C2` | `bg-scout-blue` / `text-scout-blue`     | Primary actions, links, brand accents |
| `--scout-blue-dark`   | `#1640a8` | `bg-scout-blue-dark`                    | Hover state for scout-blue            |
| `--chewy-orange`      | `#f4791f` | `bg-chewy-orange` / `text-chewy-orange` | Secondary accents, highlights, badges |
| `--chewy-orange-dark` | `#d96310` | `bg-chewy-orange-dark`                  | Hover state for orange                |
| `--cream`             | `#fff8f0` | `bg-cream`                              | Page background                       |
| `--warm-white`        | `#fffcf8` | `bg-warm-white`                         | Card / surface background             |
| `--text-dark`         | `#121212` | `text-text-dark`                        | Headings, primary text                |
| `--text-mid`          | `#4a4a6a` | `text-text-mid`                         | Body text, descriptions               |
| `--text-muted`        | `#7a7a9a` | `text-text-muted`                       | Captions, footer text                 |

Use Tailwind's `/` opacity modifier for transparent variants:

```tsx
<div className="bg-chewy-orange/10 border border-chewy-orange/25">  {/* tinted badge background */}
<div className="bg-cream/60 backdrop-blur-md">                      {/* frosted glass strip */}
```

### Fonts

| Token            | Use for                       | Tailwind class |
| ---------------- | ----------------------------- | -------------- |
| `--font-fredoka` | Display, headings, brand text | `font-fredoka` |
| `--font-nunito`  | Body, labels, UI text         | `font-nunito`  |

```tsx
<h1 className="font-fredoka">Scout</h1>
<p  className="font-nunito">Your pet's new best friend.</p>
```

**Rule of thumb:** Fredoka for anything big and expressive. Nunito for everything else.

### Page background

Use the `.bg-page` utility class for full-page wrappers — it applies the warm gradient:

```tsx
<div className="bg-page min-h-screen">
```

---

## Aesthetic

- **Minimal** — whitespace is part of the design, not empty space to fill
- **Warm** — cream and warm-white backgrounds, never stark white or dark/gray heavy layouts
- **Friendly** — rounded corners, soft shadows, approachable typography
- **Chewy-aligned** — blue and orange are the only accent colors; don't introduce new colors

---

## Spacing

Use Tailwind's default spacing scale. Prefer larger spacing over cramped layouts.

| Use                         | Tailwind           |
| --------------------------- | ------------------ |
| Between sections            | `gap-16` / `py-16` |
| Inside cards                | `p-6` / `p-8`      |
| Between elements in a group | `gap-3` / `gap-4`  |
| Inline tight elements       | `gap-2`            |

---

## Border Radius

Always use rounded corners. The design is soft, not boxy.

| Use               | Tailwind       |
| ----------------- | -------------- |
| Cards, containers | `rounded-2xl`  |
| Buttons           | `rounded-full` |
| Badges, tags      | `rounded-full` |
| Inputs            | `rounded-xl`   |
| Small chips       | `rounded-lg`   |

---

## Buttons

```tsx
{
  /* Primary — blue, full pill */
}
<button className="bg-scout-blue hover:bg-scout-blue-dark text-white font-nunito font-bold px-6 py-3 rounded-full transition-colors">
  Get Started
</button>;

{
  /* Secondary — orange outline */
}
<button className="border-2 border-chewy-orange text-chewy-orange hover:bg-chewy-orange hover:text-white font-nunito font-bold px-6 py-3 rounded-full transition-colors">
  Learn More
</button>;

{
  /* Ghost — subtle */
}
<button className="text-text-mid hover:text-text-dark font-nunito font-semibold px-4 py-2 rounded-full hover:bg-black/5 transition-colors">
  Cancel
</button>;
```

---

## Cards

Cards use warm-white backgrounds with a soft shadow and no harsh borders.

```tsx
<div className="bg-warm-white rounded-2xl p-6 shadow-sm border border-black/5">
  ...
</div>
```

For a slightly elevated feel:

```tsx
<div className="bg-warm-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
  ...
</div>
```

---

## Animations

Animation classes are defined in `app/globals.css`. Use them — don't write new keyframes unless genuinely necessary.

| Class             | Effect                         | Use for                        |
| ----------------- | ------------------------------ | ------------------------------ |
| `animate-fade-up` | Fades in while sliding up      | Page sections, cards appearing |
| `animate-pop-in`  | Scales up with a slight bounce | Hero elements, key callouts    |
| `animate-fade-in` | Simple fade                    | Subtle reveals, overlays       |
| `animate-wag`     | Gentle side-to-side rotation   | Icon accents, logo paw         |

Stagger animations with `animationDelay` for a polished entrance:

```tsx
<div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>First</div>
<div className="animate-fade-up" style={{ animationDelay: "0.25s" }}>Second</div>
<div className="animate-fade-up" style={{ animationDelay: "0.4s" }}>Third</div>
```

---

## Typography Scale

```tsx
{/* Display / hero */}
<h1 className="font-fredoka text-6xl font-bold tracking-tight text-text-dark">

{/* Section heading */}
<h2 className="font-fredoka text-3xl font-semibold text-text-dark">

{/* Subheading */}
<h3 className="font-nunito text-xl font-bold text-text-dark">

{/* Body */}
<p className="font-nunito text-base text-text-mid leading-relaxed">

{/* Label / badge */}
<span className="font-nunito text-sm font-bold uppercase tracking-widest text-chewy-orange">

{/* Caption / muted */}
<p className="font-nunito text-sm text-text-muted">
```

---

## What to Avoid

- **No hardcoded hex values** in component files — use Tailwind classes (`text-scout-blue`, not `text-[#1c49c2]`)
- **No `var()` references in JSX** — use Tailwind classes; `var()` is only for SVG `fill`/`stroke` props that don't accept classes
- **No dark backgrounds** — the design is light and warm
- **No new colors** — if something feels missing, use opacity variants (`text-text-mid/70`, `bg-chewy-orange/10`)
- **No tight spacing** — when in doubt, add more padding
- **No sharp corners** — always round them
- **No heavy shadows** — use `shadow-sm` or `shadow-md` at most

---

## shadcn/ui Components

Scout uses shadcn/ui. Generated components live in `components/ui/` — **never edit these files directly**.

To extend a shadcn component, wrap it in a new component in `components/`:

```tsx
// components/PrimaryButton/PrimaryButton.tsx
import { Button } from "@/components/ui/button";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function PrimaryButton({ children, onClick }: PrimaryButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="bg-scout-blue hover:bg-scout-blue-dark text-white font-nunito font-bold rounded-full"
    >
      {children}
    </Button>
  );
}
```

Available components: `dialog`, `sheet`, `badge`, `button`, `skeleton`.
