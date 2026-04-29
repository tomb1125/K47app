<script setup lang="ts">
import { computed } from 'vue'
import { useArmyStore } from '@/stores/armyStore'
import { useUnitStore } from '@/stores/unitStore'
import { storeToRefs } from 'pinia'

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

function setNumber(upgradeId: string, value: string) {
  const count = parseInt(value) || 0

  armyStore.setUpgradeCount(
    props.platoonId,
    props.unit.id,
    upgradeId,
    count
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
    Number of models: {{armyStore.getUnitModelCount(unit)}}
  </div>
  <div v-if="upgrades.length > 0">
    <div v-for="opt in upgrades" :key="opt.id">

      <!-- SINGLE (checkbox) -->
      <div v-if="!opt.limit || opt.limit === 1">
        <label>
          <input
            type="checkbox"
            :checked="getUpgradeCount(opt.id) > 0"
            @change="e => setCheckbox(opt.id, e.target.checked)"
          />
          {{ opt.name }}
        </label>
      </div>

      <!-- MULTIPLE (number input) -->
      <div v-else>
        <label>
          {{ opt.name }}
          <input
            type="number"
            min="0"
            :max="opt.limit"
            :value="getUpgradeCount(opt.id)"
            @input="e => setNumber(opt.id, e.target.value)"
          />
        </label>
      </div>

    </div>
  </div>
</template>
<style scoped>
.unit {
  border: 2px solid #888;
  padding: 10px;
  margin: 10px 0;
}
</style>