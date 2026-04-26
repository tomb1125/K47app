// src/stores/armyStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ArmyUnit {
  id: string
  unitId: string | null
}

export interface Platoon {
  id: string
  units: ArmyUnit[]
}

export const useArmyStore = defineStore('army', () => {
  const factionId = ref<string | null>(null)
  const platoons = ref<Platoon[]>([])

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

    platoon.units.push({
      id: crypto.randomUUID(),
      unitId: null
    })
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

  return {
    factionId,
    platoons,
    addPlatoon,
    removePlatoon,
    addUnit,
    removeUnit,
    setUnit
  }
})