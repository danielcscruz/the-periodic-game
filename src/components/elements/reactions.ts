const reactions = [
    { id: 1, reaction: 'Dissolução', points: 'atomic numbers of elements', distroy: 'own blocks',
        matrix: [
            ['O','H',0],
            ['H','Fe',0],
            [0,0,0],
        ]
    },  
    { id: 2, reaction: 'Formação de liga metálica', points: 'atomic numbers of elements', distroy: '--',
        matrix: [
            [0,0,0],
            ['Fe','Cu','Pt'],
            [0,0,0],
        ]
    },
    { id: 3, reaction: 'Explosão de polvora', points: 'atomic numbers of elements', distroy: 'lines of blocks',
        matrix: [
            [0,'O',0],
            ['K','N','C'],
            [0,0,0],
        ]
    },
    { id: 4, reaction: 'Bomba nuclear', points: 'atomic numbers of elements', distroy: 'all blocks',
        matrix: [
            [0,0,0],
            ['U','Be','Pu'],
            [0,0,0],
        ]
    },  

]

export interface ReactionItem {
    id: number,
    reaction: string,
    points: string,
    distroy: string,
    matrix: (number | string)[][]
}

export const reaction_items: ReactionItem[] = reactions.map(item => ({
    id: item.id,
    reaction: item.reaction,
    points: item.points,
    distroy: item.distroy,
    matrix: item.matrix,
}))

export default reaction_items