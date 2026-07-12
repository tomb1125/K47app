// src/stores/armyStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUnitStore } from './unitStore'
import type { Unit } from '@/types/unit'
import { v4 as uuidv4 } from 'uuid';

export interface ArmyUpgrade {
  upgradeId: string
  count: number,
  addModels?: number
}

export interface ArmyProperty {
  propertyId: string
  selected: boolean
  costPerUnit: number | null
}

type Quality = 'inexperienced' | 'regular' | 'veteran'
export interface ArmyUnit {
  id: string,
  unitId: string | null
  quality: Quality | null | undefined,
  upgrades: ArmyUpgrade[],
  properties?: ArmyProperty[],
  models: number
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

        for (const up of u.upgrades) {
          const opt = def.options.find(o => o.id === up.upgradeId)
          if (!opt) continue

          const costMap = {
            inexperienced: opt.costInexperienced,
            regular: opt.costRegular,
            veteran: opt.costVeteran
          }

          const cost = costMap[u.quality] ?? opt.cost ?? 0

          total += cost * up.count
        }

        const modelCount = getUnitModelCount(u)
        if(u.properties === undefined) {
          u.properties = [];
        }

        for (const prop of u.properties) {
          if (!prop.selected) continue

          const defProp = def.upgrades.find(p => p.id === prop.propertyId)
          if (!defProp) continue

          const costPerModel = defProp.costPerUnit || 0

          total += costPerModel * modelCount
        }

        return sum + total
      }, 0)
  })
  // ➕ add platoon
  function addPlatoon() {
    platoons.value.unshift({
      id: uuidv4(),
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
      id: uuidv4()  as string,
      unitId: null,
      quality: 'regular',
      upgrades: [],
      properties: [],
      models: 0
    };

    platoon.units.unshift(unit as any)

    
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
      unit.properties = []
      return
    }

    const unitStore = useUnitStore()
    const def = unitStore.units.find(u => u.id === unitId)
    if (!def) return

    const qualities = Object.keys(def.quality)
    unit.quality = qualities.length > 0
      ? (qualities[0] as Quality)
      : null
    // ⭐ initialize upgrades
    unit.upgrades = def.options.map(opt => ({
      upgradeId: opt.id,
      count: 0
    }))

    unit.properties = (def.upgrades || []).map(p => ({
      propertyId: p.id,
      selected: false,
      costPerUnit: p.costPerUnit
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

function setQuality(platoonId: string, unitId: string, quality: string) {
    const platoon = platoons.value.find(p => p.id === platoonId)
    if (!platoon) return

    const unit = platoon.units.find(u => u.id === unitId)
    if (!unit) return
    unit.quality = quality as ArmyUnit['quality'] 
  }

function getUnitModelCount(unit: Unit | ArmyUnit): number {
  const unitStore = useUnitStore()

  if (!unit.unitId) return 0

  const def = unitStore.units.find(u => u.id === unit.unitId)
  if (!def) return 0

  let total = def.models || 0

  // add models from upgrades/options
  for (const up of unit.upgrades) {
    const opt = def.options.find(o => o.id === up.upgradeId)
    if (!opt) continue

    const add = opt.addModels || 0
    total += add * (up.count ?? 1)
  }

  return total
}

function toggleProperty(
  platoonId: string,
  armyUnitId: string,
  propertyId: string,
  selected: boolean
) {
  const platoon = platoons.value.find(p => p.id === platoonId)
  if (!platoon) return

  const unit = platoon.units.find(u => u.id === armyUnitId)
  if (!unit) return
  if(unit.properties === undefined) {
      unit.properties = [];
  }
  const prop = unit.properties.find(p => p.propertyId === propertyId)
  if (!prop) return

  prop.selected = selected
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
    setUpgradeCount,
    getUnitModelCount,
    toggleProperty
  }
})