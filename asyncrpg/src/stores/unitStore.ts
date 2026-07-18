// src/stores/unitStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Unit, Faction } from '@/types/unit'

export const useUnitStore = defineStore('units', () => {
  const units = ref<Unit[]>([])
  const factions = ref<Faction[]>([])
  const loaded = ref(false)

  // ⭐ NEW: global selected faction
  const selectedFaction = ref<string>('')

  async function load() {
    if (loaded.value) return

    const base = import.meta.env.BASE_URL
    const manifestRes = await fetch(`${base}data/factions/index.json`)
    const manifest = await manifestRes.json()

    const factionFiles = await Promise.all(
      manifest.factions.map((f: { file: string }) =>
        fetch(`${base}data/factions/${f.file}`).then(res => res.json())
      )
    )

    factions.value = factionFiles.map(f => ({ id: f.id, name: f.name }))
    units.value = factionFiles.flatMap(f => f.units)

    // set default faction once loaded
    if (factions.value.length > 0 && !selectedFaction.value) {
      selectedFaction.value// = factions.value[0].id
    }

    loaded.value = true
  }

  function getUnitsByFaction(factionId: string): Unit[] {
    return units.value.filter(u => u.factionId === factionId)
  }

  return {
    units,
    factions,
    selectedFaction,
    load,
    getUnitsByFaction
  }
})