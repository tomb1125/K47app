export interface Faction {
  id: string
  name: string
}

// src/types/unit.ts
export interface Unit {
  id: string
  name: string
  factionId: string
  quality: {
    inexpierienced: number
    regular: number
    veteran: number
  }
}
