"use client"

import { useState, useCallback } from "react"
import { GameCanvas } from "@/components/game-canvas"
import { GameUI } from "@/components/game-ui"
import { CountdownTimer } from "@/components/countdown-timer"
import { TitleScreen } from "@/components/title-screen"
import { GameOverScreen } from "@/components/game-over-screen"
import { VictoryScreen } from "@/components/victory-screen"
import { PeteCallScreen } from "@/components/pete-call-screen"
import type { GameState, GameScene, PlayerStats } from "@/lib/game-types"
import { getSceneData } from "@/lib/game-scenes"

const INITIAL_STATS: PlayerStats = {
  energy: 100,
  stress: 0,
  money: 150,
  knowledge: 0,
  connections: 0,
  items: ["laptop", "phone", "charger"],
}

export default function EdgeAITrail() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameState, setGameState] = useState<GameState>("playing")
  const [currentScene, setCurrentScene] = useState<GameScene>("airport_dropoff")
  const [stats, setStats] = useState<PlayerStats>(INITIAL_STATS)
  const [message, setMessage] = useState<string>("")
  const [playerName, setPlayerName] = useState("Traveler")
  const [playerRole, setPlayerRole] = useState<"developer" | "researcher" | "executive">("developer")
  const [visitedScenes, setVisitedScenes] = useState<Set<string>>(new Set())
  const [randomEvent, setRandomEvent] = useState<string | null>(null)
  const [peteCallActive, setPeteCallActive] = useState(false)
  const [peteCallTriggered, setPeteCallTriggered] = useState(false)
  const [peteCallTargetScene, setPeteCallTargetScene] = useState<GameScene | null>(null)

  const handleChoice = useCallback(
    (choiceIndex: number) => {
      const sceneData = getSceneData(currentScene, stats, visitedScenes, playerRole)
      const choice = sceneData.choices[choiceIndex]

      if (!choice) return

      // Apply stat changes
      const newStats = { ...stats }
      if (choice.effects) {
        newStats.energy = Math.max(0, Math.min(100, newStats.energy + (choice.effects.energy || 0)))
        newStats.stress = Math.max(0, Math.min(100, newStats.stress + (choice.effects.stress || 0)))
        newStats.money = Math.max(0, newStats.money + (choice.effects.money || 0))
        newStats.knowledge = Math.max(0, newStats.knowledge + (choice.effects.knowledge || 0))
        newStats.connections = Math.max(0, newStats.connections + (choice.effects.connections || 0))

        if (choice.effects.addItem) {
          newStats.items = [...newStats.items, choice.effects.addItem]
        }
        if (choice.effects.removeItem) {
          newStats.items = newStats.items.filter((i) => i !== choice.effects!.removeItem)
        }
      }

      setStats(newStats)
      setMessage(choice.result || "")

      // Random event chance
      if (Math.random() < 0.15 && !randomEvent) {
        const events = [
          { text: "🎉 You found a $20 bill on the ground!", effect: { money: 20 } },
          { text: "📱 Your phone battery dropped 20%!", effect: { stress: 10 } },
          { text: "☕ A stranger bought you coffee!", effect: { energy: 15, stress: -5 } },
          { text: "🧠 You overheard an interesting Edge AI conversation!", effect: { knowledge: 5 } },
          { text: "👋 You bumped into an old colleague!", effect: { connections: 1 } },
          { text: "🌧️ Sudden rain! You got a bit wet.", effect: { stress: 5 } },
        ]
        const event = events[Math.floor(Math.random() * events.length)]
        setRandomEvent(event.text)
        if (event.effect.money) newStats.money += event.effect.money
        if (event.effect.stress) newStats.stress = Math.min(100, Math.max(0, newStats.stress + event.effect.stress))
        if (event.effect.energy) newStats.energy = Math.min(100, Math.max(0, newStats.energy + event.effect.energy))
        if (event.effect.knowledge) newStats.knowledge += event.effect.knowledge
        if (event.effect.connections) newStats.connections += event.effect.connections
        setStats({ ...newStats })

        setTimeout(() => setRandomEvent(null), 3000)
      }

      // Check for game over conditions
      if (newStats.energy <= 0) {
        setGameState("gameover")
        setMessage("You collapsed from exhaustion! Your EDGE AI journey ends here...")
        return
      }
      if (newStats.stress >= 100) {
        setGameState("gameover")
        setMessage("Overwhelmed by stress, you gave up and went home...")
        return
      }

      // Track visited scenes
      setVisitedScenes((prev) => new Set([...prev, currentScene]))

      // Move to next scene
      if (choice.nextScene === "victory") {
        setGameState("victory")
      } else if (choice.nextScene) {
        // Check if Pete Bernard's call should intercept this transition
        if (peteCallTargetScene && choice.nextScene === peteCallTargetScene && !peteCallTriggered) {
          setPeteCallTriggered(true)
          setPeteCallActive(true)
          // Store the intended next scene so we don't lose it (though Pete always kills you)
          return
        }
        setCurrentScene(choice.nextScene)
      }
    },
    [currentScene, stats, visitedScenes, playerRole, randomEvent, peteCallTargetScene, peteCallTriggered],
  )

  const handlePeteDeath = useCallback((deathMessage: string) => {
    setPeteCallActive(false)
    setGameState("gameover")
    setMessage(deathMessage)
  }, [])

  const startGame = (name: string, role: "developer" | "researcher" | "executive") => {
    setPlayerName(name)
    setPlayerRole(role)

    // Role-based starting stats
    const roleStats = {
      developer: { ...INITIAL_STATS, money: 120, knowledge: 10 },
      researcher: { ...INITIAL_STATS, money: 80, knowledge: 20, energy: 90 },
      executive: { ...INITIAL_STATS, money: 250, stress: 20 },
    }

    setStats(roleStats[role])
    setGameStarted(true)
    setGameState("playing")
    setCurrentScene("airport_dropoff")
    setVisitedScenes(new Set())
    setMessage("")

    // 33% chance Pete Bernard calls this playthrough
    const peteRoll = Math.random()
    if (peteRoll < 0.33) {
      // Pick a random scene (not the first or last two) for Pete to interrupt
      const interceptableScenes: GameScene[] = [
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
      ]
      const targetScene = interceptableScenes[Math.floor(Math.random() * interceptableScenes.length)]
      setPeteCallTargetScene(targetScene)
    } else {
      setPeteCallTargetScene(null)
    }
    setPeteCallTriggered(false)
    setPeteCallActive(false)
  }

  const restartGame = () => {
    setGameStarted(false)
    setGameState("playing")
    setCurrentScene("airport_dropoff")
    setStats(INITIAL_STATS)
    setVisitedScenes(new Set())
    setMessage("")
    setRandomEvent(null)
    setPeteCallActive(false)
    setPeteCallTriggered(false)
    setPeteCallTargetScene(null)
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#004e53] flex flex-col">
        <TitleScreen onStart={startGame} />
        <CountdownTimer />
      </div>
    )
  }

  if (peteCallActive) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col">
        <PeteCallScreen stats={stats} onDeath={handlePeteDeath} />
        <CountdownTimer />
      </div>
    )
  }

  if (gameState === "gameover") {
    return (
      <div className="min-h-screen bg-[#004e53] flex flex-col">
        <GameOverScreen message={message} stats={stats} onRestart={restartGame} />
        <CountdownTimer />
      </div>
    )
  }

  if (gameState === "victory") {
    return (
      <div className="min-h-screen bg-[#004e53] flex flex-col">
        <VictoryScreen stats={stats} playerName={playerName} playerRole={playerRole} onRestart={restartGame} />
        <CountdownTimer />
      </div>
    )
  }

  const sceneData = getSceneData(currentScene, stats, visitedScenes, playerRole)

  return (
    <div className="min-h-screen bg-[#004e53] flex flex-col">
      <main className="flex-1 flex flex-col">
        <GameCanvas scene={currentScene} stats={stats} />
        <GameUI
          sceneData={sceneData}
          stats={stats}
          message={message}
          randomEvent={randomEvent}
          onChoice={handleChoice}
          playerName={playerName}
        />
      </main>
      <CountdownTimer />
    </div>
  )
}
