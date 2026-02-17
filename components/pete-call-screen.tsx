"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import type { PlayerStats } from "@/lib/game-types"
import { Phone } from "lucide-react"

interface PeteCallScreenProps {
  stats: PlayerStats
  onDeath: (message: string) => void
}

const PETE_CHOICES = [
  {
    text: "Answer the call and try to sound cool: \"SUP!\"",
    icon: "😎",
  },
  {
    text: "Look at your phone, grin evilly, and slowly slide it back into your pocket",
    icon: "😈",
  },
  {
    text: "Your special Pete-ringer triggers flashbacks to the call before EDGE AI Milan...",
    icon: "😰",
  },
  {
    text: "Hand your phone to a nearby stranger and let them answer it",
    icon: "🤝",
  },
]

const PETE_DEATHS = [
  "You wake up in Tijuana. You realize you're in a bath tub full of ice as the back pain kicks in...",
  "You wake up in your bed and realize you weren't able to make it to the EDGE AI San Diego event... *sadge*",
  "You wake up on the airplane as the pilot announces your descent to San Diego airport. A kid kicks the back of your seat and you strangely fall back to sleep. You wake up to the same kid kicking your seat and hear the pilot announce your descent to San Diego airport... You strangely fall back to sleep... and this happens forever.",
  "The stranger you handed the phone to suddenly explodes into a plume of smoke as your phone falls to the ground. You question whether you should continue your journey to San Diego as you look down at your phone ringing on the floor... It's Pete again...",
]

