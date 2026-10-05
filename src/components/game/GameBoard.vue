<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useGameEngine } from '@/stores/engine'
import { COLS, ROWS } from '@/game/config'
import { blockPositions } from '@/game/board'
import { familyOf } from '@/components/elements/periodic'
import ElementTile from './ElementTile.vue'

const engine = useGameEngine()

/* ---------- tamanho responsivo: células sempre quadradas ---------- */
const area = ref<HTMLElement | null>(null)
const cell = ref(28)
let observer: ResizeObserver | null = null

onMounted(() => {
  observer = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect
    cell.value = Math.max(14, Math.floor(Math.min(width / COLS, height / ROWS)))
  })
  if (area.value) observer.observe(area.value)
})
onBeforeUnmount(() => observer?.disconnect())

const boardW = computed(() => cell.value * COLS)
const boardH = computed(() => cell.value * ROWS)

/* ---------- células com id estável (permite animar queda e reação) ---------- */
interface RenderCell {
  id: number
  el: string
  r: number
  c: number
  active: boolean
  fx?: 'reagent' | 'caught'
}

const cells = computed<RenderCell[]>(() => {
  const out: RenderCell[] = []
  engine.board.forEach((row, r) =>
    row.forEach((cellData, c) => {
      if (cellData)
        out.push({ id: cellData.id, el: cellData.el, r, c, active: false, fx: engine.flashing[cellData.id] })
    }),
  )
  if (engine.active) {
    const piece = engine.active
    blockPositions(piece).forEach((p, i) =>
      out.push({ id: piece.blocks[i].id, el: piece.blocks[i].el, r: p.r, c: p.c, active: true }),
    )
  }
  return out
})

const ghost = computed(() => {
  if (!engine.active || engine.ghostRow === null || engine.ghostRow === engine.active.r) return []
  return blockPositions({ ...engine.active, r: engine.ghostRow }).map((p, i) => ({
    ...p,
    key: `g${i}`,
    el: engine.active!.blocks[i].el,
  }))
})

const at = (r: number, c: number) => ({
  transform: `translate(${c * cell.value}px, ${r * cell.value}px)`,
})

const toastStyle = (r: number, c: number) => {
  const half = Math.min(110, boardW.value / 2)
  const x = Math.min(Math.max((c + 0.5) * cell.value, half), boardW.value - half)
  const y = Math.max((r - 0.5) * cell.value, cell.value * 1.5)
  return { left: `${x}px`, top: `${y}px` }
}

const PARTICLES = 8

/* ---------- gestos: arrastar move, toque gira, deslizar para baixo acelera/derruba ---------- */
let gesture: { x: number; y: number; t: number; steps: number; dragged: boolean; soft: boolean } | null = null

function onPointerDown(e: PointerEvent) {
  if (!engine.canControl) return
  gesture = { x: e.clientX, y: e.clientY, t: performance.now(), steps: 0, dragged: false, soft: false }
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!gesture) return
  const dx = e.clientX - gesture.x
  const dy = e.clientY - gesture.y
  if (Math.abs(dx) > 8 || Math.abs(dy) > 8) gesture.dragged = true

  const steps = Math.trunc(dx / (cell.value * 0.9))
  while (steps > gesture.steps) {
    engine.move(1)
    gesture.steps++
  }
  while (steps < gesture.steps) {
    engine.move(-1)
    gesture.steps--
  }
  if (!gesture.soft && dy > cell.value * 1.2 && Math.abs(dy) > Math.abs(dx)) {
    gesture.soft = true
    engine.setSoftDrop(true)
  }
}

function onPointerUp(e: PointerEvent) {
  if (!gesture) return
  const dt = performance.now() - gesture.t
  const dy = e.clientY - gesture.y
  if (!gesture.dragged && dt < 280) engine.rotate()
  else if (dy > cell.value * 2.5 && dy / dt > 0.8) engine.hardDrop()
  engine.setSoftDrop(false)
  gesture = null
}
</script>

<template>
  <div ref="area" class="board-area">
    <div
      class="board"
      :class="engine.shake ? `shake-${engine.shake}` : ''"
      :style="{ '--cell': `${cell}px`, width: `${boardW}px`, height: `${boardH}px` }"
      role="img"
      :aria-label="`Tabuleiro com ${cells.length} átomos`"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <!-- sombra de onde a peça vai cair -->
      <div v-for="g in ghost" :key="g.key" class="ghost" :class="`fam-${familyOf(g.el)}`" :style="at(g.r, g.c)" />

      <div
        v-for="item in cells"
        :key="item.id"
        class="cell"
        :class="{ active: item.active, [`fx-${item.fx}`]: item.fx }"
        :style="at(item.r, item.c)"
      >
        <div class="fx">
          <ElementTile :el="item.el" :show-number="cell >= 30" />
        </div>
      </div>

      <!-- partículas dos átomos consumidos -->
      <div
        v-for="b in engine.bursts"
        :key="b.id"
        class="burst"
        :class="`fam-${familyOf(b.el)}`"
        :style="at(b.r, b.c)"
        aria-hidden="true"
      >
        <span class="ring" />
        <span v-for="i in PARTICLES" :key="i" class="spark" :style="{ '--a': `${(360 / PARTICLES) * i + 12}deg` }" />
      </div>

      <div v-if="engine.shake === 'all'" class="flash-all" aria-hidden="true" />

      <!-- nome da reação e pontos -->
      <div
        v-for="t in engine.toasts"
        :key="t.id"
        class="toast"
        :class="`toast-${t.effect}`"
        :style="toastStyle(t.r, t.c)"
        role="status"
      >
        <span class="toast-name">{{ t.name }}</span>
        <span class="toast-eq">{{ t.equation }}</span>
        <span class="toast-points">+{{ t.points }}<small v-if="t.chain > 1"> cadeia ×{{ t.chain }}</small></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board-area {
  min-height: 0;
  min-width: 0;
  display: grid;
  place-items: center;
}

