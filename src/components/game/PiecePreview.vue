<script setup lang="ts">
import type { ShapeCell } from '@/components/elements/cheminos'
import ElementTile from './ElementTile.vue'

defineProps<{ matrix: ShapeCell[][]; cell?: number }>()
</script>

<template>
  <div class="preview" :style="{ '--cell': `${cell ?? 18}px` }">
    <template v-for="(row, r) in matrix" :key="r">
      <div v-for="(el, c) in row" :key="`${r}-${c}`" class="slot">
        <ElementTile v-if="el" :el="el" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.preview {
  display: grid;
  grid-template-columns: repeat(3, var(--cell));
  grid-auto-rows: var(--cell);
  gap: 1px;
}
</style>