export function PeteCallScreen({ stats, onDeath }: PeteCallScreenProps) {
  const [phase, setPhase] = useState<"ringing" | "choices" | "death">("ringing")
  const [chosenIndex, setChosenIndex] = useState<number | null>(null)
  const [ringCount, setRingCount] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const timeRef = useRef<number>(0)

  useEffect(() => {
    if (phase === "ringing") {
      const interval = setInterval(() => {
        setRingCount((prev) => {
          if (prev >= 3) {
            setPhase("choices")
            clearInterval(interval)
            return prev
          }
          return prev + 1
        })
      }, 900)
      return () => clearInterval(interval)
    }
  }, [phase])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener("resize", resize)

    const drawPixelRect = (x: number, y: number, w: number, h: number, color: string) => {
      ctx.fillStyle = color
      ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h))
    }

    const animate = (timestamp: number) => {
      timeRef.current = timestamp / 1000
      const t = timeRef.current
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      // Dark dramatic background
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, "#0a0a1a")
      gradient.addColorStop(1, "#1a0a2e")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      if (phase === "ringing" || phase === "choices") {
        // Phone vibration effect
        const shake = phase === "ringing" ? Math.sin(t * 30) * 3 : 0
        const phoneX = width / 2 - 30 + shake
        const phoneY = height / 2 - 50 + Math.sin(t * 2) * 5

        // Pulsing glow behind phone
        const glowSize = 60 + Math.sin(t * 4) * 20
        ctx.fillStyle = `rgba(0, 231, 173, ${0.1 + Math.sin(t * 4) * 0.05})`
        ctx.beginPath()
        ctx.arc(width / 2, height / 2, glowSize, 0, Math.PI * 2)
        ctx.fill()

        // Phone body
        drawPixelRect(phoneX, phoneY, 60, 100, "#2d2d44")
        drawPixelRect(phoneX + 4, phoneY + 12, 52, 76, "#1a1a2e")

        // Screen content - caller ID
        drawPixelRect(phoneX + 8, phoneY + 16, 44, 40, "#004e53")

        ctx.fillStyle = "#00e7ad"
        ctx.font = "bold 8px monospace"
        ctx.textAlign = "center"
        ctx.fillText("INCOMING CALL", width / 2, phoneY + 28)

        ctx.fillStyle = "#fffe01"
        ctx.font = "bold 10px monospace"
        ctx.fillText("Pete Bernard", width / 2, phoneY + 42)

        ctx.fillStyle = "#787878"
        ctx.font = "7px monospace"
        ctx.fillText("CEO, EDGE AI", width / 2, phoneY + 52)

        // Ring waves
        if (phase === "ringing") {
          for (let i = 0; i < 3; i++) {
            const waveRadius = 40 + i * 25 + ((t * 50) % 60)
            const alpha = Math.max(0, 0.3 - (waveRadius / 200))
            ctx.strokeStyle = `rgba(0, 231, 173, ${alpha})`
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.arc(width / 2, height / 2, waveRadius, 0, Math.PI * 2)
            ctx.stroke()
          }
        }

        // Green / red buttons on phone
        drawPixelRect(phoneX + 8, phoneY + 78, 18, 8, "#00e7ad")
        drawPixelRect(phoneX + 34, phoneY + 78, 18, 8, "#e74c3c")
      }

      if (phase === "death" && chosenIndex !== null) {
        // Death scene rendering
        const flash = Math.sin(t * 3) * 0.1

        if (chosenIndex === 0) {
          // Tijuana bathtub scene
          ctx.fillStyle = `rgba(26, 26, 46, ${0.9 + flash})`
          ctx.fillRect(0, 0, width, height)
          // Bathtub
          drawPixelRect(width * 0.2, height * 0.4, width * 0.6, height * 0.35, "#F0F0F0")
          drawPixelRect(width * 0.22, height * 0.42, width * 0.56, height * 0.31, "#87CEEB")
          // Ice cubes
          for (let i = 0; i < 8; i++) {
            const ix = width * 0.25 + i * (width * 0.06)
            const iy = height * 0.5 + Math.sin(t * 2 + i) * 5
            drawPixelRect(ix, iy, 15, 15, `rgba(200, 230, 255, ${0.6 + Math.sin(t + i) * 0.2})`)
          }
          // Character in tub
          drawPixelRect(width * 0.45, height * 0.45, 20, 20, "#FFD93D")
          // Sign: "WELCOME TO TIJUANA"
          drawPixelRect(width * 0.3, height * 0.15, width * 0.4, 30, "#e74c3c")
          ctx.fillStyle = "#FFFFFF"
          ctx.font = "bold 12px monospace"
          ctx.textAlign = "center"
          ctx.fillText("WELCOME TO TIJUANA", width / 2, height * 0.15 + 20)
        } else if (chosenIndex === 1) {
          // Bedroom scene - sad
          ctx.fillStyle = `rgba(26, 26, 46, ${0.8 + flash})`
          ctx.fillRect(0, 0, width, height)
          // Bed
          drawPixelRect(width * 0.2, height * 0.5, width * 0.6, height * 0.25, "#5f2bef")
          drawPixelRect(width * 0.2, height * 0.45, width * 0.15, height * 0.3, "#3C3C3C")
          // Character in bed
          drawPixelRect(width * 0.35, height * 0.48, 20, 20, "#FFD93D")
          drawPixelRect(width * 0.35, height * 0.55, 30, 15, "#5f2bef")
          // Window showing San Diego (missed)
          drawPixelRect(width * 0.65, height * 0.15, width * 0.2, height * 0.25, "#87CEEB")
          drawPixelRect(width * 0.66, height * 0.16, width * 0.18, height * 0.23, "#004e53")
          ctx.fillStyle = "#00e7ad"
          ctx.font = "8px monospace"
          ctx.fillText("EDGE AI SD", width * 0.75, height * 0.3)
          // Tears
          const tearY = height * 0.52 + ((t * 20) % 20)
          drawPixelRect(width * 0.38, tearY, 3, 6, "#42fffe")
        } else if (chosenIndex === 2) {
          // Infinite plane loop
          ctx.fillStyle = `rgba(15, 52, 96, ${0.9 + flash})`
          ctx.fillRect(0, 0, width, height)
          // Plane windows
          for (let i = 0; i < 4; i++) {
            drawPixelRect(20 + i * (width / 4), 40, 40, 60, "#87CEEB")
          }
          // Seats
          for (let s = 0; s < 5; s++) {
            drawPixelRect(20 + s * 60, height - 90, 50, 40, "#1b357d")
          }
          // Character nodding off
          const headBob = Math.abs(Math.sin(t * 1.5)) * 15
          drawPixelRect(width * 0.35 + 4, height - 95 + headBob, 12, 12, "#FFD93D")
          drawPixelRect(width * 0.35 + 4, height - 83 + headBob * 0.5, 12, 18, "#00e7ad")
          // Kid kicking seat
          const kickFrame = Math.sin(t * 6) > 0
          drawPixelRect(width * 0.35 + 55, height - 85, 10, 10, "#e74c3c")
          if (kickFrame) {
            drawPixelRect(width * 0.35 + 50, height - 70, 15, 6, "#e74c3c")
          }
          // Looping text
          ctx.fillStyle = "#fffe01"
          ctx.font = "bold 10px monospace"
          ctx.textAlign = "center"
          const loopText = Math.floor(t) % 2 === 0 ? "Descending to San Diego..." : "You fall back asleep..."
          ctx.fillText(loopText, width / 2, 25)
          // Infinity symbol
          ctx.font = "30px monospace"
          ctx.fillText("\u221E", width / 2, height * 0.35)
        } else if (chosenIndex === 3) {
          // Stranger explodes
          ctx.fillStyle = `rgba(26, 10, 46, ${0.85 + flash})`
          ctx.fillRect(0, 0, width, height)
          // Smoke cloud
          for (let i = 0; i < 12; i++) {
            const sx = width * 0.5 + Math.sin(t * 2 + i * 0.8) * (30 + i * 5)
            const sy = height * 0.35 + Math.cos(t * 1.5 + i) * (20 + i * 3) - t * 5
            const size = 10 + Math.sin(t + i) * 5
            ctx.fillStyle = `rgba(120, 120, 120, ${0.4 - i * 0.03})`
            ctx.beginPath()
            ctx.arc(sx, sy, size, 0, Math.PI * 2)
            ctx.fill()
          }
          // Phone on the ground
          const phoneGlow = Math.sin(t * 6) > 0
          drawPixelRect(width * 0.48, height * 0.7, 20, 35, "#2d2d44")
          if (phoneGlow) {
            drawPixelRect(width * 0.48 + 2, height * 0.7 + 5, 16, 22, "#00e7ad")
            ctx.fillStyle = "#fffe01"
            ctx.font = "6px monospace"
            ctx.textAlign = "center"
            ctx.fillText("Pete", width * 0.48 + 10, height * 0.7 + 18)
          }
          // Character staring down
          drawPixelRect(width * 0.42, height * 0.55, 16, 16, "#FFD93D")
          drawPixelRect(width * 0.42, height * 0.58 + 16, 16, 24, "#00e7ad")
          // Question marks
          ctx.fillStyle = "#fffe01"
          ctx.font = "bold 16px monospace"
          ctx.fillText("?", width * 0.35, height * 0.5 + Math.sin(t * 3) * 5)
          ctx.fillText("?", width * 0.6, height * 0.48 + Math.cos(t * 3) * 5)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [phase, chosenIndex])

  const handleChoice = (index: number) => {
    setChosenIndex(index)
    setPhase("death")
    setTimeout(() => {
      onDeath(PETE_DEATHS[index])
    }, 4000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col">
      <canvas
        ref={canvasRef}
        className="w-full h-48 md:h-64 lg:h-80"
        style={{ imageRendering: "pixelated" }}
      />

      <div className="flex-1 flex flex-col p-4 font-sans">
        {phase === "ringing" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <Phone className="w-16 h-16 text-[#00e7ad] animate-pulse" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#e74c3c] rounded-full flex items-center justify-center text-white text-xs font-bold">
                !
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#00e7ad]">Incoming Call...</h2>
            <p className="text-[#fffe01] text-lg font-bold">Pete Bernard</p>
            <p className="text-[#787878] text-sm">CEO, EDGE AI Foundation</p>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i <= ringCount ? "bg-[#00e7ad]" : "bg-[#3C3C3C]"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {phase === "choices" && (
          <div className="flex-1 bg-black/30 rounded-xl p-4 md:p-6 border border-[#e74c3c]/50">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-5 h-5 text-[#e74c3c]" />
              <h2 className="text-lg md:text-xl font-bold text-[#e74c3c]">
                Pete Bernard is calling...
              </h2>
            </div>

            <p className="text-[#F0F0F0] mb-4 text-sm md:text-base leading-relaxed">
              Your phone buzzes violently. The screen lights up with a name you know
              all too well — <span className="text-[#fffe01] font-bold">Pete Bernard</span>,
              CEO of the EDGE AI Foundation. A chill runs down your spine.
              Something about this call feels... <span className="text-[#e74c3c] italic">ominous</span>.
            </p>

            <div className="space-y-2">
              {PETE_CHOICES.map((choice, index) => (
                <Button
                  key={index}
                  onClick={() => handleChoice(index)}
                  className="w-full justify-start text-left p-4 h-auto bg-[#1a0a2e] hover:bg-[#e74c3c]/30 text-white border border-[#e74c3c]/30 hover:border-[#e74c3c] transition-all hover:scale-[1.02]"
                >
                  <span className="mr-2">{choice.icon}</span>
                  <span className="flex-1">{choice.text}</span>
                </Button>
              ))}
            </div>

            <p className="text-[#e74c3c]/60 text-xs mt-4 text-center italic">
              There is no escaping Pete Bernard.
            </p>
          </div>
        )}

        {phase === "death" && chosenIndex !== null && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 p-4">
            <div className="text-6xl">
              {chosenIndex === 0 && "🛁"}
              {chosenIndex === 1 && "😢"}
              {chosenIndex === 2 && "🔁"}
              {chosenIndex === 3 && "💨"}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#e74c3c]">
              {chosenIndex === 0 && "South of the Border"}
              {chosenIndex === 1 && "The One That Got Away"}
              {chosenIndex === 2 && "Infinite Descent"}
              {chosenIndex === 3 && "Stranger Danger"}
            </h2>
            <div className="bg-black/30 rounded-xl p-6 border border-[#e74c3c]/30 max-w-md">
              <p className="text-[#F0F0F0] leading-relaxed">
                {PETE_DEATHS[chosenIndex]}
              </p>
            </div>
            <p className="text-[#787878] text-sm animate-pulse">
              Your journey ends here...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
