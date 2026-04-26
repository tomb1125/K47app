<script setup lang="ts">
import { computed } from 'vue'
import Platoon from './Platoon.vue'
import { useUnitStore } from '@/stores/unitStore'
import { useArmyStore } from '@/stores/armyStore'
import { storeToRefs } from 'pinia'

const unitStore = useUnitStore()
const armyStore = useArmyStore()

const { selectedFaction } = storeToRefs(unitStore)
const { platoons } = storeToRefs(armyStore)

// button should be disabled if no faction selected
const isDisabled = computed(() => !selectedFaction.value)

function addPlatoon() {
  armyStore.addPlatoon()
}
</script>

<template>
  <div>
    <button
      @click="addPlatoon"
      :disabled="isDisabled"
    >
      Add platoon
    </button>

    <div v-for="platoon in platoons" :key="platoon.id">
      <Platoon :platoon="platoon" />
    </div>
  </div>
</template>