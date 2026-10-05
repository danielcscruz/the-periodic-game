export interface Pos {
  r: number
  c: number
}

/** Um átomo assentado no tabuleiro. `id` é estável para permitir animações; `piece` identifica a molécula de origem. */
export interface Cell {
  id: number
  el: string
  piece: number
}

export type Board = (Cell | null)[][]

/** Bloco da peça ativa, com deslocamento relativo ao centro da cruz 3×3. */
export interface PieceBlock {
  id: number
  el: string
  dr: number
  dc: number
}

export interface ActivePiece {
  formula: string
  pieceId: number
  r: number
  c: number
  blocks: PieceBlock[]
}

export type ReactionEffect = 'self' | 'blast' | 'rows' | 'all'

export interface Reaction {
  id: string
  name: string
  equation: string
  /** Átomos necessários, conectados em qualquer formato. */
  reagents: Record<string, number>
  effect: ReactionEffect
}

export interface ReactionMatch {
  reaction: Reaction
  cells: Pos[]
}
