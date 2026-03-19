"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getJourneyCount, incrementJourneyCount } from "@/lib/journey-tracker"
import { getLeaderboard, type LeaderboardEntry } from "@/lib/leaderboard"

interface TitleScreenProps {
  onStart: (name: string, role: "developer" | "researcher" | "executive") => void
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  const [name, setName] = useState("")
  const [role, setRole] = useState<"developer" | "researcher" | "executive" | null>(null)
  const [step, setStep] = useState<"intro" | "name" | "role" | "leaderboard">("intro")
  const [journeyCount, setJourneyCount] = useState<number | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false)

  useEffect(() => {
    getJourneyCount().then((count) => {
      if (count > 0) setJourneyCount(count)
    })
  }, [])

  const handleBeginJourney = async () => {
    incrementJourneyCount()
    setStep("name")
  }

  const handleViewLeaderboard = async () => {
    setLoadingLeaderboard(true)
    const entries = await getLeaderboard(100)
    setLeaderboard(entries)
    setLoadingLeaderboard(false)
    setStep("leaderboard")
  }

  const roles = [
    {
      id: "developer" as const,
      title: "Developer",
      desc: "Start with $120, +10 Knowledge. Balanced approach.",
      icon: "💻",
    },
    {
      id: "researcher" as const,
      title: "Researcher",
      desc: "Start with $80, +20 Knowledge, less energy. Academic focus.",
      icon: "🔬",
    },
    {
      id: "executive" as const,
      title: "Executive",
      desc: "Start with $250, but higher stress. Money talks.",
      icon: "👔",
    },
  ]

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 text-white font-[Poppins]">
      <div className="max-w-2xl w-full text-center space-y-8">
        {step === "intro" && (
          <>
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold text-[#00e7ad] tracking-tight">🛤️ EDGE AI TRAIL</h1>
              <p className="text-xl md:text-2xl text-[#42fffe]">...To San Diego</p>
            </div>

            <div className="bg-black/30 rounded-xl p-6 space-y-4 text-left border border-[#00e7ad]/30">
              <p className="text-[#F0F0F0]">
                <span className="text-[#fffe01]">March 2026.</span> You&apos;ve been invited to speak at{" "}
                <span className="text-[#00e7ad] font-semibold">EDGE AI San Diego 2026</span> — the premier global
                conference for on-device intelligence.
              </p>
              <p className="text-[#F0F0F0]">
                But you&apos;re <span className="text-red-400 font-semibold">running late</span>. Your ride just dropped
                you at the airport and your flight leaves soon. Navigate through airport chaos, survive the flight, and
                find your way through San Diego to reach the venue: <span className="text-[#00e7ad]">EVE</span>.
              </p>
              <p className="text-[#787878] text-sm italic">
                Inspired by Oregon Trail • Learn by doing • Every choice matters
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={handleBeginJourney}
                className="bg-[#00e7ad] hover:bg-[#42fffe] text-[#004e53] font-bold px-8 py-6 text-lg rounded-lg transition-all hover:scale-105"
              >
                Begin Your Journey →
              </Button>

              {journeyCount !== null && (
                <p className="text-[#787878] text-sm">{journeyCount.toLocaleString()} journeys taken so far</p>
              )}

              <button
                onClick={handleViewLeaderboard}
                className="text-[#42fffe] hover:text-[#00e7ad] text-sm underline underline-offset-4 transition-colors mt-1"
              >
                View Leaderboard 🏆
              </button>
            </div>
          </>
        )}

        {step === "leaderboard" && (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#00e7ad]">🏆 Top 100 Scores</h2>

            {loadingLeaderboard ? (
              <p className="text-[#787878]">Loading...</p>
            ) : leaderboard.length === 0 ? (
              <div className="bg-black/30 rounded-xl p-6 border border-[#00e7ad]/30">
                <p className="text-[#787878]">No scores yet. Be the first to complete the trail!</p>
              </div>
            ) : (
              <div className="bg-black/30 rounded-xl border border-[#00e7ad]/30 overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#00e7ad]/20">
                      <th className="px-4 py-3 text-[#787878] font-medium">#</th>
                      <th className="px-4 py-3 text-[#787878] font-medium">Player</th>
                      <th className="px-4 py-3 text-[#787878] font-medium text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, i) => (
                      <tr key={entry.id} className="border-b border-[#00e7ad]/10 last:border-0">
                        <td className="px-4 py-3 text-[#42fffe] font-bold">
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-[#F0F0F0] font-medium">{entry.player_name}</div>
                          <div className="text-[#787878] text-xs capitalize">{entry.player_role}</div>
                        </td>
                        <td className="px-4 py-3 text-right text-[#fffe01] font-bold">{entry.score.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            )}

            <Button
              onClick={() => setStep("intro")}
              className="bg-[#1b357d] hover:bg-[#5f2bef] text-white font-bold px-6 py-3 rounded-lg"
            >
              ← Back
            </Button>
          </div>
        )}

        {step === "name" && (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#00e7ad]">What is your name, traveler?</h2>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="max-w-md mx-auto bg-black/30 border-[#00e7ad]/50 text-white placeholder:text-[#787878] text-center text-lg py-6"
              maxLength={20}
            />
            <Button
              onClick={() => name.trim() && setStep("role")}
              disabled={!name.trim()}
              className="bg-[#00e7ad] hover:bg-[#42fffe] text-[#004e53] font-bold px-8 py-4 rounded-lg disabled:opacity-50"
            >
              Continue →
            </Button>
          </div>
        )}

        {step === "role" && (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#00e7ad]">Choose your profession, {name}</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    role === r.id
                      ? "border-[#00e7ad] bg-[#00e7ad]/20"
                      : "border-[#787878]/30 bg-black/20 hover:border-[#00e7ad]/50"
                  }`}
                >
                  <div className="text-3xl mb-2">{r.icon}</div>
                  <div className="font-bold text-[#42fffe]">{r.title}</div>
                  <div className="text-sm text-[#787878]">{r.desc}</div>
                </button>
              ))}
            </div>
            <Button
              onClick={() => role && onStart(name, role)}
              disabled={!role}
              className="bg-[#00e7ad] hover:bg-[#42fffe] text-[#004e53] font-bold px-8 py-4 rounded-lg disabled:opacity-50"
            >
              Start the Trail! 🚀
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
