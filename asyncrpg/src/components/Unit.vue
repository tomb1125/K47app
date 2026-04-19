<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUnitStore } from '@/stores/unitStore'
import { storeToRefs } from 'pinia'

const store = useUnitStore()
const { selectedFaction } = storeToRefs(store)

const selectedUnit = ref<string | null>(null)

onMounted(() => {
  store.load()
})

const availableUnits = computed(() =>
  store.getUnitsByFaction(selectedFaction.value)
)
</script>

<template>
  <div class="unit">
    <!-- Only unit dropdown now -->
    <select v-model="selectedUnit">
      <option disabled value="">Select unit</option>
      <option
        v-for="u in availableUnits"
        :key="u.id"
        :value="u.id"
      >
        {{ u.name }}
      </option>
    </select>
  </div>
</template>