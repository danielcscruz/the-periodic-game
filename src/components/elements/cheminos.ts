const formulas = [
    //Formulas 'A'
    // { formula: 'He', weight: 9 },
    //Formulas 'AA'
    { formula: 'HH', weight: 5 },
    { formula: 'OO', weight: 5 },
    { formula: 'NN', weight: 5 },
    //Formulas 'AB'
    { formula: 'OC', weight: 5 },
    { formula: 'ON', weight: 5 },
    { formula: 'NaCl', weight: 5 },
    { formula: 'KCl', weight: 5 },
    { formula: 'OC', weight: 5 },
    //Formulas 'ABA'
    { formula: 'OHH', weight: 2 },
    { formula: 'COO', weight: 2 },
    { formula: 'SiOO', weight: 2 },
    { formula: 'NOO', weight: 2 },
    { formula: 'ONN', weight: 2 },
    { formula: 'SOO', weight: 2 },
    { formula: 'SHH', weight: 2 },
    { formula: 'UOO', weight: 2 },
    { formula: 'PuOO', weight: 2 },
    //Formulas 'AABAA'
    // { formula: 'CHHHH', weight: 10 },
]

interface ShapeChemino {
    matrix: (number | string)[][];
}

export interface CheminoItem {
    formula: string,
    shape: ShapeChemino,
    weight: number
}

function formulaToMatrix(formula: string): ShapeChemino {
    const chars = formula.match(/[A-Z][a-z]?/g) || [];
    const matrix: ShapeChemino = {
        matrix: [
            [0, chars[2] || 0, 0],
            [chars[1] || 0, chars[0] || 0, chars[3] || 0],
            [0, chars[4] || 0, 0],
        ]
    };
    return matrix;
    }


export const chemino_items: CheminoItem[] = formulas.map(item => ({
    formula: item.formula,
    shape: formulaToMatrix(item.formula),
    weight: item.weight,
}))

export default chemino_items