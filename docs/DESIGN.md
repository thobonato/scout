# Scout Design System

The single source of truth for all visual design decisions across Scout.

---

## Colors

### Brand Colors

| Name              | Hex       | CSS Variable          | Tailwind Class                                   | Usage                                                                                     |
| ----------------- | --------- | --------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Chewy Blue        | `#00aeef` | `--chewy-blue`        | `text-chewy-blue`, `bg-chewy-blue`               | Primary brand color. Logo, links, interactive accents, divider paw icons, primary buttons |
| Chewy Blue Dark   | `#0092cc` | `--chewy-blue-dark`   | `text-chewy-blue-dark`, `bg-chewy-blue-dark`     | Hover/active state for blue elements                                                      |
| Chewy Orange      | `#f4791f` | `--chewy-orange`      | `text-chewy-orange`, `bg-chewy-orange`           | Secondary brand color. Badges, background paw prints, accent dots, bottom bar icons       |
| Chewy Orange Dark | `#d96310` | `--chewy-orange-dark` | `text-chewy-orange-dark`, `bg-chewy-orange-dark` | Hover/active state for orange elements                                                    |

### Background Colors

| Name       | Hex       | CSS Variable   | Tailwind Class  | Usage                                                                                    |
| ---------- | --------- | -------------- | --------------- | ---------------------------------------------------------------------------------------- |
| Cream      | `#fff8f0` | `--cream`      | `bg-cream`      | Default page background, bottom bar overlay                                              |
| Warm White | `#fffcf8` | `--warm-white` | `bg-warm-white` | Lighter background variant for cards or sections that need subtle contrast against cream |

### Background Gradient

The full-page background uses a warm gradient instead of a flat color:

```css
background: linear-gradient(160deg, #fff8f0 0%, #fef3e2 50%, #fff0e8 100%);
```

| Stop | Hex       | Description               |
| ---- | --------- | ------------------------- |
| 0%   | `#fff8f0` | Cream (matches `--cream`) |
| 50%  | `#fef3e2` | Warm peach midpoint       |
| 100% | `#fff0e8` | Soft blush endpoint       |

Applied via the `.bg-page` utility class.

### Text Colors

| Name       | Hex       | CSS Variable   | Tailwind Class    | Usage                                                             |
| ---------- | --------- | -------------- | ----------------- | ----------------------------------------------------------------- |
| Text Dark  | `#1a1a2e` | `--text-dark`  | `text-text-dark`  | Headlines, primary text — near-black with a slight blue undertone |
| Text Mid   | `#4a4a6a` | `--text-mid`   | `text-text-mid`   | Subheadlines, secondary text                                      |
| Text Muted | `#7a7a9a` | `--text-muted` | `text-text-muted` | Taglines, captions, footer text                                   |

### Derived / Transparent Colors

These are not standalone tokens — they are opacity variants of brand colors used in specific contexts.

| Value                                       | Usage                               |
| ------------------------------------------- | ----------------------------------- |
| `chewy-orange/10` (`rgba(244,121,31,0.10)`) | Badge background fill               |
| `chewy-orange/25` (`rgba(244,121,31,0.25)`) | Badge border                        |
| `chewy-orange/10` (`rgba(244,121,31,0.10)`) | Bottom bar top border               |
| `cream/60` (`rgba(255,248,240,0.6)`)        | Bottom bar frosted-glass background |
| White `#ffffff`                             | Button text on orange backgrounds   |

---

## Typography

### Font Families

| Font        | CSS Variable     | Tailwind Class | Weights Loaded          | Usage                                                         |
| ----------- | ---------------- | -------------- | ----------------------- | ------------------------------------------------------------- |
| **Fredoka** | `--font-fredoka` | `font-fredoka` | 300, 400, 500, 600, 700 | Headlines, logo text, subheadlines — the playful display face |
| **Nunito**  | `--font-nunito`  | `font-nunito`  | 400, 600, 700, 800      | Body text, badges, taglines, footer — the readable workhorse  |

Both are loaded via `next/font/google` in `app/layout.tsx`.

### Type Scale

