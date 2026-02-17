"use client"

import { useEffect, useRef } from "react"
import type { GameScene, PlayerStats } from "@/lib/game-types"

interface GameCanvasProps {
  scene: GameScene
  stats: PlayerStats
}

const SCENE_CONFIGS: Record<string, { bg: string; elements: string[]; animation: string }> = {
  airport_dropoff: { bg: "#1a1a2e", elements: ["car", "terminal", "people"], animation: "dropoff" },
  airport_entrance: { bg: "#1a1a2e", elements: ["doors", "signs", "crowds"], animation: "entrance" },
  luggage_dilemma: { bg: "#2d2d44", elements: ["suitcases", "cart", "porter"], animation: "luggage" },
  security_line: { bg: "#2d2d44", elements: ["queue", "scanners", "tsa"], animation: "security" },
  tsa_checkpoint: { bg: "#16213e", elements: ["xray", "bins", "agents"], animation: "checkpoint" },
  food_court: { bg: "#1a1a2e", elements: ["restaurants", "tables", "food"], animation: "food" },
  gate_rush: { bg: "#0f3460", elements: ["gates", "screens", "runners"], animation: "rush" },
  boarding: { bg: "#16213e", elements: ["plane", "jetway", "attendant"], animation: "boarding" },
  plane_seat: { bg: "#1a1a2e", elements: ["seats", "window", "passengers"], animation: "seated" },
  plane_events: { bg: "#16213e", elements: ["cart", "turbulence", "screens"], animation: "flight" },
  plane_landing: { bg: "#0f3460", elements: ["runway", "city", "ocean"], animation: "landing" },
  san_arrival: { bg: "#004e53", elements: ["palm", "sun", "terminal"], animation: "arrival" },
  transport_choice: { bg: "#1b357d", elements: ["taxi", "trolley", "rideshare"], animation: "transport" },
  downtown_journey: { bg: "#004e53", elements: ["buildings", "gaslamp", "signs"], animation: "downtown" },
  eve_approach: { bg: "#5f2bef", elements: ["venue", "banner", "crowd"], animation: "approach" },
  eve_entrance: { bg: "#00e7ad", elements: ["doors", "badge", "welcome"], animation: "entrance" },
}

