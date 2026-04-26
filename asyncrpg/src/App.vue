<script setup lang="ts">
import { onMounted } from 'vue'
import { useUnitStore } from '@/stores/unitStore'
import { useArmyStore } from '@/stores/armyStore'
import { storeToRefs } from 'pinia'
import Configurator from './components/Configurator.vue'

const store = useUnitStore()
const armyStore = useArmyStore()
const { factions, selectedFaction } = storeToRefs(store)
const { factionId } = storeToRefs(armyStore)
const { totalPoints } = storeToRefs(armyStore)
onMounted(() => {
  store.load()
})
</script>

<template>
  <div>
    <h1>Army Builder</h1>
    <div>
      Total Points: {{ totalPoints }}
    </div>
    <!-- Faction selector -->
    <select v-model="selectedFaction">
      <option
        v-for="f in factions"
        :key="f.id"
        :value="f.id"
      >
        {{ f.name }}
      </option>
    </select>
 
    <Configurator />
  </div>
</template>