| Element                        | Font    | Weight | Size                         | Tracking  | Leading | Color        |
| ------------------------------ | ------- | ------ | ---------------------------- | --------- | ------- | ------------ |
| Logo ("chewy")                 | Fredoka | 600    | `2rem`                       | `-0.01em` | 1       | Chewy Blue   |
| Hero title ("Scout")           | Fredoka | 700    | `clamp(5rem, 18vw, 10rem)`   | `-0.02em` | 0.92    | Text Dark    |
| Subheadline ("is coming soon") | Fredoka | 400    | `clamp(1.4rem, 4vw, 2rem)`   | `-0.01em` | default | Text Mid     |
| Eyebrow badge ("introducing")  | Nunito  | 700    | `0.85rem`                    | `0.18em`  | default | Chewy Orange |
| Tagline body                   | Nunito  | 600    | `clamp(1rem, 2.5vw, 1.2rem)` | default   | relaxed | Text Muted   |
| Footer text                    | Nunito  | 700    | `0.8rem`                     | `0.06em`  | default | Text Muted   |

---

## Component Patterns

### Badge / Pill

Used for eyebrow labels ("introducing", "404").

```
font:        Nunito 700, 0.85rem, uppercase, tracking 0.18em
color:       Chewy Orange
background:  chewy-orange at 10% opacity
border:      1.5px solid chewy-orange at 25% opacity
radius:      full (999px)
padding:     4px 14px
```

### CTA Button

Used on the 404 page "Head Home" action.

```
font:        Nunito 700, 0.95rem, tracking 0.02em
color:       White (#fff)
background:  Chewy Orange (#f4791f)
hover bg:    Chewy Orange Dark (#d96310)
radius:      full (999px)
padding:     12px 28px
shadow:      0 4px 16px rgba(244,121,31,0.25)
transition:  background 0.2s, transform 0.15s
hover:       translateY(-1px)
```

### Bottom Bar

Persistent footer strip across all pages.

```
background:  cream at 60% opacity + backdrop-blur(12px)
border-top:  1px solid chewy-orange at 10% opacity
padding:     16px
z-index:     20
```

---

## Iconography

### Paw Icon

The only icon in the current system. Used as an inline SVG composed of five ellipses (four toe pads + one main pad).

| Context             | Color        | Size    | Opacity                   |
| ------------------- | ------------ | ------- | ------------------------- |
| Logo lockup         | Chewy Blue   | 42px    | 1.0                       |
| Background floating | Chewy Orange | 28–64px | 0.05–0.10 (via animation) |
| Divider row         | Chewy Blue   | 16px    | 0.35                      |
| Bottom bar          | Chewy Orange | 14px    | 0.50                      |
| CTA button inline   | White        | 16px    | 1.0                       |

---

## Animations

| Class              | Keyframes | Duration | Easing                           | Usage                                      |
| ------------------ | --------- | -------- | -------------------------------- | ------------------------------------------ |
| `.animate-fade-up` | `fade-up` | 0.7s     | `cubic-bezier(0.22, 1, 0.36, 1)` | Staggered entrance for most content blocks |
| `.animate-pop-in`  | `pop-in`  | 0.6s     | `cubic-bezier(0.22, 1, 0.36, 1)` | Hero title entrance with scale bounce      |
| `.animate-fade-in` | `fade-in` | 0.8s     | `ease`                           | Subtle elements (dividers, bottom bar)     |
| `.animate-wag`     | `wag`     | 2.4s     | `ease-in-out`, infinite          | Logo paw icon gentle rotation              |
| `.paw-bg`          | `drift`   | 7–14s    | `linear`, infinite               | Background floating paw prints             |

All entrance animations use `animation-fill-mode: both` and are staggered via inline `animationDelay` values ranging from `0.1s` to `1.3s`.

---

## Surfaces & Effects

| Effect        | Value                                                                        | Usage                              |
| ------------- | ---------------------------------------------------------------------------- | ---------------------------------- |
| Noise texture | Inline SVG `feTurbulence` (fractalNoise, freq 0.9, 4 octaves) at 40% opacity | Full-page overlay for subtle grain |
| Frosted glass | `backdrop-filter: blur(12px)` + semi-transparent background                  | Bottom bar                         |
| Button shadow | `0 4px 16px rgba(244,121,31,0.25)`                                           | CTA buttons                        |

---

## Quick Reference — Copy-Paste Hex Values

```
Brand Blue:        #00aeef
Brand Blue Dark:   #0092cc
Brand Orange:      #f4791f
Brand Orange Dark: #d96310
Cream:             #fff8f0
Warm White:        #fffcf8
Gradient Mid:      #fef3e2
Gradient End:      #fff0e8
Text Dark:         #1a1a2e
Text Mid:          #4a4a6a
Text Muted:        #7a7a9a
White:             #ffffff
```
