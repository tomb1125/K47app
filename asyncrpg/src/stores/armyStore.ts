// src/stores/armyStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUnitStore } from './unitStore'

export interface ArmyUpgrade {
  upgradeId: string
  count: number
}
export interface ArmyUnit {
  id: string,
  unitId: string | null
  quality: 'inexpierienced' | 'regular' | 'veteran' | null,
  upgrades: ArmyUpgrade[]
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

        // base cost
        let total = def.quality[u.quality] || 0

        // ⭐ upgrades
        for (const up of u.upgrades) {
          const opt = def.options.find(o => o.id === up.upgradeId)
          if (!opt) continue

          const key = `cost-${u.quality}`
          const cost = opt[key] || 0

          total += cost * up.count
        }

        return sum + total
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
  function setUnit(platoonId: string, armyUnitId: string, unitId: string | null) {
    const platoon = platoons.value.find(p => p.id === platoonId)
    if (!platoon) return

    const unit = platoon.units.find(u => u.id === armyUnitId)
    if (!unit) return

    unit.unitId = unitId

    if (!unitId) {
      unit.quality = null
      unit.upgrades = []
      return
    }

    const unitStore = useUnitStore()
    const def = unitStore.units.find(u => u.id === unitId)
    if (!def) return

    const qualities = Object.keys(def.quality)
    unit.quality = qualities.length > 0 ? qualities[0] : null

    // ⭐ initialize upgrades
    unit.upgrades = def.options.map(opt => ({
      upgradeId: opt.id,
      count: 0
    }))
  }
  function setUpgradeCount(
    platoonId: string,
    armyUnitId: string,
    upgradeId: string,
    count: number
  ) {
    const platoon = platoons.value.find(p => p.id === platoonId)
    if (!platoon) return

    const unit = platoon.units.find(u => u.id === armyUnitId)
    if (!unit) return

    const upgrade = unit.upgrades.find(u => u.upgradeId === upgradeId)
    if (!upgrade) return

    upgrade.count = count
  }

function setQuality(platoonId: string, unitId: string, quality: ArmyUnit['quality']) {
    const platoon = platoons.value.find(p => p.id === platoonId)
    if (!platoon) return

    const unit = platoon.units.find(u => u.id === unitId)
    if (!unit) return
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
    setQuality,
    setUpgradeCount
  }
})