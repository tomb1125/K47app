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

function saveArmy() {
  const data = {
    factionId: selectedFaction.value,
    platoons: platoons.value
  }

  const json = JSON.stringify(data, null, 2)

  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `army-${selectedFaction.value || 'unknown'}.json`
  a.click()

  URL.revokeObjectURL(url)
}

function loadArmy(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result as string)

      // basic validation
      if (!data.platoons || !Array.isArray(data.platoons)) {
        throw new Error('Invalid file format')
      }

      // restore state
      armyStore.$patch({
        platoons: data.platoons
      })

      // restore faction if present
      if (data.factionId) {
        unitStore.selectedFaction = data.factionId
      }

    } catch (e) {
      console.error(e)
      alert('Failed to load army file')
    }
  }

  reader.readAsText(file)

  // reset input so same file can be reloaded
  input.value = ''
}
</script>

<template>
  <div>
    <div class="controls">
      <button
        @click="addPlatoon"
        :disabled="isDisabled"
      >
        Add platoon
      </button>

      <button
        @click="saveArmy"
        :disabled="isDisabled"
      >
        Save Army
      </button>

      <label class="load-button">
        Load Army
        <input
          type="file"
          accept=".json"
          @change="loadArmy"
          hidden
        />
      </label>
    </div>

    <div v-for="platoon in platoons" :key="platoon.id">
      <Platoon :platoon="platoon" />
    </div>
  </div>
</template>
<style scoped>
.controls {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.load-button {
  display: inline-block;
  padding: 6px 12px;
  background: #444;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

.load-button:hover {
  background: #666;
}
</style>
