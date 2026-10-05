const formulas = [
    // Fórmulas 'A'
    { formula: 'He', weight: 3, display: 'gás hélio' },
    { formula: 'Au', weight: 1, display: 'ouro' },
    { formula: 'Pt', weight: 1, display: 'platina' },
    { formula: 'S', weight: 6, display: 'enxofre elementar' },
    { formula: 'P', weight: 5, display: 'fósforo' },

    // Fórmulas 'AA'
    { formula: 'HH', weight: 9, display: 'gás hidrogênio' },
    { formula: 'OO', weight: 10, display: 'gás oxigênio' },
    { formula: 'NN', weight: 8, display: 'gás nitrogênio' },

    // Fórmulas 'AB'
    { formula: 'OC', weight: 7, display: 'monóxido de carbono' },
    { formula: 'ON', weight: 7, display: 'óxido nítrico' },
    { formula: 'ClNa', weight: 6, display: 'cloreto de sódio' },
    { formula: 'KCl', weight: 6, display: 'cloreto de potássio' },
    { formula: 'FeO', weight: 7, display: 'óxido de ferro' },
    { formula: 'AlO', weight: 6, display: 'óxido de alumínio' },
    { formula: 'MgO', weight: 6, display: 'óxido de magnésio' },

    // Fórmulas 'ABA'
    { formula: 'OHH', weight: 9, display: 'água' },
    { formula: 'COO', weight: 7, display: 'dióxido de carbono' },
    { formula: 'SiOO', weight: 6, display: 'sílica' },
    { formula: 'NOO', weight: 7, display: 'dióxido de nitrogênio' },
    { formula: 'ONN', weight: 7, display: 'óxido nitroso' },
    { formula: 'SOO', weight: 6, display: 'dióxido de enxofre' },
    { formula: 'SHH', weight: 9, display: 'sulfeto de hidrogênio' },
    { formula: 'UOO', weight: 2, display: 'óxido de urânio' },
    { formula: 'PuOO', weight: 2, display: 'óxido de plutônio' },

    // Fórmulas 'AABAA'
    { formula: 'CHHHH', weight: 10, display: 'metano' },
]

export type ShapeCell = string | 0

interface ShapeChemino {
    matrix: ShapeCell[][]
}

export interface CheminoItem {
    formula: string
    shape: ShapeChemino
    weight: number
    display: string
}

/** Separa a fórmula em símbolos: 'ClNa' → ['Cl', 'Na']. */
export function formulaAtoms(formula: string): string[] {
    return formula.match(/[A-Z][a-z]?/g) || []
}

/** Primeiro átomo no centro, depois esquerda, topo, direita e base (formato de cruz). */
function formulaToMatrix(formula: string): ShapeChemino {
    const chars = formulaAtoms(formula)
    return {
        matrix: [
            [0, chars[2] || 0, 0],
            [chars[1] || 0, chars[0] || 0, chars[3] || 0],
            [0, chars[4] || 0, 0],
        ],
    }
}

/** Fórmula legível com subscritos: 'OHH' → 'H₂O'. */
const SUB = '₀₁₂₃₄₅₆₇₈₉'
const pretty: Record<string, string> = { OHH: 'H₂O', SHH: 'H₂S', ClNa: 'NaCl', OC: 'CO', ON: 'NO', ONN: 'N₂O' }
export function prettyFormula(formula: string): string {
    if (pretty[formula]) return pretty[formula]
    const counts = new Map<string, number>()
    formulaAtoms(formula).forEach((a) => counts.set(a, (counts.get(a) || 0) + 1))
    return [...counts]
        .map(([el, n]) => el + (n > 1 ? String(n).split('').map((d) => SUB[+d]).join('') : ''))
        .join('')
}

export const chemino_items: CheminoItem[] = formulas.map((item) => ({
    formula: item.formula,
    shape: formulaToMatrix(item.formula),
    weight: item.weight,
    display: item.display,
}))

export function randomChemino(): CheminoItem {
    const total = chemino_items.reduce((s, c) => s + c.weight, 0)
    let roll = Math.random() * total
    for (const item of chemino_items) {
        roll -= item.weight
        if (roll < 0) return item
    }
    return chemino_items[chemino_items.length - 1]
}

export default chemino_items
