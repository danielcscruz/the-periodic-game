<template>
    <div class="info-wrapper">
        <div class="score-section">
            <h3>Neighboor</h3>

            <div>
    <div v-for="(item, index) in engine.chemino_neighbors" :key="index" class="mb-4 p-2 border rounded">
      <div>
        <strong>Elemento:</strong> {{ item.element }} (x: {{ item.x }}, y: {{ item.y }})
      </div>

      <ul class="ml-4 mt-2">
        <li v-for="(neighbor, nIndex) in item.neighbors" :key="nIndex">
          Vizinhança → Valor: {{ neighbor.value }} (x: {{ neighbor.x }}, y: {{ neighbor.y }})
        </li>
      </ul>
    </div>
  </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { useGameEngine } from '@/stores/engine'

const engine = useGameEngine()



</script>

<style lang="css" scoped>
@import './styles.css';

h6{
    font-size:20px;
    font-family: Arial;
}
</style>