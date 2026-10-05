<script setup lang="ts">
import { ref } from 'vue'
import { useGameEngine } from '@/stores/engine'
import { reactions } from '@/game/reactions'
import { chemino_items, prettyFormula } from '@/components/elements/cheminos'
import ReactionCard from './ReactionCard.vue'
import PiecePreview from './PiecePreview.vue'

const engine = useGameEngine()
const tab = ref<'reactions' | 'molecules' | 'about'>('reactions')
</script>

<template>
  <section class="welcome" aria-labelledby="title">
    <div class="scroll">
      <h1 id="title">Periodic<br />Tetris</h1>
      <p class="lede">
        Encaixe as moléculas que caem. Quando os reagentes de uma reação se tocam, vindos de moléculas
        diferentes, eles reagem e saem do tabuleiro.
      </p>

      <p class="how">
        <span class="touch">Arraste para mover, toque para girar, deslize para baixo para derrubar.</span>
        <span class="keys">← → movem, ↑ gira, ↓ derruba, espaço trava a próxima peça, P pausa.</span>
        Toque na próxima peça para travá-la antes que ela troque.
      </p>

      <div class="tabs" role="tablist">
        <button role="tab" :aria-selected="tab === 'reactions'" @click="tab = 'reactions'">Reações</button>
        <button role="tab" :aria-selected="tab === 'molecules'" @click="tab = 'molecules'">Moléculas</button>
        <button role="tab" :aria-selected="tab === 'about'" @click="tab = 'about'">Sobre</button>
      </div>

      <div v-if="tab === 'reactions'" role="tabpanel">
        <ReactionCard v-for="r in reactions" :key="r.id" :reaction="r" />
      </div>

      <ul v-else-if="tab === 'molecules'" class="molecules" role="tabpanel">
        <li v-for="m in chemino_items" :key="m.formula">
          <PiecePreview :matrix="m.shape.matrix" :cell="16" />
          <span class="formula">{{ prettyFormula(m.formula) }}</span>
          <span class="name">{{ m.display }}</span>
        </li>
      </ul>

      <div v-else class="about" role="tabpanel">
        <p>
          Periodic Tetris mistura o clássico jogo de encaixar peças com química: cada peça é uma molécula,
          e os átomos reagem quando se encontram.
        </p>
        <p class="credit">
          Desenvolvido por
          <a href="https://instagram.com/danccruz" target="_blank" rel="noopener noreferrer">@danccruz</a>
        </p>
      </div>
    </div>

    <div class="cta">
      <button class="btn btn-primary" @click="engine.startNewGame()">Começar</button>
    </div>
  </section>
</template>

<style scoped>
.welcome {
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 560px;
  margin: 0 auto;
}
.scroll {
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px 12px;
}
h1 {
  font-family: var(--font-pixel);
  font-weight: 400;
  font-size: clamp(52px, 17vw, 88px);
  line-height: 0.88;
  color: var(--f-non-metal);
}
.lede {
  margin-top: 16px;
  max-width: 42ch;
  font-size: 17px;
}
.how {
  margin-top: 12px;
  font-size: 14px;
  color: var(--muted);
}
.how span {
  display: block;
}
@media (hover: hover) and (pointer: fine) {
  .touch { display: none !important; }
}
@media (hover: none), (pointer: coarse) {
  .keys { display: none !important; }
}
.tabs {
  display: flex;
  gap: 4px;
  margin-top: 24px;
  border-bottom: 2px solid var(--frame);
}
.tabs button {
  min-height: 48px;
  padding: 0 16px;
  background: none;
  border: 2px solid transparent;
  border-bottom: none;
  font-family: var(--font-pixel);
  font-size: 18px;
  color: var(--muted);
  cursor: pointer;
}
.tabs button[aria-selected='true'] {
  border-color: var(--frame);
  color: var(--ink);
  background: var(--well);
}
.molecules {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px 12px;
  margin-top: 16px;
}
.molecules li {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 10px;
  align-items: center;
}
.molecules :deep(.preview) {
  grid-row: span 2;
}
.formula {
  font-family: var(--font-pixel);
  font-size: 18px;
  align-self: end;
}
.name {
  font-size: 12px;
  color: var(--muted);
  align-self: start;
  line-height: 1.2;
}
.about {
  margin-top: 16px;
  max-width: 42ch;
}
.about p + p {
  margin-top: 12px;
}
.credit {
  color: var(--muted);
}
.credit a {
  color: var(--ink);
  font-weight: 600;
}
.cta {
  padding: 12px 20px max(16px, env(safe-area-inset-bottom));
  border-top: 1px solid var(--well-line);
}
.cta .btn {
  width: 100%;
}
</style>
