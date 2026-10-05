<script setup lang="ts">
import { computed } from 'vue'
import type { Reaction } from '@/game/types'
import { effectLabel, reagentList } from '@/game/reactions'
import ElementTile from './ElementTile.vue'

const props = defineProps<{ reaction: Reaction; compact?: boolean }>()
const atoms = computed(() => reagentList(props.reaction.reagents))
</script>

<template>
  <article class="reaction" :class="[`eff-${reaction.effect}`, { compact }]">
    <div class="atoms" :style="{ '--cell': compact ? '20px' : '26px' }">
      <div v-for="(el, i) in atoms" :key="i" class="atom"><ElementTile :el="el" /></div>
    </div>
    <h3>{{ reaction.name }}</h3>
    <p v-if="!compact" class="eq">{{ reaction.equation }}</p>
    <p class="effect">{{ effectLabel[reaction.effect] }}</p>
  </article>
</template>

<style scoped>
.reaction {
  padding: 12px 0;
  border-bottom: 1px solid var(--well-line);
}
.compact {
  padding: 8px 0;
}
.atoms {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin-bottom: 6px;
}
.atom {
  width: var(--cell);
  height: var(--cell);
}
h3 {
  font-family: var(--font-pixel);
  font-weight: 400;
  font-size: 18px;
  line-height: 1.2;
}
.compact h3 {
  font-size: 15px;
}
.eq {
  font-size: 14px;
  color: var(--muted);
}
.effect {
  font-size: 13px;
  color: var(--f-non-metal);
}
.eff-blast .effect { color: var(--f-alkaline-earth-metal); }
.eff-rows .effect { color: var(--f-hydrogen); }
.eff-all .effect { color: var(--f-actinide); }
</style>
