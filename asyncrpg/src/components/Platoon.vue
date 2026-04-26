<script setup lang="ts">
import { useArmyStore } from '@/stores/armyStore'
import Unit from './Unit.vue'

const props = defineProps<{
  platoon: {
    id: string
    units: any[]
  }
}>()

const store = useArmyStore()
</script>

<template>
  <div class="platoon">
    <button @click="store.addUnit(platoon.id)">+</button>

    <div v-for="unit in platoon.units" :key="unit.id">
      <Unit :platoonId="platoon.id" :unit="unit" />
    </div>
  </div>
</template>

<style scoped>
.platoon {
  border: 2px solid #888;
  padding: 10px;
  margin: 10px 0;
}
</style>