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
</script>

<template>
  <div class="unit">

    <!-- ⭐ QUALITY PICKLIST -->
    <select
      :value="unit.quality || 'regular'"
      @change="e => armyStore.setQuality(platoonId, unit.id, e.target.value)"
    >
      <option value="inexpierienced">Inexperienced</option>
      <option value="regular">Regular</option>
      <option value="veteran">Veteran</option>
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
</template>
<style scoped>
.unit {
  border: 2px solid #888;
  padding: 10px;
  margin: 10px 0;
}
</style>