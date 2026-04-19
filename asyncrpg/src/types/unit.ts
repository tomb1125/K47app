export interface Faction {
  id: string
  name: string
}

export interface Unit {
  id: string
  name: string
  factionId: string
}
