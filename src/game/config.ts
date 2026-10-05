/** Dimensões do tabuleiro jogável (as paredes são desenhadas via CSS). */
export const COLS = 11
export const ROWS = 18

/** Tempos em milissegundos. */
export const BASE_GRAVITY_MS = 700
export const MIN_GRAVITY_MS = 140
export const GRAVITY_STEP_MS = 55
export const SOFT_DROP_MS = 40
export const ROULETTE_MS = 450
export const REACTION_FLASH_MS = 560
export const COLLAPSE_MS = 220
export const REACTIONS_PER_LEVEL = 6

/** Limite de estados explorados por busca, para evitar travamentos em tabuleiros cheios. */
export const SEARCH_BUDGET = 5000
