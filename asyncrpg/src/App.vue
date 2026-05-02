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
  <div class="app">
    <!-- Fixed header -->
    <div class="top-bar">
      <h2>Army Builder</h2>
      <div>Total Points: {{ totalPoints }}</div>

      <select v-model="selectedFaction">
        <option
          v-for="f in factions"
          :key="f.id"
          :value="f.id"
        >
          {{ f.name }}
        </option>
      </select>
    </div>

    <!-- Scrollable content -->
    <div class="content">
      <Configurator />
    </div>
  </div>
</template>


<style scoped>
.app {
  border: 2px solid #888;
  padding: 2px;
  margin: 2px 0;
}

.top-bar {
  font-weight: bold;
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 70px;

  display: flex;
  align-items: center;
  gap: 8px;

  padding: 0 8px;
  box-sizing: border-box;

  background: #1a1a1a;
  color: white;

  flex-shrink: 0;

  z-index: 1000;
}

/* 📜 Main content area */
.content {
  margin-top: 85px; /* MUST match top-bar height */

  padding: 8px;

  width: 100%;
  box-sizing: border-box;
}
</style>