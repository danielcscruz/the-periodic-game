import { COLS, ROWS, SEARCH_BUDGET } from './config'
import { DIRS, inBounds } from './board'
import type { Board, Pos, Reaction, ReactionMatch } from './types'

const key = (r: number, c: number) => r * COLS + c

function reagentTotal(reagents: Record<string, number>): number {
  return Object.values(reagents).reduce((s, n) => s + n, 0)
}

/**
 * Procura um conjunto CONEXO de átomos que contenha exatamente os reagentes,
 * partindo de `start`. Cresce o conjunto apenas por vizinhos cujo elemento ainda é necessário,
 * então a busca é pequena (reações têm 2–7 átomos) e não depende do formato.
 */
function searchFrom(
  board: Board,
  start: Pos,
  reaction: Reaction,
  consumed: Set<number>,
): Pos[] | null {
  const startCell = board[start.r][start.c]
  if (!startCell || consumed.has(key(start.r, start.c))) return null

  const need: Record<string, number> = { ...reaction.reagents }
  if (!need[startCell.el]) return null
  need[startCell.el]--

  const total = reagentTotal(reaction.reagents)
  const chosen: Pos[] = [start]
  const chosenKeys = new Set<number>([key(start.r, start.c)])
  const seen = new Set<string>()
  let budget = SEARCH_BUDGET

  const fromSeveralMolecules = () => {
    const pieces = new Set(chosen.map(({ r, c }) => board[r][c]!.piece))
    return pieces.size >= 2
  }

  const dfs = (): boolean => {
    if (chosen.length === total) return fromSeveralMolecules()
    if (--budget < 0) return false

    const signature = [...chosenKeys].sort((a, b) => a - b).join(',')
    if (seen.has(signature)) return false
    seen.add(signature)

    for (let i = 0; i < chosen.length; i++) {
      const { r, c } = chosen[i]
      for (const [dr, dc] of DIRS) {
        const nr = r + dr
        const nc = c + dc
        if (!inBounds(nr, nc)) continue
        const k = key(nr, nc)
        if (chosenKeys.has(k) || consumed.has(k)) continue
        const cell = board[nr][nc]
        if (!cell || !need[cell.el]) continue

        need[cell.el]--
        chosen.push({ r: nr, c: nc })
        chosenKeys.add(k)
        if (dfs()) return true
        chosen.pop()
        chosenKeys.delete(k)
        need[cell.el]++
      }
    }
    return false
  }

  return dfs() ? [...chosen] : null
}

/**
 * Encontra todas as reações que envolvem pelo menos um átomo-semente
 * (a peça que acabou de assentar, ou átomos que caíram após uma reação).
 * Reações maiores têm prioridade; cada átomo participa de no máximo uma reação por etapa.
 */
export function findReactions(board: Board, seeds: Pos[], catalog: Reaction[]): ReactionMatch[] {
  const ordered = [...catalog].sort(
    (a, b) => reagentTotal(b.reagents) - reagentTotal(a.reagents),
  )
  const consumed = new Set<number>()
  const matches: ReactionMatch[] = []

  for (const reaction of ordered) {
    let found = true
    while (found) {
      found = false
      for (const seed of seeds) {
        const cells = searchFrom(board, seed, reaction, consumed)
        if (cells) {
          cells.forEach(({ r, c }) => consumed.add(key(r, c)))
          matches.push({ reaction, cells })
          found = true
          break
        }
      }
    }
  }
  return matches
}

/** Aplica o efeito da reação e devolve todas as posições que serão removidas. */
export function expandEffect(board: Board, match: ReactionMatch): Pos[] {
  const out = new Map<number, Pos>()
  const add = (r: number, c: number) => {
    if (inBounds(r, c) && board[r][c]) out.set(key(r, c), { r, c })
  }

  switch (match.reaction.effect) {
    case 'self':
      match.cells.forEach(({ r, c }) => add(r, c))
      break
    case 'blast':
      match.cells.forEach(({ r, c }) => {
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) add(r + dr, c + dc)
      })
      break
    case 'rows':
      new Set(match.cells.map((p) => p.r)).forEach((r) => {
        for (let c = 0; c < COLS; c++) add(r, c)
      })
      break
    case 'all':
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) add(r, c)
      break
  }
  return [...out.values()]
}
