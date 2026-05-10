export interface Faction {
  id: string
  name: string
}

// src/types/unit.ts
export interface Unit {
  selectedQuality: string
  id: string
  unitId : string | null
  name: string
  factionId: string
  quality: {
    inexperienced?: number | null
    regular?: number | null
    veteran?: number | null
  }
  models: number
  options: ArmyUpgrade[]
  upgrades: ArmyProperty[]
}

export interface ArmyUpgrade {
  id: string
  name: string
  upgradeId: string | null
  propertyId: string | null
  count: number
  addModels?: number
  cost: number
  costInexperienced?: number
  costRegular?: number
  costVeteran?: number
  limit: number
}


export interface ArmyProperty {
  id: string
  name: string
  upgradeId: string | null
  propertyId: string | null
  selected: boolean
  costPerUnit: number | null
  count?: number
}