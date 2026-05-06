<script setup lang="ts">
import { computed } from 'vue'
import { useArmyStore } from '@/stores/armyStore'
import { useUnitStore } from '@/stores/unitStore'
import { storeToRefs } from 'pinia'
import type { Unit } from '@/types/unit';

const props = defineProps<{
  platoonId: string
  unit: {
    id: string
    unitId: string | null
    quality: 'inexpierienced' | 'regular' | 'veteran' | null
  }
}>()

const armyStore = useArmyStore()
const unitStore = useUnitStore()

const { selectedFaction } = storeToRefs(unitStore)

const availableUnits = computed(() =>
  unitStore.getUnitsByFaction(selectedFaction.value || '')
)

const selectedDefinition = computed(() =>
  unitStore.units.find(u => u.id === props.unit.unitId)
)

const availableQualities = computed(() => {
  if (!selectedDefinition.value) return []

  return Object.keys(selectedDefinition.value.quality)
})

const upgrades = computed(() => selectedDefinition.value?.options || [])

function getUpgradeCount(upgradeId: string) {
  return props.unit.upgrades.find(u => u.upgradeId === upgradeId)?.count || 0
}

function setCheckbox(upgradeId: string, checked: boolean) {
  armyStore.setUpgradeCount(
    props.platoonId,
    props.unit.id,
    upgradeId,
    checked ? 1 : 0
  )
}
const properties = computed(() =>
  selectedDefinition.value?.upgrades || []
)

function formatUpgradeCost(unit: Unit, opt: any) {
  if (!unit.quality) return ''

  const costMap = {
    inexperienced: opt.costInexperienced,
    regular: opt.costRegular,
    veteran: opt.costVeteran
  }

  const cost = costMap[unit.quality] ?? opt.cost ?? 0

  return cost > 0 ? `+${cost}` : `${cost}`
}

function formatPropertyCost(propertyId: string) {
  const def = selectedDefinition.value
  if (!def) return ''

  const prop = def.upgrades.find(p => p.id === propertyId)
  if (!prop) return ''

  const cost = prop.costPerUnit || 0

  return cost > 0 ? `+${cost}/model` : `${cost}/model`
}

function setNumber(upgradeId: string, value: string) {
  const count = parseInt(value) || 0

  armyStore.setUpgradeCount(
    props.platoonId,
    props.unit.id,
    upgradeId,
    count
  )
}

function isPropertySelected(propertyId: string) {
  return props.unit.properties.find(p => p.propertyId === propertyId)?.selected || false
}

function toggle(propertyId: string, selected: boolean) {
  armyStore.toggleProperty(
    props.platoonId,
    props.unit.id,
    propertyId,
    selected
  )
}
</script>

<template>
  <div class="unit">

    <!-- ⭐ QUALITY PICKLIST -->
  <select
    :value="unit.quality || ''"
    @change="e => armyStore.setQuality(platoonId, unit.id, e.target.value)"
  >
    <option
      v-for="q in availableQualities"
      :key="q"
      :value="q"
    >
      {{ q.charAt(0).toUpperCase() + q.slice(1) }}
    </option>
  </select>

    <!-- UNIT PICKLIST -->
    <select
      :value="unit.unitId || ''"
      @change="e => armyStore.setUnit(platoonId, unit.id, e.target.value)"
    >
      <option disabled value="">Select unit</option>
      <option v-for="u in availableUnits" :key="u.id" :value="u.id">
        {{ u.name }}
      </option>
    </select>

    <button @click="armyStore.removeUnit(platoonId, unit.id)">
      🗑
    </button>

  </div>
  <div>
    <div class="small-title">Number of models: {{armyStore.getUnitModelCount(unit)}}</div>
  </div>
<div v-if="upgrades.length > 0" class="section">
  <div class="small-title">Upgrades</div>

  <div class="grid">
    <template v-for="opt in upgrades" :key="opt.id">

      <!-- LABEL -->
      <div class="label">
        {{ opt.name }}
      </div>

      <!-- COST -->
      <div class="cost">
        {{ formatUpgradeCost(unit, opt) }}
      </div>

      <!-- INPUT -->
      <div class="input">
        <!-- SINGLE -->
        <input
          v-if="!opt.limit || opt.limit === 1"
          type="checkbox"
          :checked="getUpgradeCount(opt.id) > 0"
          @change="e => setCheckbox(opt.id, e.target.checked)"
        />

        <!-- MULTIPLE -->
        <input
          v-else
          type="number"
          min="0"
          :max="opt.limit"
          :value="getUpgradeCount(opt.id)"
          @input="e => setNumber(opt.id, e.target.value)"
        />
      </div>

    </template>
  </div>
</div>


<div v-if="properties.length > 0" class="section">
  <div class="small-title">Properties</div>

  <div class="grid">
    <template v-for="prop in properties" :key="prop.id">

      <!-- LABEL -->
      <div class="label">
        {{ prop.name }}
      </div>

      <!-- COST -->
      <div class="cost">
        {{ formatPropertyCost(prop.id) }}
      </div>

      <!-- INPUT -->
      <div class="input">
        <input
          type="checkbox"
          :checked="isPropertySelected(prop.id)"
          @change="e => toggle(prop.id, e.target.checked)"
        />
      </div>

    </template>
  </div>
</div>
</template>
<style scoped>
.unit {
  border: 2px solid #888;
  padding: 2px;
  margin: 2px 0;
}

.grid {
  display: grid;
  grid-template-columns: 1fr auto min-content;
  gap: 6px 12px;
  align-items: center;
}

.small-title {
  font-style: italic;
  color: #666;
}

/* 📱 MOBILE */
@media (max-width: 400px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .label {
    font-weight: 500;
  }

  .cost,
  .input {
    display: inline-block;
  }

  .cost {
    margin-right: 10px;
  }

  .input {
    float: right;
  }
}
</style>