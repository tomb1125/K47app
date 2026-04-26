// src/stores/armyStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUnitStore } from './unitStore'

export interface ArmyUnit {
  id: string,
  unitId: string | null
  quality: 'inexpierienced' | 'regular' | 'veteran' | null
}

export interface Platoon {
  id: string
  units: ArmyUnit[]
}

export const useArmyStore = defineStore('army', () => {
  const factionId = ref<string | null>(null)
  const platoons = ref<Platoon[]>([])

  const totalPoints = computed(() => {
    const unitStore = useUnitStore()

    return platoons.value
      .flatMap(p => p.units)
      .reduce((sum, u) => {
        if (!u.unitId || !u.quality) return sum

        const def = unitStore.units.find(x => x.id === u.unitId)
        if (!def) return sum

        return sum + def.quality[u.quality]
      }, 0)
  })
  // ➕ add platoon
  function addPlatoon() {
    platoons.value.push({
      id: crypto.randomUUID(),
      units: []
    })
  }

  // ❌ remove platoon
  function removePlatoon(id: string) {
    platoons.value = platoons.value.filter(p => p.id !== id)
  }

  // ➕ add unit to platoon
  function addUnit(platoonId: string) {
    const platoon = platoons.value.find(p => p.id === platoonId)
    if (!platoon) return

    const unit = {
      id: crypto.randomUUID() as string,
      unitId: null,
      quality: 'regular' // default
    };

    platoon.units.push(unit)

    
  }

  // ❌ remove unit
  function removeUnit(platoonId: string, unitId: string) {
    const platoon = platoons.value.find(p => p.id === platoonId)
    if (!platoon) return

    platoon.units = platoon.units.filter(u => u.id !== unitId)
  }

  // 🔄 set selected unit
  function setUnit(platoonId: string, unitId: string, selected: string | null) {
    const platoon = platoons.value.find(p => p.id === platoonId)
    if (!platoon) return

    const unit = platoon.units.find(u => u.id === unitId)
    if (!unit) return

    unit.unitId = selected
  }


function setQuality(platoonId: string, unitId: string, quality: ArmyUnit['quality']) {    const platoon = platoons.value.find(p => p.id === platoonId)
    if (!platoon) return

    const unit = platoon.units.find(u => u.id === unitId)
    if (!unit) return
    console.log(unitId);
    console.log(unit.id);
    console.log(unit.unitId);
    unit.quality = quality
  }

  return {
    factionId,
    platoons,
    totalPoints,
    addPlatoon,
    removePlatoon,
    addUnit,
    removeUnit,
    setUnit,
    setQuality
  }
})