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
  models: number
  upgrades: ArmyUpgrade[]
  properties: ArmyProperty[]
}

export interface ArmyUpgrade {
  upgradeId: string
  count: number
  addModels?: number
}


export interface ArmyProperty {
  propertyId: string
  selected: boolean
  costPerUnit: number
}