export function GameCanvas({ scene, stats }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const timeRef = useRef<number>(0)

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

    const config = SCENE_CONFIGS[scene] || SCENE_CONFIGS.airport_dropoff
    const width = canvas.offsetWidth
    const height = canvas.offsetHeight

    const drawPixelRect = (x: number, y: number, w: number, h: number, color: string) => {
      ctx.fillStyle = color
      ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h))
    }

    const drawCharacter = (x: number, y: number, scale = 1, bounce = 0) => {
      const s = 4 * scale
      const by = Math.sin(bounce) * 2
      // Head
      drawPixelRect(x + s, y + by, s * 2, s * 2, "#FFD93D")
      // Body
      drawPixelRect(x + s, y + s * 2 + by, s * 2, s * 3, "#00e7ad")
      // Legs
      drawPixelRect(x + s, y + s * 5 + by, s, s * 2, "#1a1a2e")
      drawPixelRect(x + s * 2, y + s * 5 + by, s, s * 2, "#1a1a2e")
      // Backpack
      drawPixelRect(x + s * 3, y + s * 2 + by, s, s * 2, "#5f2bef")
    }

    const drawAirplane = (x: number, y: number, scale = 1) => {
      const s = 6 * scale
      // Fuselage
      drawPixelRect(x, y + s * 2, s * 12, s * 3, "#F0F0F0")
      // Nose
      drawPixelRect(x + s * 12, y + s * 2.5, s * 2, s * 2, "#787878")
      // Tail
      drawPixelRect(x, y, s * 2, s * 3, "#0084ff")
      // Wings
      drawPixelRect(x + s * 4, y + s * 3, s * 4, s * 6, "#787878")
      // Windows
      for (let i = 0; i < 6; i++) {
        drawPixelRect(x + s * 2 + i * s * 1.5, y + s * 2.5, s * 0.8, s * 0.8, "#42fffe")
      }
    }

    const drawBuilding = (x: number, y: number, w: number, h: number, color: string) => {
      drawPixelRect(x, y, w, h, color)
      // Windows
      const windowRows = Math.floor(h / 20)
      const windowCols = Math.floor(w / 15)
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          const lit = Math.random() > 0.3
          drawPixelRect(x + 5 + col * 15, y + 10 + row * 20, 8, 12, lit ? "#fffe01" : "#3C3C3C")
        }
      }
    }

    const drawPalmTree = (x: number, y: number) => {
      // Trunk
      drawPixelRect(x + 8, y + 30, 8, 40, "#8B4513")
      // Fronds
      const frondColor = "#228B22"
      drawPixelRect(x, y + 10, 24, 8, frondColor)
      drawPixelRect(x - 8, y + 5, 20, 6, frondColor)
      drawPixelRect(x + 12, y + 5, 20, 6, frondColor)
      drawPixelRect(x + 4, y, 16, 6, frondColor)
      drawPixelRect(x + 8, y + 18, 8, 6, frondColor)
    }

    const animate = (timestamp: number) => {
      timeRef.current = timestamp / 1000
      const t = timeRef.current

      // Clear with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, config.bg)
      gradient.addColorStop(1, "#000000")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Scene-specific rendering
      if (
        scene.includes("airport") ||
        scene.includes("luggage") ||
        scene.includes("security") ||
        scene.includes("tsa")
      ) {
        // Airport interior
        drawPixelRect(0, height - 40, width, 40, "#3C3C3C")
        // Ceiling lights
        for (let i = 0; i < width; i += 80) {
          drawPixelRect(i + 20, 10, 40, 8, `rgba(255, 254, 1, ${0.5 + Math.sin(t * 2 + i / 50) * 0.2})`)
        }
        // Signs
        drawPixelRect(width / 2 - 60, 30, 120, 30, "#1b357d")
        ctx.fillStyle = "#FFFFFF"
        ctx.font = "bold 12px Poppins"
        ctx.textAlign = "center"
        ctx.fillText("DEPARTURES →", width / 2, 50)

        // People walking
        for (let i = 0; i < 5; i++) {
          const px = ((width * 0.1 + i * width * 0.18 + t * 20 * (i % 2 ? 1 : -1)) % (width + 100)) - 50
          drawCharacter(px, height - 80, 0.8, t * 3 + i)
        }

        // Main character
        drawCharacter(width * 0.4 + Math.sin(t * 2) * 5, height - 90, 1.2, t * 4)
      } else if (scene.includes("food")) {
        // Food court
        drawPixelRect(0, height - 40, width, 40, "#3C3C3C")
        // Restaurant stalls
        for (let i = 0; i < 4; i++) {
          drawPixelRect(
            i * (width / 4) + 10,
            height - 120,
            width / 4 - 20,
            80,
            ["#e74c3c", "#3498db", "#2ecc71", "#f39c12"][i],
          )
          drawPixelRect(i * (width / 4) + 20, height - 100, width / 4 - 40, 20, "#FFFFFF")
        }
        // Food icons
        ctx.font = "20px Arial"
        ctx.fillText("🍕", width * 0.12, height - 70)
        ctx.fillText("☕", width * 0.37, height - 70)
        ctx.fillText("🍔", width * 0.62, height - 70)
        ctx.fillText("🥗", width * 0.87, height - 70)

        drawCharacter(width * 0.5, height - 85, 1, t * 2)
      } else if (scene.includes("gate") || scene.includes("boarding")) {
        // Gate area
        drawPixelRect(0, height - 40, width, 40, "#16213e")
        // Airplane through window
        drawPixelRect(0, 20, width, height * 0.4, "#0f3460")
        drawAirplane(width * 0.3 + Math.sin(t * 0.5) * 10, 60, 1.5)
        // Gate number
        drawPixelRect(width - 100, 50, 80, 40, "#00e7ad")
        ctx.fillStyle = "#004e53"
        ctx.font = "bold 24px Poppins"
        ctx.textAlign = "center"
        ctx.fillText("B42", width - 60, 78)
        // Seats
        for (let i = 0; i < 6; i++) {
          drawPixelRect(30 + i * 50, height - 80, 40, 30, "#787878")
        }
        drawCharacter(width * 0.7, height - 90, 1, t * 3)
      } else if (scene.includes("plane")) {
        // Inside plane
        drawPixelRect(0, 0, width, 30, "#787878")
        drawPixelRect(0, height - 30, width, 30, "#787878")
        // Windows
        for (let i = 0; i < 5; i++) {
          drawPixelRect(20 + i * (width / 5), 50, 40, 60, "#87CEEB")
          // Clouds through window
          drawPixelRect(25 + i * (width / 5) + Math.sin(t + i) * 10, 70, 20, 10, "#FFFFFF")
        }
        // Seats
        for (let row = 0; row < 2; row++) {
          for (let seat = 0; seat < 6; seat++) {
            drawPixelRect(30 + seat * 55, height - 100 - row * 50, 45, 40, "#1b357d")
          }
        }
        // Character in seat
        const bounce = scene === "plane_events" ? Math.sin(t * 8) * 5 : 0
        drawCharacter(width * 0.3, height - 95 + bounce, 0.9, 0)
        // Flight attendant
        if (scene === "plane_events") {
          drawPixelRect(width * 0.6, height - 90, 12, 24, "#e74c3c")
          drawPixelRect(width * 0.6 + 2, height - 100, 8, 10, "#FFD93D")
          // Cart
          drawPixelRect(width * 0.65, height - 70, 30, 30, "#787878")
        }
      } else if (scene.includes("san") || scene.includes("transport") || scene.includes("downtown")) {
        // San Diego scene
        drawPixelRect(0, height - 50, width, 50, "#3C3C3C")
        // Sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.6)
        skyGrad.addColorStop(0, "#87CEEB")
        skyGrad.addColorStop(1, "#F0F0F0")
        ctx.fillStyle = skyGrad
        ctx.fillRect(0, 0, width, height * 0.6)
        // Sun
        ctx.fillStyle = "#fffe01"
        ctx.beginPath()
        ctx.arc(width * 0.85, 50, 30, 0, Math.PI * 2)
        ctx.fill()
        // Palm trees
        drawPalmTree(50, height - 120)
        drawPalmTree(width - 80, height - 130)
        // Buildings
        drawBuilding(width * 0.2, height - 150, 60, 100, "#1b357d")
        drawBuilding(width * 0.4, height - 180, 80, 130, "#5f2bef")
        drawBuilding(width * 0.6, height - 140, 50, 90, "#0084ff")
        // Trolley
        if (scene === "transport_choice") {
          drawPixelRect(width * 0.1 + ((t * 30) % (width + 100)) - 50, height - 80, 80, 35, "#e74c3c")
          drawPixelRect(width * 0.1 + ((t * 30) % (width + 100)) - 45, height - 75, 70, 20, "#42fffe")
        }
        drawCharacter(width * 0.5, height - 90, 1, t * 2)
      } else if (scene.includes("eve")) {
        // EVE venue
        const venueGrad = ctx.createLinearGradient(0, 0, 0, height)
        venueGrad.addColorStop(0, "#5f2bef")
        venueGrad.addColorStop(1, "#004e53")
        ctx.fillStyle = venueGrad
        ctx.fillRect(0, 0, width, height)
        // Venue building
        drawPixelRect(width * 0.2, height - 200, width * 0.6, 160, "#F0F0F0")
        // EDGE AI banner
        drawPixelRect(width * 0.25, height - 190, width * 0.5, 40, "#00e7ad")
        ctx.fillStyle = "#004e53"
        ctx.font = "bold 16px Poppins"
        ctx.textAlign = "center"
        ctx.fillText("EDGE AI SAN DIEGO 2026", width / 2, height - 165)
        // Doors
        drawPixelRect(width * 0.4, height - 90, width * 0.2, 50, "#004e53")
        // People at entrance
        for (let i = 0; i < 4; i++) {
          drawCharacter(width * 0.25 + i * 40, height - 85, 0.7, t * 2 + i)
        }
        // Main character approaching
        drawCharacter(width * 0.5 + Math.sin(t) * 3, height - 90, 1.2, t * 3)
        // Confetti for entrance scene
        if (scene === "eve_entrance") {
          for (let i = 0; i < 20; i++) {
            const cx = (width * 0.2 + i * 30 + t * 50) % width
            const cy = (height * 0.1 + i * 20 + t * 80) % (height * 0.5)
            ctx.fillStyle = ["#00e7ad", "#fffe01", "#42fffe", "#5f2bef"][i % 4]
            ctx.fillRect(cx, cy, 8, 8)
          }
        }
      }

      // Progress indicator
      const progress = getProgress(scene)
      drawPixelRect(10, 10, (width - 20) * progress, 6, "#00e7ad")
      drawPixelRect(10, 10, width - 20, 6, "rgba(255,255,255,0.2)")
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "10px Poppins"
      ctx.textAlign = "left"
      ctx.fillText(`${Math.round(progress * 100)}% to EVE`, 10, 28)

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [scene, stats])

  return <canvas ref={canvasRef} className="w-full h-48 md:h-64 lg:h-80" style={{ imageRendering: "pixelated" }} />
}

function getProgress(scene: GameScene): number {
  const sceneOrder: GameScene[] = [
    "airport_dropoff",
    "airport_entrance",
    "luggage_dilemma",
    "security_line",
    "tsa_checkpoint",
    "food_court",
    "gate_rush",
    "boarding",
    "plane_seat",
    "plane_events",
    "plane_landing",
    "san_arrival",
    "transport_choice",
    "downtown_journey",
    "eve_approach",
    "eve_entrance",
  ]
  const index = sceneOrder.indexOf(scene)
  return index >= 0 ? index / (sceneOrder.length - 1) : 0
}
