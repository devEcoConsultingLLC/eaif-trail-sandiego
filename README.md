# EDGE AI Trail... To San Diego

An Oregon Trail-inspired choose-your-own-adventure browser game for the [EDGE AI San Diego 2026](https://www.edgeaifoundation.org/) conference. Navigate from your airport drop-off through flight chaos and San Diego streets to reach the EVE venue.

Built by [devEco Consulting LLC](https://thedeveco.com).

<!-- TODO: Add screenshot -->

## Tech Stack

- **Next.js 16** with static export
- **React 19** + TypeScript 5
- **Tailwind CSS 4** (via `@tailwindcss/postcss`)
- **shadcn/ui** (New York style) + Radix UI + Lucide icons
- **Supabase** for journey counter and leaderboard
- **Poppins** font (local files, no network dependency)

## Getting Started

```bash
pnpm install
pnpm dev          # Start dev server
pnpm build        # Build static export → out/
```

The dev server runs at `http://localhost:3000/trail-sandiego/`.

## How It Deploys

This app is a **static export** (`output: 'export'` with `basePath: '/trail-sandiego'`). The built `out/` directory is copied into the [thedeveco.com](https://thedeveco.com) repo at `public/trail-sandiego/` and deployed to GitHub Pages via GitHub Actions.

Live at: [thedeveco.com/trail-sandiego/](https://thedeveco.com/trail-sandiego/)

## Supabase Setup

The game uses Supabase for optional persistence (journey counter + leaderboard). All Supabase calls are wrapped in try/catch — the game works fully without it.

### Tables

**`journey_count`** — Single-row counter table

```sql
CREATE TABLE journey_count (
  id integer PRIMARY KEY DEFAULT 1,
  count integer NOT NULL DEFAULT 0,
  pete_calls integer NOT NULL DEFAULT 0
);

INSERT INTO journey_count (id, count, pete_calls) VALUES (1, 0, 0);
```

**`leaderboard`** — Player scores

```sql
CREATE TABLE leaderboard (
  id serial PRIMARY KEY,
  player_name text NOT NULL,
  player_role text NOT NULL,
  score integer NOT NULL,
  knowledge integer NOT NULL DEFAULT 0,
  connections integer NOT NULL DEFAULT 0,
  money integer NOT NULL DEFAULT 0,
  energy integer NOT NULL DEFAULT 0,
  stress integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

### RPC Functions

```sql
CREATE OR REPLACE FUNCTION increment_journey_count()
RETURNS void AS $$
  UPDATE journey_count SET count = count + 1 WHERE id = 1;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION increment_pete_calls()
RETURNS void AS $$
  UPDATE journey_count SET pete_calls = pete_calls + 1 WHERE id = 1;
$$ LANGUAGE sql;
```

### RLS Policies

Enable Row Level Security on both tables, then add policies:

```sql
-- journey_count: anyone can read and call RPC
ALTER TABLE journey_count ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON journey_count FOR SELECT USING (true);

-- leaderboard: anyone can read and insert
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON leaderboard FOR INSERT WITH CHECK (true);
```

### Score Calculation

Leaderboard score: `knowledge + connections + (money / 10) + (100 - stress) + energy`

## Game Mechanics

### Scenes

16 scenes form the journey: Airport Drop-Off, Terminal Entrance, Luggage Dilemma, Security Line, TSA Checkpoint, Food Court, Gate Rush, Boarding, Plane Seat, In-Flight Adventures, Descent, San Diego Arrival, Transport Choice, Downtown Journey, Approaching EVE, and the final EVE Entrance (victory).

### Roles

| Role | Starting Money | Starting Knowledge | Special |
|---|---|---|---|
| Developer | $120 | 10 | Balanced |
| Researcher | $80 | 20 | Less energy (90) |
| Executive | $250 | 0 | Higher stress (20) |

### Stats

- **Energy** (0-100): Depleted by actions. Reaching 0 = game over.
- **Stress** (0-100): Increased by bad choices. Reaching 100 = game over.
- **Money**: Spent on food, transport, tips. Some choices require minimum funds.
- **Knowledge**: Gained through learning opportunities and conversations.
- **Connections**: Built by networking with other travelers and attendees.

### Pete Bernard Easter Egg

There is a 33% chance per playthrough that Pete Bernard (CEO, EDGE AI Foundation) will call your phone at a random scene. All four response choices lead to humorous, unique death scenarios. There is no surviving Pete's call.

### Random Events

Each choice has a 15% chance to trigger a random event (finding money, phone battery issues, a stranger buying coffee, overhearing conversations, meeting colleagues, or sudden rain).

## License

See [LICENSE.md](LICENSE.md).

## Links

- [thedeveco.com](https://thedeveco.com)
- [EDGE AI Foundation](https://www.edgeaifoundation.org/)
