# Periodic Tetris

Tetris químico em Vue 3 + Pinia. Cada peça é uma molécula; quando os reagentes de uma
reação catalogada ficam conectados (vizinhança ortogonal, em qualquer formato) e vêm de
pelo menos duas moléculas diferentes, eles reagem e saem do tabuleiro.

## Estrutura

- `src/game/` — regras puras, sem Vue (testáveis isoladamente)
  - `config.ts` tamanho do tabuleiro e tempos
  - `reactions.ts` catálogo de reações (reagentes + efeito)
  - `reactionEngine.ts` detecção de reações e efeitos
  - `board.ts`, `pieces.ts` colisão, gravidade e rotação
- `src/stores/engine.ts` — estado e loop do jogo (máquina de estados)
- `src/components/game/` — interface mobile first

## Adicionando uma reação

Em `src/game/reactions.ts`, liste os átomos necessários e o efeito
(`self`, `blast`, `rows` ou `all`). Confira se todos os átomos aparecem em alguma peça
de `src/components/elements/cheminos.ts`.

## Controles

Toque: arraste para mover, toque para girar, deslize para baixo para derrubar, toque na
próxima peça para travá-la. Teclado: ← → movem, ↑ gira, ↓ derruba, Shift acelera,
espaço trava a próxima peça, P pausa, R recomeça.

## Rodando

```sh
npm install
npm run dev
npm run build
```
