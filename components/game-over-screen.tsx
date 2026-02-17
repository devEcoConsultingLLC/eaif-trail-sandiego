"use client"

import { Button } from "@/components/ui/button"
import type { PlayerStats } from "@/lib/game-types"

interface GameOverScreenProps {
  message: string
  stats: PlayerStats
  onRestart: () => void
}

const PETE_DEATHS = [
  "You wake up in Tijuana",
  "You wake up in your bed",
  "You wake up on the airplane",
  "The stranger you handed the phone to",
]

export function GameOverScreen({ message, stats, onRestart }: GameOverScreenProps) {
  const isPeteDeath = PETE_DEATHS.some((d) => message.startsWith(d))

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 text-white font-sans">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="text-6xl mb-4">{isPeteDeath ? "📞" : "💀"}</div>
        <h1 className="text-3xl md:text-4xl font-bold text-red-400">
          {isPeteDeath ? "PETE BERNARD SENDS HIS REGARDS" : "JOURNEY ENDED"}
        </h1>

        <div className="bg-black/30 rounded-xl p-6 border border-red-400/30">
          <p className="text-[#F0F0F0] mb-4">{message}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-black/20 rounded-lg p-3">
              <div className="text-[#787878]">Final Energy</div>
              <div className="text-[#00e7ad] font-bold">{stats.energy}%</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <div className="text-[#787878]">Final Stress</div>
              <div className="text-red-400 font-bold">{stats.stress}%</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <div className="text-[#787878]">Money Remaining</div>
              <div className="text-[#fffe01] font-bold">${stats.money}</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <div className="text-[#787878]">Knowledge Gained</div>
              <div className="text-[#42fffe] font-bold">{stats.knowledge}</div>
            </div>
          </div>
        </div>

        <p className="text-[#787878] text-sm italic">
          {isPeteDeath
            ? "\u201CNever ignore a call from Pete Bernard. Or answer it. Or think about it. Actually, there is no winning.\u201D"
            : "\u201CThe trail to innovation is paved with failures. Each attempt brings you closer.\u201D"}
        </p>

        <Button
          onClick={onRestart}
          className="bg-[#00e7ad] hover:bg-[#42fffe] text-[#004e53] font-bold px-8 py-4 rounded-lg"
        >
          Try Again 🔄
        </Button>
      </div>
    </div>
  )
}