.board {
  position: relative;
  touch-action: none;
  user-select: none;
  background-color: var(--well);
  background-image:
    linear-gradient(var(--well-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--well-line) 1px, transparent 1px);
  background-size: var(--cell) var(--cell);
  /* paredes do tubo de ensaio: laterais e fundo */
  box-shadow:
    -3px 0 0 var(--frame),
    3px 0 0 var(--frame),
    0 3px 0 var(--frame),
    -3px 3px 0 var(--frame),
    3px 3px 0 var(--frame);
}

.cell,
.ghost,
.burst {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--cell);
  height: var(--cell);
}

/* queda após reação com leve quique; peça ativa responde rápido */
.cell {
  transition: transform 230ms cubic-bezier(0.3, 1.35, 0.55, 1);
  will-change: transform;
}
.cell.active {
  transition-duration: 70ms;
  transition-timing-function: linear;
  z-index: 2;
}
.fx {
  width: 100%;
  height: 100%;
}

.ghost {
  border: 1.5px dashed var(--c);
  opacity: 0.35;
  border-radius: 2px;
}

/* ---------- animação da reação ---------- */
.fx-reagent {
  z-index: 3;
}
.fx-reagent .fx {
  animation: react 560ms cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
}
.fx-caught .fx {
  animation: caught 560ms steps(1, end) forwards;
}

@keyframes react {
  0% {
    transform: scale(1);
    filter: brightness(1);
  }
  18% {
    transform: scale(1.22);
    filter: brightness(2.2) saturate(1.4);
  }
  40% {
    transform: scale(1.08);
    filter: brightness(1.6);
  }
  70% {
    transform: scale(1.12) rotate(-4deg);
    filter: brightness(2);
  }
  100% {
    transform: scale(0.15) rotate(12deg);
    filter: brightness(3);
    opacity: 0;
  }
}
.fx-reagent :deep(.tile) {
  box-shadow: 0 0 calc(var(--cell) * 0.7) var(--c);
}

@keyframes caught {
  0%,
  30%,
  60% {
    opacity: 1;
  }
  15%,
  45%,
  75% {
    opacity: 0.35;
  }
  100% {
    opacity: 0;
  }
}

.burst {
  pointer-events: none;
  z-index: 4;
}
.ring {
  position: absolute;
  inset: 0;
  border: 2px solid var(--c);
  border-radius: 50%;
  animation: ring 520ms ease-out forwards;
}
@keyframes ring {
  from {
    transform: scale(0.4);
    opacity: 0.9;
  }
  to {
    transform: scale(2.2);
    opacity: 0;
  }
}
.spark {
  position: absolute;
  top: 50%;
  left: 50%;
  width: calc(var(--cell) * 0.16);
  height: calc(var(--cell) * 0.16);
  margin: calc(var(--cell) * -0.08);
  background: var(--c);
  animation: spark 650ms cubic-bezier(0.1, 0.7, 0.3, 1) forwards;
}
@keyframes spark {
  from {
    transform: rotate(var(--a)) translateX(0) scale(1);
    opacity: 1;
  }
  to {
    transform: rotate(var(--a)) translateX(calc(var(--cell) * 1.4)) scale(0.3);
    opacity: 0;
  }
}

/* tremor proporcional à força da reação */
.shake-blast {
  animation: shake 280ms linear 2;
}
.shake-rows {
  animation: shake 220ms linear 3;
}
.shake-all {
  animation: shake-hard 180ms linear 4;
}
@keyframes shake {
  25% {
    translate: -2px 1px;
  }
  75% {
    translate: 2px -1px;
  }
}
@keyframes shake-hard {
  25% {
    translate: -5px 2px;
  }
  75% {
    translate: 5px -3px;
  }
}
.flash-all {
  position: absolute;
  inset: 0;
  background: var(--f-actinide);
  mix-blend-mode: screen;
  animation: flash 600ms ease-out forwards;
  pointer-events: none;
  z-index: 5;
}
@keyframes flash {
  from {
    opacity: 0.85;
  }
  to {
    opacity: 0;
  }
}

/* ---------- rótulo da reação ---------- */
.toast {
  position: absolute;
  z-index: 6;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: max-content;
  max-width: 220px;
  padding: 6px 10px;
  translate: -50% -100%;
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  border: 2px solid var(--ink);
  text-align: center;
  pointer-events: none;
  animation: toast 1650ms cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
}
.toast-blast {
  border-color: var(--f-alkaline-earth-metal);
}
.toast-rows {
  border-color: var(--f-hydrogen);
}
.toast-all {
  border-color: var(--f-actinide);
}
.toast-name {
  font-family: var(--font-pixel);
  font-size: 15px;
  line-height: 1.1;
}
.toast-eq {
  font-size: 11px;
  color: var(--muted);
}
.toast-points {
  font-family: var(--font-pixel);
  font-size: 22px;
  line-height: 1.1;
  color: var(--f-non-metal);
}
.toast-points small {
  font-size: 13px;
  color: var(--f-transition-metal);
}
@keyframes toast {
  0% {
    transform: translateY(8px) scale(0.7);
    opacity: 0;
  }
  12% {
    transform: translateY(0) scale(1.06);
    opacity: 1;
  }
  20% {
    transform: scale(1);
  }
  80% {
    transform: translateY(-10px);
    opacity: 1;
  }
  100% {
    transform: translateY(-22px);
    opacity: 0;
  }
}
</style>
