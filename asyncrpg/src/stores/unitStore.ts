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

    const res = await fetch('/data/units.json')
    const data = await res.json()

    units.value = data.units
    factions.value = data.factions

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