# CLAUDE.md — Project Brief for Claude Code

## Project Overview

**EDGE AI Trail... To San Diego** is an Oregon Trail-inspired choose-your-own-adventure browser game built for the [EDGE AI San Diego 2026](https://www.edgeaifoundation.org/) conference. Players navigate from an airport drop-off through flight chaos and San Diego streets to reach the EVE venue. Built by [devEco Consulting LLC](https://thedeveco.com).

## Tech Stack

- **Framework:** Next.js 16 (`next@16.0.10`)
- **UI:** React 19, TypeScript 5, Tailwind CSS 4 (via `@tailwindcss/postcss`)
- **Components:** shadcn/ui (New York style), Radix UI primitives, Lucide icons
- **Font:** Poppins — loaded locally via `next/font/local` from `app/fonts/` (no Google Fonts network dependency)
- **Backend:** Supabase (client-side only, no server-side)
- **Package manager:** pnpm

## Build & Deploy

```bash
pnpm install
pnpm dev       # local dev server
pnpm build     # production build → outputs to out/
```

- **Static export:** `output: 'export'` in `next.config.mjs`
- **Base path:** `/trail-sandiego` — the app is deployed as a subfolder of thedeveco.com
- **No Vercel dependencies:** analytics package exists in `package.json` but is not imported anywhere
- **No API routes, SSR, or middleware** — everything is client-side rendered

### Deploy Process

The built `out/` directory is copied into the [thedeveco.com](https://thedeveco.com) repo (a Vue/Vite site on GitHub Pages) at `public/trail-sandiego/` and deployed via GitHub Actions. The basePath config ensures all asset URLs are prefixed with `/trail-sandiego/`.

## Supabase Integration

- **Project URL:** `https://ypqxplnatfnrcooufpax.supabase.co`
- **Client:** Initialized in `lib/supabase.ts` with the anon (publishable) key
- **Graceful degradation:** All Supabase calls are wrapped in try/catch. The game works fully offline — Supabase failures must never break gameplay.

### Database Tables

**`journey_count`** (single row)
| Column | Type | Description |
|---|---|---|
| `count` | integer | Total journeys started |
| `pete_calls` | integer | Total Pete Bernard call interruptions |

**`leaderboard`**
| Column | Type | Description |
|---|---|---|
| `id` | serial | Primary key |
| `player_name` | text | Player's chosen name |
| `player_role` | text | developer, researcher, or executive |
| `score` | integer | Calculated score |
| `knowledge` | integer | Final knowledge stat |
| `connections` | integer | Final connections stat |
| `money` | integer | Final money stat |
| `energy` | integer | Final energy stat |
| `stress` | integer | Final stress stat |
| `created_at` | timestamptz | Auto-set on insert |

### Database RPC Functions

- `increment_journey_count()` — atomically increments `journey_count.count`
- `increment_pete_calls()` — atomically increments `journey_count.pete_calls`

### Score Calculation (unified)

Single source of truth in `lib/leaderboard.ts` → `calculateScore()`:

```
subtotal = 1000 + energy×5 + knowledge×20 + connections×50 + money×2 + (100−stress)×3 + items.length×25
score = round(subtotal × roleMultiplier)
```

Role multipliers: developer 1.0×, researcher 1.5×, executive 0.8×

The victory screen imports `calculateScore` and displays a full breakdown. The leaderboard `submitScore` uses the same function.

## Key Architecture Decisions

- **Local fonts:** Poppins `.ttf` files in `app/fonts/` loaded via `next/font/local` to avoid network dependencies and ensure reliable offline/static builds
- **No Vercel:** Static export to GitHub Pages, no Vercel-specific features
- **devEco banner:** `layout.tsx` includes a branded top banner with two links — "Experience by devEco Consulting LLC" linking to `https://thedeveco.com/consultancy` and "Register for EDGE AI San Diego" linking to the PheedLoop registration page
- **Canvas rendering:** Game scenes and the Pete call screen use `<canvas>` with `requestAnimationFrame` for pixel-art style animations
- **Client-side only:** All game state managed with React `useState`/`useCallback` in `app/page.tsx`

## File Structure

```
app/
  layout.tsx          — Root layout, Poppins font, devEco banner
  page.tsx            — Main game controller (state machine)
  globals.css         — Tailwind config, CSS variables, theme colors
  fonts/              — Poppins .ttf files (Regular, Medium, SemiBold, Bold)

components/
  title-screen.tsx    — Intro, name/role selection, journey counter, leaderboard
  game-canvas.tsx     — Pixel-art canvas renderer for each scene
  game-ui.tsx         — Stats bar, scene text, choices, inventory
  game-over-screen.tsx — Death/failure screen (includes Pete death detection)
  victory-screen.tsx  — Win screen, score animation, leaderboard, score submission
  pete-call-screen.tsx — Pete Bernard call Easter egg with canvas animation
  countdown-timer.tsx — Live countdown to EDGE AI San Diego 2026
  theme-provider.tsx  — next-themes wrapper (unused currently)
  ui/                 — shadcn/ui components

lib/
  supabase.ts         — Supabase client initialization
  journey-tracker.ts  — getJourneyCount, incrementJourneyCount, getPeteCallCount, incrementPeteCallCount
  leaderboard.ts      — submitScore, getLeaderboard, LeaderboardEntry type
  game-scenes.ts      — Scene data: titles, descriptions, choices, effects, transitions
  game-types.ts       — TypeScript types: GameScene, GameState, PlayerStats, Choice, SceneData
  utils.ts            — cn() helper (clsx + tailwind-merge)

hooks/
  use-mobile.ts       — useIsMobile hook (768px breakpoint)
  use-toast.ts        — Toast hook (shadcn/ui)

styles/
  globals.css         — Alternate globals (appears unused, app/globals.css is primary)

public/               — Favicons, placeholder images

Root files:
  next.config.mjs     — Static export, basePath, image + TS config
  package.json        — Dependencies and scripts (pnpm)
  pnpm-lock.yaml      — Lockfile (committed)
  tsconfig.json       — TypeScript config (path aliases: @/*)
  postcss.config.mjs  — Tailwind CSS via @tailwindcss/postcss
  components.json     — shadcn/ui config (New York style, lucide icons)
  .gitignore          — Ignores node_modules/, .next/, out/
  LICENSE.md          — Project license
```

## Game Mechanics

- **16 scenes** from `airport_dropoff` to `eve_entrance` (victory)
- **3 player roles:** Developer (balanced), Researcher (knowledge-focused), Executive (money-focused)
- **5 stats:** Energy (0-100), Stress (0-100), Money, Knowledge, Connections
- **Items:** Collected throughout, displayed in inventory
- **Random events:** 15% chance per choice (money found, coffee, rain, etc.)
- **Game over:** Energy hits 0 or Stress hits 100
- **Pete Bernard Easter egg:** 33% chance per playthrough — a random scene triggers an intercepting phone call. All 4 choices lead to humorous deaths.
- **Countdown timer:** Fixed reference date countdown shown on every screen

## Important Conventions

- All game logic is client-side — no API routes, no SSR, no middleware
- Supabase errors must never break gameplay (all calls wrapped in try/catch)
- The `typescript.ignoreBuildErrors: true` flag is set in next.config.mjs
- Images are unoptimized (`images.unoptimized: true`) for static export compatibility
- `styles/globals.css` exists but is unused; `app/globals.css` is the active stylesheet
- `pnpm-lock.yaml` is committed to the repo
- `@vercel/analytics` remains in `package.json` but is not imported anywhere

## Session End Checklist

Before finishing any Claude Code session, update these files if changes were made:

1. **CLAUDE.md** — Update if architecture, tables, conventions, or file structure changed
2. **CHANGELOG.md** — Add entries for all user-facing or structural changes
3. **README.md** — Update if setup steps, deploy process, or Supabase schema changed
