import { COLS, ROWS } from './config'
import type { ActivePiece, Board, Pos } from './types'

export const DIRS: [number, number][] = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
]

export function createBoard(): Board {
  return Array.from({ length: ROWS }, () => Array<null>(COLS).fill(null))
}

export function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < ROWS && c >= 0 && c < COLS
}

export function blockPositions(piece: Pick<ActivePiece, 'r' | 'c' | 'blocks'>): Pos[] {
  return piece.blocks.map((b) => ({ r: piece.r + b.dr, c: piece.c + b.dc }))
}

/** A peça cabe nesta posição? */
export function fits(board: Board, piece: Pick<ActivePiece, 'r' | 'c' | 'blocks'>): boolean {
  return blockPositions(piece).every(({ r, c }) => inBounds(r, c) && board[r][c] === null)
}

/**
 * Gravidade por coluna: cada átomo cai até o primeiro apoio.
 * Retorna as novas posições dos átomos que se moveram (usadas como sementes de reações em cadeia).
 */
export function applyGravity(board: Board): Pos[] {
  const moved: Pos[] = []
  for (let c = 0; c < COLS; c++) {
    let write = ROWS - 1
    for (let r = ROWS - 1; r >= 0; r--) {
      const cell = board[r][c]
      if (!cell) continue
      if (write !== r) {
        board[write][c] = cell
        board[r][c] = null
        moved.push({ r: write, c })
      }
      write--
    }
  }
  return moved
}
