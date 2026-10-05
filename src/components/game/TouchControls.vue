<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { useGameEngine } from '@/stores/engine'

const engine = useGameEngine()

/* Segurar ← ou → repete o movimento, como num controle físico. */
let delay: number | undefined
let repeat: number | undefined

function stopRepeat() {
  clearTimeout(delay)
  clearInterval(repeat)
}

function holdMove(dir: -1 | 1, e: PointerEvent) {
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  engine.move(dir)
  stopRepeat()
  delay = window.setTimeout(() => {
    repeat = window.setInterval(() => engine.move(dir), 60)
  }, 180)
}

onBeforeUnmount(stopRepeat)
</script>

<template>
  <nav class="pad" aria-label="Controles">
    <div class="cluster">
      <button class="key" aria-label="Mover para a esquerda" @pointerdown="holdMove(-1, $event)" @pointerup="stopRepeat" @pointercancel="stopRepeat">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7" /></svg>
      </button>
      <button class="key" aria-label="Mover para a direita" @pointerdown="holdMove(1, $event)" @pointerup="stopRepeat" @pointercancel="stopRepeat">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
      </button>
    </div>
    <div class="cluster">
      <button class="key" aria-label="Derrubar" @pointerdown="engine.hardDrop()">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 8 6 6 6-6M6 19h12" /></svg>
      </button>
      <button class="key key-main" aria-label="Girar" @pointerdown="engine.rotate()">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12a7 7 0 1 1-2.05-4.95M19 4v4h-4" /></svg>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.pad {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 4px 4px;
  touch-action: none;
}
.cluster {
  display: flex;
  gap: 10px;
  align-items: center;
}
.key {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--frame) 8%, transparent);
  border: 2px solid var(--frame);
  border-radius: 4px;
  cursor: pointer;
  touch-action: none;
  user-select: none;
}
.key:active {
  background: var(--frame);
  color: var(--bg);
  transform: translateY(2px);
}
.key-main {
  width: 76px;
  height: 76px;
  border-color: var(--f-non-metal);
  color: var(--f-non-metal);
}
svg {
  width: 28px;
  height: 28px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: square;
}
</style>
