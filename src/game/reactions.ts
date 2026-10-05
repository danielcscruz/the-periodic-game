import type { Reaction, ReactionEffect } from './types'

/**
 * Catálogo de reações. Cada reação lista os ÁTOMOS que precisam estar conectados
 * (vizinhança ortogonal), em qualquer formato, vindos de pelo menos duas moléculas diferentes.
 * Todas são alcançáveis com as peças de `cheminos.ts`.
 */
export const reactions: Reaction[] = [
  {
    id: 'nuclear',
    name: 'Reação em cadeia nuclear',
    equation: 'U + Pu → energia',
    reagents: { U: 1, Pu: 1 },
    effect: 'all',
  },
  {
    id: 'gunpowder',
    name: 'Explosão de pólvora',
    equation: '2KNO₃ + S + 3C → K₂S + N₂ + 3CO₂',
    reagents: { K: 1, N: 1, O: 1, C: 1, S: 1 },
    effect: 'rows',
  },
  {
    id: 'thermite',
    name: 'Termita',
    equation: 'Fe₂O₃ + 2Al → Al₂O₃ + 2Fe',
    reagents: { Fe: 1, Al: 1, O: 2 },
    effect: 'blast',
  },
  {
    id: 'methane',
    name: 'Combustão do metano',
    equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
    reagents: { C: 1, H: 4, O: 2 },
    effect: 'blast',
  },
  {
    id: 'acid-rain',
    name: 'Chuva ácida',
    equation: 'SO₂ + H₂O → H₂SO₃',
    reagents: { S: 1, O: 3, H: 2 },
    effect: 'rows',
  },
  {
    id: 'rust',
    name: 'Ferrugem',
    equation: '4FeO + O₂ → 2Fe₂O₃',
    reagents: { Fe: 1, O: 3 },
    effect: 'self',
  },
  {
    id: 'white-gold',
    name: 'Liga de ouro branco',
    equation: 'Au + Pt → liga metálica',
    reagents: { Au: 1, Pt: 1 },
    effect: 'self',
  },
  {
    id: 'water',
    name: 'Síntese da água',
    equation: '2H₂ + O₂ → 2H₂O',
    reagents: { H: 2, O: 2 },
    effect: 'self',
  },
  {
    id: 'nitric-oxide',
    name: 'Formação de óxido nítrico',
    equation: 'N₂ + O₂ → 2NO',
    reagents: { N: 2, O: 2 },
    effect: 'self',
  },
  {
    id: 'sulfur-burn',
    name: 'Queima do enxofre',
    equation: 'S + O₂ → SO₂',
    reagents: { S: 1, O: 2 },
    effect: 'self',
  },
]

export const effectLabel: Record<ReactionEffect, string> = {
  self: 'Consome os reagentes',
  blast: 'Explode os blocos ao redor',
  rows: 'Limpa as linhas atingidas',
  all: 'Limpa o tabuleiro inteiro',
}

export const effectMultiplier: Record<ReactionEffect, number> = {
  self: 1,
  blast: 1.5,
  rows: 2,
  all: 3,
}

/** Expande um mapa de reagentes em lista de símbolos: { H: 2, O: 1 } → ['H', 'H', 'O']. */
export function reagentList(reagents: Record<string, number>): string[] {
  return Object.entries(reagents).flatMap(([el, n]) => Array<string>(n).fill(el))
}

export default reactions
