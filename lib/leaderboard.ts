import { supabase } from "./supabase"
import type { PlayerStats } from "./game-types"

export interface LeaderboardEntry {
  id: number
  player_name: string
  player_role: string
  score: number
  knowledge: number
  connections: number
  money: number
  energy: number
  stress: number
  created_at: string
}

function calculateScore(stats: PlayerStats): number {
  return Math.round(
    stats.knowledge + stats.connections + stats.money / 10 + (100 - stats.stress) + stats.energy
  )
}

export async function submitScore(
  playerName: string,
  playerRole: string,
  stats: PlayerStats
): Promise<void> {
  try {
    const score = calculateScore(stats)
    await supabase.from("leaderboard").insert({
      player_name: playerName,
      player_role: playerRole,
      score,
      knowledge: stats.knowledge,
      connections: stats.connections,
      money: stats.money,
      energy: stats.energy,
      stress: stats.stress,
    })
  } catch {
    // Silently fail — game should work without Supabase
  }
}

export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("score", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data ?? []
  } catch {
    return []
  }
}
