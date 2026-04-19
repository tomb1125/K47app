<script setup>
import { ref, computed } from 'vue'
import Platoon from './Platoon.vue'
import { useUnitStore } from '@/stores/unitStore'
import { storeToRefs } from 'pinia'

const platoons = ref([])

const store = useUnitStore()
const { selectedFaction } = storeToRefs(store)

// button should be disabled if no faction selected
const isDisabled = computed(() => !selectedFaction.value)

function addPlatoon() {
  platoons.value.push({
    id: Date.now()
  })
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
      <Platoon :id="platoon.id" />
    </div>
  </div>
</template>