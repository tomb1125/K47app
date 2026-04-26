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
  }
}>()

const armyStore = useArmyStore()
const unitStore = useUnitStore()

const { selectedFaction } = storeToRefs(unitStore)

const availableUnits = computed(() =>
  unitStore.getUnitsByFaction(selectedFaction.value || '')
)

function onChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  armyStore.setUnit(props.platoonId, props.unit.id, value)
}
</script>

<template>
  <div class="unit">
    <select
      :value="unit.id || ''"
      @change="onChange"
    >
      <option disabled value="">Select unit</option>
      <option
        v-for="u in availableUnits"
        :key="u.id"
        :value="u.id"
      >
        {{ u.name }}
      </option>
    </select>

    <button @click="armyStore.removeUnit(platoonId, unit.id)">
      🗑
    </button>
  </div>
</template>

<style scoped>
.unit {
  border: 2px solid #888;
  padding: 10px;
  margin: 10px 0;
}
</style>