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

export interface ScoreBreakdown {
  base: number
  energyBonus: number
  knowledgeBonus: number
  connectionsBonus: number
  moneyBonus: number
  stressBonus: number
  itemBonus: number
  roleMultiplier: number
  total: number
}

export function calculateScore(
  stats: PlayerStats,
  playerRole: string
): ScoreBreakdown {
  const base = 1000
  const energyBonus = stats.energy * 5
  const knowledgeBonus = stats.knowledge * 20
  const connectionsBonus = stats.connections * 50
  const moneyBonus = stats.money * 2
  const stressBonus = (100 - stats.stress) * 3
  const itemBonus = stats.items.length * 25

  const roleMultiplier =
    playerRole === "developer" ? 1.0 : playerRole === "researcher" ? 1.5 : 0.8

  const subtotal =
    base + energyBonus + knowledgeBonus + connectionsBonus + moneyBonus + stressBonus + itemBonus
  const total = Math.round(subtotal * roleMultiplier)

  return {
    base,
    energyBonus,
    knowledgeBonus,
    connectionsBonus,
    moneyBonus,
    stressBonus,
    itemBonus,
    roleMultiplier,
    total,
  }
}

export async function submitScore(
  playerName: string,
  playerRole: string,
  stats: PlayerStats
): Promise<void> {
  try {
    const { total: score } = calculateScore(stats, playerRole)
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

export async function getLeaderboard(limit = 100): Promise<LeaderboardEntry[]> {
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
