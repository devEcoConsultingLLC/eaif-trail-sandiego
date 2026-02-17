export type GameScene =
  | "airport_dropoff"
  | "airport_entrance"
  | "luggage_dilemma"
  | "security_line"
  | "tsa_checkpoint"
  | "food_court"
  | "gate_rush"
  | "boarding"
  | "plane_seat"
  | "plane_events"
  | "plane_landing"
  | "san_arrival"
  | "transport_choice"
  | "downtown_journey"
  | "eve_approach"
  | "eve_entrance"

export type GameState = "playing" | "gameover" | "victory"

export interface PlayerStats {
  energy: number
  stress: number
  money: number
  knowledge: number
  connections: number
  items: string[]
}

export interface Choice {
  text: string
  icon?: string
  cost?: number
  disabled?: boolean
  effects?: {
    energy?: number
    stress?: number
    money?: number
    knowledge?: number
    connections?: number
    addItem?: string
    removeItem?: string
  }
  result?: string
  nextScene?: GameScene | "victory"
}

export interface SceneData {
  title: string
  icon: string
  description: string
  choices: Choice[]
}
