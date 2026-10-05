<script setup lang="ts">
import { computed } from 'vue'
import { atomicNumberOf, familyOf } from '@/components/elements/periodic'

const props = withDefaults(defineProps<{ el: string; showNumber?: boolean }>(), {
  showNumber: false,
})

const family = computed(() => `fam-${familyOf(props.el)}`)
const z = computed(() => atomicNumberOf(props.el))
</script>

<template>
  <div class="tile" :class="family" :title="el">
    <span v-if="showNumber" class="z" aria-hidden="true">{{ z }}</span>
    <span class="sym">{{ el }}</span>
  </div>
</template>

<style scoped>
.tile {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--c) 18%, var(--well));
  border: max(1.5px, calc(var(--cell, 32px) * 0.065)) solid var(--c);
  border-radius: 2px;
  box-shadow:
    inset 0 calc(var(--cell, 32px) * -0.08) 0 color-mix(in srgb, var(--c) 30%, transparent),
    inset 0 0 0 1px rgba(0, 0, 0, 0.3);
  color: var(--c);
  font-family: var(--font-pixel);
  line-height: 1;
  user-select: none;
}
.sym {
  font-size: calc(var(--cell, 32px) * 0.44);
}
.z {
  position: absolute;
  top: 9%;
  left: 11%;
  font-size: calc(var(--cell, 32px) * 0.21);
  opacity: 0.65;
}
</style>
