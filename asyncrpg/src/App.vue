<script setup lang="ts">
import { onMounted } from 'vue'
import { useUnitStore } from '@/stores/unitStore'
import { storeToRefs } from 'pinia'
import Configurator from './components/Configurator.vue'

const store = useUnitStore()
const { factions, selectedFaction } = storeToRefs(store)

onMounted(() => {
  store.load()
})
</script>

<template>
  <div>
    <h1>Army Builder</h1>

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