# Design Brief

## Direction

**DocBrain** — Confident, modern AI-powered document intelligence platform. Dark-themed productivity tool with vibrant accents and smooth animations.

## Tone

High-energy, bold minimalism — inspired by Stripe's confidence and Linear's refinement. Vivid violet primary with warm amber accents, never timid.

## Differentiation

Animated Gemini-like rainbow gradient border on AI chat responses with hue rotation. Every loading state uses skeleton animations. Sidebar collapses/expands with spring physics.

## Color Palette

| Token          | OKLCH            | Role                                    |
| -------------- | ---------------- | --------------------------------------- |
| background     | 0.16 0.02 280    | Primary dark surface                    |
| foreground     | 0.95 0.01 280    | Primary text, high contrast             |
| card           | 0.2 0.025 280    | Elevated surface layer                  |
| primary        | 0.65 0.25 300    | Vivid violet — CTAs, highlights         |
| accent         | 0.75 0.18 55     | Warm amber — secondary interactions     |
| muted          | 0.25 0.03 280    | Secondary background, metadata          |
| destructive    | 0.55 0.22 25     | Error, delete, destructive actions      |

## Typography

- **Display**: Space Grotesk — headings, hero text (bold, tech-forward)
- **Body**: DM Sans — body copy, labels, UI text (clean, readable)
- **Mono**: Geist Mono — code snippets, file names, metadata
- **Scale**: Hero `text-4xl md:text-6xl font-bold tracking-tight`, H2 `text-2xl md:text-4xl font-bold`, Label `text-xs md:text-sm font-semibold uppercase tracking-widest`, Body `text-base leading-relaxed`

## Elevation & Depth

Minimal shadowing, stratified surfaces via background color shifts. Cards elevated via `bg-card` (0.2 L) against `bg-background` (0.16 L). No glows, no halos.

## Structural Zones

| Zone    | Background        | Border           | Notes                              |
| ------- | ----------------- | ---------------- | ---------------------------------- |
| Sidebar | `bg-sidebar` card | `border-b` light | Collapsible, sticky nav            |
| Header  | `bg-background`   | `border-b` light | Breadcrumbs, user menu             |
| Content | `bg-background`   | —                | Alternates: chat, upload, docs     |
| Footer  | `bg-muted/30`     | `border-t` light | Status, metadata                   |

## Spacing & Rhythm

Compact base density (`gap-3` to `gap-6`), spacious section separators (`gap-8` to `gap-12`). Micro-spacing `px-3 py-2`. Content sections alternate `bg-background` and `bg-muted/20` for rhythm.

## Component Patterns

- **Buttons**: Violet primary + amber secondary. `rounded-lg`, no shadow. Hover: opacity 0.9, scale 0.98.
- **Cards**: `bg-card`, `border-border`, `rounded-lg`. Entrance: fade-in + slide-up (staggered 50ms).
- **Chat Bubbles**: User (right-aligned, `bg-primary/20`). AI (left-aligned, `bg-card` with animated rainbow border, gradient-rotate 3s).
- **Skeleton**: Shimmer gradient `muted → card → muted`, 1.5s loop. Used on document list, chat history, upload preview.
- **Badges**: Violet/amber, `rounded-full`, `px-3 py-1`, small caps.

## Motion

- **Entrance**: 0.4s `slide-up` with ease-out. Staggered card animations (50ms per item, max 5 items = 200ms stagger).
- **Hover**: 0.3s `transition-smooth`. Scale 0.98, opacity shift.
- **Decorative**: Gradient-rotate 3s on AI bubbles. Pulse-ring 2s on upload drop zone. Sidebar collapse/expand: 0.3s spring ease.
- **Loading**: Skeleton shimmer 1.5s loop. Progress bar: 0.5s smooth width transition.

## Constraints

- Never use raw hex or named colors — only OKLCH tokens via CSS variables.
- Favor `transform` over layout shifts (100% fps target). Use `will-change: transform` on animated elements.
- Sidebar collapse/expand must use CSS Grid or Flexbox width, not absolute positioning.
- All interactive elements: hover state + focus ring (`:focus-visible` with `ring-primary`).
- Document upload progress bar and chat skeleton must be 60fps-capable (use `background-position` animation, not JS).

## Signature Detail

**Animated rainbow gradient border on AI chat responses** — 3-second hue rotation through violet → cyan → magenta → amber, signaling AI intelligence without gimmickry. The gradient is computed via OKLCH hue angles baked into CSS, not a garish animated overlay.
