import type { CheminoItem } from '@/components/elements/cheminos'
import type { PieceBlock } from './types'

/** Converte a matriz 3×3 em blocos com deslocamento relativo ao centro. */
export function blocksFromChemino(item: CheminoItem, nextId: () => number): PieceBlock[] {
  const blocks: PieceBlock[] = []
  item.shape.matrix.forEach((row, r) =>
    row.forEach((el, c) => {
      if (el) blocks.push({ id: nextId(), el, dr: r - 1, dc: c - 1 })
    }),
  )
  return blocks
}

/** Rotação horária em torno do centro: (dr, dc) → (dc, −dr). */
export function rotateBlocks(blocks: PieceBlock[]): PieceBlock[] {
  return blocks.map((b) => ({ ...b, dr: b.dc, dc: -b.dr }))
}

/** Tentativas de encaixe ao girar perto de paredes ou blocos (wall kicks simples). */
export const KICKS: [number, number][] = [
  [0, 0],
  [0, -1],
  [0, 1],
  [-1, 0],
  [0, -2],
  [0, 2],
]
