<script setup>
import { ref } from 'vue'
import Unit from './Unit.vue'

const props = defineProps({
  id: Number
})

const units = ref([])

function addUnit() {
  units.value.push({
    id: crypto.randomUUID()
  })
}

function removeUnit(id) {
  units.value = units.value.filter(u => u.id !== id)
}
</script>

<template>
  <div class="platoon">
    <h3>Platoon {{ id }}</h3>

    <button @click="addUnit">+</button>

    <div v-for="unit in units" :key="unit.id">
      <Unit :id="unit.id" @remove="removeUnit" />
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