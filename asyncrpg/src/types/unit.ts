export interface Faction {
  id: string
  name: string
}

// src/types/unit.ts
//
// These types describe a unit *definition* — the static stat block loaded
// from public/data/factions/<id>.json. A player's configured copy of a unit
// in an army is a separate type, `ArmyUnit` (see src/stores/armyStore.ts) —
// don't add instance-only fields (selected quality, chosen upgrade counts,
// etc.) here.
export interface Unit {
  id: string
  name: string
  factionId: string
  quality: {
    inexperienced?: number | null
    regular?: number | null
    veteran?: number | null
  }
  models: number
  options: UnitOption[]
  upgrades: UnitUpgrade[]
}

// A choosable option on a unit definition (per-quality cost override, optional
// extra models, optional pick limit). Corresponds to `Unit.options`.
export interface UnitOption {
  id: string
  name: string
  addModels?: number
  cost: number
  costInexperienced?: number
  costRegular?: number
  costVeteran?: number
  limit: number
}

// A squad-wide upgrade on a unit definition, costed per model.
// Corresponds to `Unit.upgrades`.
export interface UnitUpgrade {
  id: string
  name: string
  costPerUnit: number | null
}
