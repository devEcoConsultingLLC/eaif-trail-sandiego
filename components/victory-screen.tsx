"use client"

import { Button } from "@/components/ui/button"
import type { PlayerStats } from "@/lib/game-types"
import { useEffect, useState, useRef, useMemo } from "react"
import { submitScore, getLeaderboard, calculateScore, type LeaderboardEntry } from "@/lib/leaderboard"

interface VictoryScreenProps {
  stats: PlayerStats
  playerName: string
  playerRole: string
  onRestart: () => void
}

export function VictoryScreen({ stats, playerName, playerRole, onRestart }: VictoryScreenProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const submitted = useRef(false)

  const breakdown = useMemo(() => calculateScore(stats, playerRole), [stats, playerRole])

  useEffect(() => {
    // Animate score
    let current = 0
    const step = breakdown.total / 50
    const interval = setInterval(() => {
      current += step
      if (current >= breakdown.total) {
        setAnimatedScore(breakdown.total)
        clearInterval(interval)
      } else {
        setAnimatedScore(Math.round(current))
      }
    }, 30)

    // Submit score to leaderboard (once)
    if (!submitted.current) {
      submitted.current = true
      submitScore(playerName, playerRole, stats)
    }

    return () => clearInterval(interval)
  }, [breakdown, playerRole, playerName, stats])

  const handleShowLeaderboard = async () => {
    const entries = await getLeaderboard(100)
    setLeaderboard(entries)
    setShowLeaderboard(true)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 text-white font-[Poppins] overflow-hidden relative">
      {/* Confetti animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ["#00e7ad", "#fffe01", "#42fffe", "#5f2bef", "#0084ff"][i % 5],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-lg w-full text-center space-y-6 relative z-10">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#00e7ad]">YOU MADE IT!</h1>
        <p className="text-xl text-[#42fffe]">Welcome to EDGE AI San Diego 2026!</p>

        <div className="bg-black/30 rounded-xl p-6 border border-[#00e7ad]/30 space-y-4">
          <div>
            <div className="text-[#787878] text-sm">Traveler</div>
            <div className="text-2xl font-bold text-[#00e7ad]">{playerName}</div>
            <div className="text-sm text-[#5f2bef] capitalize">{playerRole}</div>
          </div>

          <div className="text-center py-4">
            <div className="text-[#787878] text-sm mb-2">FINAL SCORE</div>
            <div className="text-5xl font-bold text-[#fffe01]">{animatedScore.toLocaleString()}</div>
          </div>

          {/* Score breakdown */}
          <div className="text-left text-xs space-y-1 border-t border-[#787878]/30 pt-3">
            <div className="text-[#787878] font-medium mb-2 text-center uppercase tracking-wider">Score Breakdown</div>
            <div className="flex justify-between"><span className="text-[#787878]">Base Score</span><span className="text-[#F0F0F0]">+{breakdown.base}</span></div>
            <div className="flex justify-between"><span className="text-[#787878]">Energy Bonus</span><span className="text-[#00e7ad]">+{breakdown.energyBonus}</span></div>
            <div className="flex justify-between"><span className="text-[#787878]">Knowledge Bonus</span><span className="text-[#42fffe]">+{breakdown.knowledgeBonus}</span></div>
            <div className="flex justify-between"><span className="text-[#787878]">Connections Bonus</span><span className="text-[#5f2bef]">+{breakdown.connectionsBonus}</span></div>
            <div className="flex justify-between"><span className="text-[#787878]">Money Bonus</span><span className="text-[#fffe01]">+{breakdown.moneyBonus}</span></div>
            <div className="flex justify-between"><span className="text-[#787878]">Low Stress Bonus</span><span className="text-[#00e7ad]">+{breakdown.stressBonus}</span></div>
            <div className="flex justify-between"><span className="text-[#787878]">Item Bonus ({stats.items.length} items)</span><span className="text-[#42fffe]">+{breakdown.itemBonus}</span></div>
            <div className="flex justify-between border-t border-[#787878]/30 pt-1 mt-1"><span className="text-[#787878]">Role Multiplier <span className="capitalize">({playerRole})</span></span><span className="text-[#F0F0F0] font-bold">×{breakdown.roleMultiplier}</span></div>
            <div className="flex justify-between border-t border-[#00e7ad]/30 pt-2 mt-1"><span className="text-[#00e7ad] font-bold">TOTAL</span><span className="text-[#fffe01] font-bold">{breakdown.total.toLocaleString()}</span></div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="bg-black/20 rounded-lg p-2">
              <div className="text-[#00e7ad] font-bold">{stats.energy}%</div>
              <div className="text-[#787878] text-xs">Energy</div>
            </div>
            <div className="bg-black/20 rounded-lg p-2">
              <div className="text-[#42fffe] font-bold">{stats.knowledge}</div>
              <div className="text-[#787878] text-xs">Knowledge</div>
            </div>
            <div className="bg-black/20 rounded-lg p-2">
              <div className="text-[#5f2bef] font-bold">{stats.connections}</div>
              <div className="text-[#787878] text-xs">Connections</div>
            </div>
          </div>

          {stats.items.length > 0 && (
            <div className="pt-2 border-t border-[#787878]/30">
              <div className="text-xs text-[#787878] mb-2">Items collected:</div>
              <div className="flex flex-wrap justify-center gap-2">
                {stats.items.map((item, i) => (
                  <span key={i} className="px-2 py-1 bg-[#004e53] rounded text-xs text-[#00e7ad]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Leaderboard section */}
        {!showLeaderboard ? (
          <button
            onClick={handleShowLeaderboard}
            className="text-[#42fffe] hover:text-[#00e7ad] text-sm underline underline-offset-4 transition-colors"
          >
            View Leaderboard 🏆
          </button>
        ) : (
          <div className="bg-black/30 rounded-xl border border-[#00e7ad]/30 overflow-hidden">
            <div className="px-4 py-3 border-b border-[#00e7ad]/20">
              <h3 className="text-[#00e7ad] font-bold text-sm">🏆 Top 100 Scores</h3>
            </div>
            {leaderboard.length === 0 ? (
              <p className="text-[#787878] text-sm p-4">No scores yet.</p>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {leaderboard.map((entry, i) => (
                      <tr
                        key={entry.id}
                        className={`border-b border-[#00e7ad]/10 last:border-0 ${
                          entry.player_name === playerName ? "bg-[#00e7ad]/10" : ""
                        }`}
                      >
                        <td className="px-4 py-2 text-[#42fffe] font-bold w-10">
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-[#F0F0F0]">{entry.player_name}</span>
                          <span className="text-[#787878] text-xs ml-2 capitalize">{entry.player_role}</span>
                        </td>
                        <td className="px-4 py-2 text-right text-[#fffe01] font-bold">{entry.score.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="bg-[#5f2bef]/20 rounded-lg p-4 border border-[#5f2bef]/30">
          <p className="text-[#F0F0F0] text-sm">
            🎤 You&apos;re now ready to experience keynotes from Qualcomm, Intel, UCSD, and more! Explore hands-on
            workshops, the expanded EXPO, and connect with the global Edge AI community.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 justify-center">
          <Button
            onClick={onRestart}
            className="bg-[#1b357d] hover:bg-[#5f2bef] text-white font-bold px-6 py-3 rounded-lg"
          >
            Play Again 🔄
          </Button>
          <a
            href="https://www.edgeaifoundation.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-[#00e7ad] hover:bg-[#42fffe] text-[#004e53] font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Visit EDGE AI Foundation →
          </a>
        </div>
      </div>
    </div>
  )
}
