# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [0.1.0] - 2026-03-19

### Added
- Initial Oregon Trail-inspired choose-your-own-adventure game (v0-generated base)
- 16 game scenes from airport drop-off to EVE venue entrance
- 3 player roles: Developer, Researcher, Executive with unique starting stats
- 5 player stats: Energy, Stress, Money, Knowledge, Connections
- Item inventory system
- Random event system (15% chance per choice)
- Pixel-art canvas animations for each scene
- Game over conditions (energy depletion, stress overload)
- Victory screen with animated score calculation
- Pete Bernard phone call Easter egg (33% chance per playthrough, always fatal)
- Countdown timer to EDGE AI San Diego 2026 on all screens
- Static export configuration (`output: 'export'`, `basePath: '/trail-sandiego'`)
- Local Poppins font files via `next/font/local` (replaced `next/font/google` for network-independent builds)
- devEco branded banner in layout.tsx linking to https://thedeveco.com/consultancy
- Supabase integration for journey counter on title screen (`journey_count` table, `increment_journey_count()` RPC)
- Supabase leaderboard: score submission on victory, top 10 display on title and victory screens (`leaderboard` table)
- Pete call counter via Supabase (`pete_calls` column, `increment_pete_calls()` RPC, displayed on Pete call ringing screen)
- CLAUDE.md project brief for session continuity
- CHANGELOG.md (this file)
- README.md with setup, deploy, and Supabase documentation

### Removed
- Vercel Analytics import (package remains in dependencies but is not used)
- Google Fonts network dependency (replaced with local font files)
