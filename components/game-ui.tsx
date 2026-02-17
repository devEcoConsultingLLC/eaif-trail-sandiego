"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import type { PlayerStats, SceneData } from "@/lib/game-types"
import { Battery, Brain, DollarSign, Heart, Users, Briefcase } from "lucide-react"

interface GameUIProps {
  sceneData: SceneData
  stats: PlayerStats
  message: string
  randomEvent: string | null
  onChoice: (index: number) => void
  playerName: string
}

export function GameUI({ sceneData, stats, message, randomEvent, onChoice, playerName }: GameUIProps) {
  return (
    <div className="flex-1 flex flex-col p-4 font-[Poppins]">
      {/* Stats Bar */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
        <StatBadge
          icon={<Battery className="w-4 h-4" />}
          label="Energy"
          value={stats.energy}
          max={100}
          color="#00e7ad"
        />
        <StatBadge
          icon={<Heart className="w-4 h-4" />}
          label="Stress"
          value={stats.stress}
          max={100}
          color="#e74c3c"
          inverted
        />
        <StatBadge icon={<DollarSign className="w-4 h-4" />} label="Money" value={stats.money} color="#fffe01" />
        <StatBadge icon={<Brain className="w-4 h-4" />} label="Knowledge" value={stats.knowledge} color="#42fffe" />
        <StatBadge icon={<Users className="w-4 h-4" />} label="Connections" value={stats.connections} color="#5f2bef" />
        <StatBadge icon={<Briefcase className="w-4 h-4" />} label="Items" value={stats.items.length} color="#0084ff" />
      </div>

      {/* Random Event */}
      {randomEvent && (
        <div className="bg-[#fffe01]/20 border border-[#fffe01] rounded-lg p-3 mb-4 text-center text-[#fffe01] animate-pulse">
          {randomEvent}
        </div>
      )}

      {/* Scene Content */}
      <div className="flex-1 bg-black/30 rounded-xl p-4 md:p-6 border border-[#00e7ad]/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{sceneData.icon}</span>
          <h2 className="text-lg md:text-xl font-bold text-[#00e7ad]">{sceneData.title}</h2>
        </div>

        <p className="text-[#F0F0F0] mb-4 text-sm md:text-base leading-relaxed">
          {sceneData.description.replace("{playerName}", playerName)}
        </p>

        {message && (
          <div className="bg-[#5f2bef]/20 border border-[#5f2bef] rounded-lg p-3 mb-4 text-[#42fffe] text-sm">
            {message}
          </div>
        )}

        {/* Choices */}
        <div className="space-y-2">
          {sceneData.choices.map((choice, index) => (
            <Button
              key={index}
              onClick={() => onChoice(index)}
              disabled={choice.disabled}
              className={`w-full justify-start text-left p-4 h-auto ${
                choice.disabled
                  ? "bg-[#3C3C3C] text-[#787878] cursor-not-allowed"
                  : "bg-[#1b357d] hover:bg-[#5f2bef] text-white"
              } transition-all hover:scale-[1.02]`}
            >
              <span className="mr-2">{choice.icon || "→"}</span>
              <span className="flex-1">
                {choice.text}
                {choice.cost && <span className="text-[#fffe01] ml-2">(${choice.cost})</span>}
              </span>
            </Button>
          ))}
        </div>

        {/* Items inventory */}
        {stats.items.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#787878]/30">
            <p className="text-xs text-[#787878] mb-2">Your items:</p>
            <div className="flex flex-wrap gap-2">
              {stats.items.map((item, i) => (
                <span key={i} className="px-2 py-1 bg-[#004e53] rounded text-xs text-[#00e7ad]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatBadge({
  icon,
  label,
  value,
  max,
  color,
  inverted,
}: {
  icon: React.ReactNode
  label: string
  value: number
  max?: number
  color: string
  inverted?: boolean
}) {
  const percentage = max ? (value / max) * 100 : null
  const displayColor = inverted && percentage && percentage > 70 ? "#e74c3c" : color

  return (
    <div className="bg-black/30 rounded-lg p-2 border border-[#787878]/30">
      <div className="flex items-center gap-1 text-xs text-[#787878] mb-1">
        {icon}
        <span>{label}</span>
      </div>
      {max ? (
        <div className="relative h-2 bg-[#3C3C3C] rounded-full overflow-hidden">
          <div
            className="absolute h-full transition-all duration-500"
            style={{ width: `${percentage}%`, backgroundColor: displayColor }}
          />
        </div>
      ) : (
        <div className="font-bold text-sm" style={{ color }}>
          {value}
        </div>
      )}
    </div>
  )
}
