<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useGameEngine } from '@/stores/engine'
import { reactions } from '@/game/reactions'
import GameBoard from '@/components/game/GameBoard.vue'
import HudBar from '@/components/game/HudBar.vue'
import TouchControls from '@/components/game/TouchControls.vue'
import WelcomeScreen from '@/components/game/WelcomeScreen.vue'
import ReactionCard from '@/components/game/ReactionCard.vue'

const engine = useGameEngine()

function onKeyDown(e: KeyboardEvent) {
  if (engine.phase === 'welcome') {
    if (e.code === 'Enter') engine.startNewGame()
    return
  }
  switch (e.code) {
    case 'ArrowLeft':
      engine.move(-1)
      break
    case 'ArrowRight':
      engine.move(1)
      break
    case 'ArrowUp':
    case 'KeyX':
      if (!e.repeat) engine.rotate()
      break
    case 'ArrowDown':
      if (!e.repeat) engine.hardDrop()
      break
    case 'ShiftLeft':
    case 'ShiftRight':
      engine.setSoftDrop(true)
      break
    case 'Space':
      if (!e.repeat) engine.toggleNextLock()
      break
    case 'KeyP':
    case 'Escape':
      engine.togglePause()
      break
    case 'KeyR':
      engine.startNewGame()
      break
    default:
      return
  }
  e.preventDefault()
}

function onKeyUp(e: KeyboardEvent) {
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') engine.setSoftDrop(false)
}

/* Pausa automaticamente ao trocar de aba ou bloquear o celular. */
function onVisibility() {
  if (document.hidden) engine.togglePause(true)
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  document.addEventListener('visibilitychange', onVisibility)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  document.removeEventListener('visibilitychange', onVisibility)
  engine.stopLoop()
})
</script>

<template>
  <main class="shell">
    <WelcomeScreen v-if="engine.phase === 'welcome'" />

    <div v-else class="game">
      <HudBar class="hud-slot" />
      <GameBoard class="board-slot" />
      <TouchControls class="controls-slot" />

      <aside class="side" aria-label="Reações disponíveis">
        <h2>Reações</h2>
        <ReactionCard v-for="r in reactions" :key="r.id" :reaction="r" compact />
      </aside>

      <div v-if="engine.paused && engine.phase !== 'over'" class="overlay" role="dialog" aria-modal="true" aria-labelledby="pause-title">
        <div class="panel">
          <h2 id="pause-title">Pausado</h2>
          <button class="btn btn-primary" @click="engine.togglePause(false)">Continuar</button>
          <button class="btn" @click="engine.startNewGame()">Recomeçar</button>
          <button class="btn" @click="engine.showWelcome()">Ver reações</button>
        </div>
      </div>

      <div v-if="engine.phase === 'over'" class="overlay" role="dialog" aria-modal="true" aria-labelledby="over-title">
        <div class="panel">
          <h2 id="over-title">Fim de jogo</h2>
          <p class="final">{{ engine.score }}</p>
          <p class="stats">
            {{ engine.reactionCount }} {{ engine.reactionCount === 1 ? 'reação' : 'reações' }} em
            {{ engine.pieceCount }} {{ engine.pieceCount === 1 ? 'molécula' : 'moléculas' }}<br />
            <span v-if="engine.score >= engine.best && engine.score > 0">Novo recorde!</span>
            <span v-else>Recorde: {{ engine.best }}</span>
          </p>
          <button class="btn btn-primary" @click="engine.startNewGame()">Jogar de novo</button>
          <button class="btn" @click="engine.showWelcome()">Ver reações</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.shell {
  height: 100dvh;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) 0 env(safe-area-inset-left);
}

/* ---------- mobile first: HUD, tabuleiro, controles ---------- */
.game {
  position: relative;
  height: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding: 0 12px max(12px, env(safe-area-inset-bottom));
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
}
.side {
  display: none;
}

@media (hover: hover) and (pointer: fine) {
  .controls-slot {
    display: none;
  }
  .game {
    grid-template-rows: auto minmax(0, 1fr);
    padding-top: 12px;
  }
}

/* ---------- telas largas: HUD à esquerda, reações à direita ---------- */
@media (min-width: 900px) and (hover: hover) and (pointer: fine) {
  .game {
    max-width: 1120px;
    grid-template-columns: 220px minmax(0, 1fr) 260px;
    grid-template-rows: minmax(0, 1fr);
    gap: 32px;
    padding: 24px;
  }
  .game .hud-slot {
    align-self: start;
    grid-template-columns: 1fr;
    justify-items: start;
  }
  .side {
    display: block;
    overflow-y: auto;
    padding-right: 4px;
  }
  .side h2 {
    font-family: var(--font-pixel);
    font-weight: 400;
    font-size: 22px;
    padding-bottom: 4px;
    border-bottom: 2px solid var(--frame);
  }
}

/* ---------- pausa e fim de jogo ---------- */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  padding: 24px;
  background: color-mix(in srgb, var(--bg) 78%, transparent);
  backdrop-filter: blur(3px);
}
.panel {
  width: min(320px, 100%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px;
  background: var(--bg);
  border: 2px solid var(--frame);
  text-align: center;
}
.panel h2 {
  font-family: var(--font-pixel);
  font-weight: 400;
  font-size: 40px;
  line-height: 1;
  margin-bottom: 8px;
}
.final {
  font-family: var(--font-pixel);
  font-size: 56px;
  line-height: 1;
  color: var(--f-non-metal);
}
.stats {
  color: var(--muted);
  font-size: 14px;
  margin-bottom: 8px;
}
</style>
