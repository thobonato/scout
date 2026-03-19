# Frontend Design & Styling Guidelines

Scout is a Chewy product. The design should feel warm, friendly, and minimal — consistent with the Chewy brand.

---

## Brand Tokens

All design tokens are defined as CSS variables in `app/globals.css`. **Always use these variables — never hardcode colors or fonts.**

### Colors

```css
--chewy-blue: #00aeef /* primary actions, links, brand accents */
  --chewy-blue-dark: #0092cc /* hover state for blue */ --chewy-orange: #f4791f
  /* secondary accents, highlights, badges */ --chewy-orange-dark: #d96310
  /* hover state for orange */ --cream: #fff8f0 /* page background */
  --warm-white: #fffcf8 /* card / surface background */ --text-dark: #1a1a2e
  /* headings, primary text */ --text-mid: #4a4a6a /* body text, descriptions */;
```

In Tailwind, reference them with arbitrary values:

```tsx
<p className="text-[var(--text-dark)]">...</p>
<div className="bg-[var(--warm-white)]">...</div>
<button className="bg-[var(--chewy-blue)] hover:bg-[var(--chewy-blue-dark)]">...</button>
```

### Fonts

```css
--font-fredoka   /* display, headings, brand text */
--font-nunito    /* body, labels, UI text */
```

```tsx
<h1 className="font-[family-name:var(--font-fredoka)]">Scout</h1>
<p  className="font-[family-name:var(--font-nunito)]">Your pet's new best friend.</p>
```

**Rule of thumb:** Fredoka for anything big and expressive. Nunito for everything else.

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
<button className="bg-[var(--chewy-blue)] hover:bg-[var(--chewy-blue-dark)] text-white font-[family-name:var(--font-nunito)] font-bold px-6 py-3 rounded-full transition-colors">
  Get Started
</button>;

{
  /* Secondary — orange outline */
}
<button className="border-2 border-[var(--chewy-orange)] text-[var(--chewy-orange)] hover:bg-[var(--chewy-orange)] hover:text-white font-[family-name:var(--font-nunito)] font-bold px-6 py-3 rounded-full transition-colors">
  Learn More
</button>;

{
  /* Ghost — subtle */
}
<button className="text-[var(--text-mid)] hover:text-[var(--text-dark)] font-[family-name:var(--font-nunito)] font-semibold px-4 py-2 rounded-full hover:bg-black/5 transition-colors">
  Cancel
</button>;
```

---

## Cards

Cards use warm-white backgrounds with a soft shadow and no harsh borders.

```tsx
<div className="bg-[var(--warm-white)] rounded-2xl p-6 shadow-sm border border-black/5">
  ...
</div>
```

For a slightly elevated feel:

```tsx
<div className="bg-[var(--warm-white)] rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
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
<h1 className="font-[family-name:var(--font-fredoka)] text-6xl font-bold tracking-tight text-[var(--text-dark)]">

{/* Section heading */}
<h2 className="font-[family-name:var(--font-fredoka)] text-3xl font-semibold text-[var(--text-dark)]">

{/* Subheading */}
<h3 className="font-[family-name:var(--font-nunito)] text-xl font-bold text-[var(--text-dark)]">

{/* Body */}
<p className="font-[family-name:var(--font-nunito)] text-base text-[var(--text-mid)] leading-relaxed">

{/* Label / badge */}
<span className="font-[family-name:var(--font-nunito)] text-sm font-bold uppercase tracking-widest text-[var(--chewy-orange)]">
```

---

## What to Avoid

- **No hardcoded hex values** in component files — use CSS variables
- **No dark backgrounds** — the design is light and warm
- **No new colors** — if something feels missing, use opacity variants of existing tokens (e.g. `rgba(var(--chewy-blue), 0.1)` or Tailwind's `/10` opacity modifier)
- **No tight spacing** — when in doubt, add more padding
- **No sharp corners** — always round them
- **No heavy shadows** — use `shadow-sm` or `shadow-md` at most
