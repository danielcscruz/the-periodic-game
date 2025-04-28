const formulas = [
    //Formulas 'A'
    { formula: 'He', weight: 3,display: 'gás helio'},      // Hélio é raro, peso reduzido
    { formula: 'Au', weight: 1,display: 'ouro' },      // Ouro é muito raro
    { formula: 'Pt', weight: 1,display: 'platina' },      // Platina também é muito rara
    { formula: 'S', weight: 6 ,display: 'enxofre elementar'},       // Enxofre é mais abundante, mas não tanto quanto o oxigênio
    { formula: 'P', weight: 5 ,display: 'fosforo'},       // Fósforo é mais raro, mas ainda assim importante para a vida

    // Formulas 'AA' (elementos comuns)
    { formula: 'HH', weight: 9 , display: 'gás hidrogênio'},      // Hidrogênio é muito abundante, peso mais alto
    { formula: 'OO', weight: 10, display: 'gás oxigênio' },     // Oxigênio é o mais abundante, peso mais alto
    { formula: 'NN', weight: 8 , display: 'gás nitrogênio'},      // Nitrogênio é abundante, mas um pouco menos que oxigênio

    // Formulas 'AB' (combinados com oxigênio)
    { formula: 'OC', weight: 7 ,display: 'monóxido de carbono'},      // Combinado com oxigênio, relativamente comum
    { formula: 'ON', weight: 7 ,display: 'óxido nitrico'},      // Combinado com oxigênio, relativamente comum
    { formula: 'ClNa', weight: 6 ,display: 'cloreto de sódio' },    // Sódio e cloro são relativamente comuns, mas não tanto quanto oxigênio
    { formula: 'KCl', weight: 6,display: 'cloreto de potássio' },     // Potássio e cloro, comuns, mas menos abundantes
    { formula: 'FeO', weight: 7,display: 'óxido de ferro' },     // Ferro e oxigênio, bastante comuns
    { formula: 'AlO', weight: 6,display: 'óxido de aluminio' },     // Alumínio e oxigênio, abundantes
    { formula: 'MgO', weight: 6,display: 'óxido de magnésio' },     // Magnésio e oxigênio, relativamente comuns

    // Formulas 'ABA' (compostos mais complexos)
    { formula: 'OHH', weight: 9 , display: 'água' },     // Hidrogênio e oxigênio (água), muito comum
    { formula: 'COO', weight: 7 , display: 'dióxido de carbono'},     // Carbono e oxigênio (CO2), importante e comum
    { formula: 'SiOO', weight: 6, display: 'sílica' },    // Silício e oxigênio (SiO2, sílica), muito comum
    { formula: 'NOO', weight: 7 , display: 'dióxido de nitrogênio' },     // Nitrogênio e oxigênio (NO2), comum
    { formula: 'ONN', weight: 7 , display: 'óxido nitroso' },     // Nitrogênio e oxigênio, comum
    { formula: 'SOO', weight: 6 , display: 'dióxido de enxofre'},     // Enxofre e oxigênio, comum
    { formula: 'SHH', weight: 9 , display: 'sulfeto de hidrogênio'},     // Enxofre e hidrogênio, importante e comum
    { formula: 'UOO', weight: 2 , display: 'óxido de urânio'},     // Urânio é muito raro, peso baixo
    { formula: 'PuOO', weight: 2, display: 'óxido de plutônio' },    // Plutônio também é muito raro, peso baixo
    //Formulas 'AABAA'
    { formula: 'CHHHH', weight: 10, display: 'metano' },
]

interface ShapeChemino {
    matrix: (number | string)[][];
}

export interface CheminoItem {
    formula: string,
    shape: ShapeChemino,
    weight: number,
    display: string,
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
    display: item.display,
}))

export default chemino_items