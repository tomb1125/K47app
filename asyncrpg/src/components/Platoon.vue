<script setup lang="ts">
import { useArmyStore, type ArmyUnit } from '@/stores/armyStore'
import Unit from './Unit.vue'

const props = defineProps<{
  platoon: {
    id: string
    units: ArmyUnit[]
  }
}>()

const store = useArmyStore()
</script>

<template>
  <div class="platoon ">
    <div class="platoon-header">
      <button @click="store.addUnit(platoon.id)">Add Unit</button>
      <button
          class="delete-btn"
          @click="store.removePlatoon(platoon.id)"
          title="Remove platoon"
        >
          Delete Platoon 🗑
      </button>
    </div>
    <div v-for="unit in platoon.units" :key="unit.id">
      <Unit :platoonId="platoon.id" :unit="unit" />
    </div>
  </div>
</template>

<style scoped>
.platoon {
  border: 2px solid #888;
  padding: 2px;
  margin: 2px 0;
}

.platoon-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}


.delete-btn:hover {
  color: red;
}
</style>