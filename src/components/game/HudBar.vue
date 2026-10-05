<script setup lang="ts">
import { useGameEngine } from '@/stores/engine'
import { prettyFormula } from '@/components/elements/cheminos'
import PiecePreview from './PiecePreview.vue'

const engine = useGameEngine()
</script>

<template>
  <header class="hud">
    <div class="score">
      <span class="score-value" aria-label="Pontuação">{{ engine.score }}</span>
      <span class="score-meta">nível {{ engine.level }} · recorde {{ engine.best }}</span>
    </div>

    <button
      class="next"
      :class="{ locked: engine.nextLocked }"
      :aria-pressed="engine.nextLocked"
      :aria-label="engine.nextLocked ? 'Próxima peça travada, toque para destravar' : 'Travar a próxima peça'"
      @click="engine.toggleNextLock()"
    >
      <PiecePreview :matrix="engine.next.shape.matrix" :cell="14" />
      <span class="next-label">{{ engine.nextLocked ? 'travada' : prettyFormula(engine.next.formula) }}</span>
    </button>

    <button class="pause" aria-label="Pausar" @click="engine.togglePause(true)">
      <span aria-hidden="true">II</span>
    </button>
  </header>
</template>

<style scoped>
.hud {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: var(--gap);
  padding: 8px 4px;
}
.score {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.score-value {
  font-family: var(--font-pixel);
  font-size: clamp(28px, 8vw, 40px);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.score-meta {
  font-size: 13px;
  color: var(--muted);
  white-space: nowrap;
}
.next {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: var(--tap);
  padding: 4px 10px 4px 6px;
  background: none;
  border: 2px dashed var(--muted);
  cursor: pointer;
  touch-action: manipulation;
}
/* travar muda a moldura de tracejada (roleta girando) para sólida */
.next.locked {
  border-style: solid;
  border-color: var(--f-transition-metal);
}
.next-label {
  font-family: var(--font-pixel);
  font-size: 14px;
  min-width: 5ch;
  text-align: left;
}
.locked .next-label {
  color: var(--f-transition-metal);
}
.pause {
  width: var(--tap);
  height: var(--tap);
  background: none;
  border: 2px solid var(--frame);
  font-family: var(--font-pixel);
  font-size: 20px;
  cursor: pointer;
}
</style>
