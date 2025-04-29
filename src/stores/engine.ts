import chemino_items from '@/components/elements/cheminos'
import type { CheminoItem } from '@/components/elements/cheminos'
import { defineStore } from 'pinia'
import { checkNeighbors } from '@/utils/checkNeighbors'
import { scoreAtomicNumbers } from '@/utils/scoreAtomicNumber'
import reaction_items, { type ReactionItem } from '@/components/elements/reactions'

//25x21
const INITIAL_GRID = [
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
]
function addGrids(
    gridA: (number | string)[][], 
    gridB: (number | string)[][], 
    gridC: (number | string)[][] = [] // Argumento opcional
): (number | string)[][] {
    const result = JSON.parse(JSON.stringify(gridA)) as (number | string)[][];
    const engine = useGameEngine()
    for (let row = 0; row < gridA.length; row++) {
        for (let col = 0; col < gridA[row].length; col++) {
            const a = gridA[row][col];
            const b = gridB[row][col];
            const c = gridC[row]?.[col] ?? 0; // Se gridC não existir ou for vazio, considera 0

            if (a === 1) continue; // valor imutável

            if (b !== 0) {
                if (a !== 0 && a !== b) {
                    engine.is_game_over = true
                    throw new Error(`Game Over`);
                }
                result[row][col] = b;
            }

            if (c !== 0) {
                const current = result[row][col];
                if (current !== 0 && current !== c) {
                    throw new Error(`Erro de adição: sobreposição diferente detectada em [${row}, ${col}]`);
                }
                result[row][col] = c;
            }
        }
    }
    return result;
}

export interface NeighborsItem {
    element: string | number; x: number; y: number; neighbors: { x: number; y: number; value: string | number; }[]; }


export const useGameEngine = defineStore('engine', {
    state: () => {
        return {
            grid: JSON.parse(JSON.stringify(INITIAL_GRID)) as (number | string)[][],
            chemino_grid: JSON.parse(JSON.stringify(INITIAL_GRID)) as (number | string)[][],
            next_grid: JSON.parse(JSON.stringify(INITIAL_GRID)) as (number | string)[][],
            arena_grid: JSON.parse(JSON.stringify(INITIAL_GRID)) as (number | string)[][],
            next_chemino: chemino_items[0] as CheminoItem,
            chemino: chemino_items[0] as CheminoItem,
            reaction: reaction_items[0] as ReactionItem,
            is_next_locked: false,
            is_chemino_falling: false,
            is_welcome: true,
            is_game_over: false,
            chemino_neighbors: [] as NeighborsItem[],
            row_position: 0,
            col_position: 0,
            score: 0,
            isRunning: false,
            intervalId: null as null | number,
            gameSpeed: 500, // in ms

        }
    },
    actions: {
        startGameLoop() {
            if (this.intervalId) return // already running
            // this.setSelectedPosition()
            this.isRunning = true
            this.intervalId = setInterval(() => {
                if (!this.isRunning) return
                this.updateGame()
            }, this.gameSpeed)

        },
        startNewGame(){
            this.grid = JSON.parse(JSON.stringify(INITIAL_GRID)) 
            this.chemino_grid = JSON.parse(JSON.stringify(INITIAL_GRID)) 
            this.next_grid = JSON.parse(JSON.stringify(INITIAL_GRID)) 
            this.arena_grid = JSON.parse(JSON.stringify(INITIAL_GRID)) 
            this.next_chemino = chemino_items[0]
            this.is_next_locked = false
            this.is_chemino_falling = false
            this.is_game_over = false
            this.row_position = 0
            this.col_position = 0
            this.is_welcome = false
            this.score = 0
            this.startGameLoop()

        },
        stopGameLoop() {
            if (this.intervalId) {
                clearInterval(this.intervalId)
                this.intervalId = null
            }
            this.isRunning = false
        },
        pauseGameLoop() {
            if (this.intervalId) {
                clearInterval(this.intervalId)
                this.intervalId = null
            }
        }, 
        resumeGameLoop() {
            if (!this.intervalId) {
                this.intervalId = setInterval(() => {
                    if (!this.isRunning) return
                    this.updateGame()
                }, this.gameSpeed)
            }
        },
        setArenaGrid(){
            this.arena_grid = this.grid
        },
        canMoveDown() {
            for (let row = 24; row >= 0; row--) {
                for (let col = 0; col <= 20; col++) {
                    if (typeof this.chemino_grid[row][col] === 'string') {
                        // Checa se abaixo está ocupado
                        if (row + 1 > 24 || this.arena_grid[row + 1][col] !== 0) {
                            return false
                        }
                    }
                }
            }
            return true
        },
        canMoveSide(direction: 'left' | 'right') {
            const delta = direction === 'left' ? -1 : 1
        
            for (let row = 0; row <= 24; row++) {
                for (let col = 0; col <= 20; col++) {
                    if (typeof this.chemino_grid[row][col] === 'string') {
                        const newCol = col + delta
        
                        // Se passar da borda ou colidir com algo na arena
                        if (newCol < 0 || newCol > 20 || this.arena_grid[row][newCol] !== 0) {
                            return false
                        }
                    }
                }
            }
            return true
        },
        updateNext(){
            if(!this.is_next_locked) {
                this.next_chemino =  this.getRandomItem()
            }
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    this.next_grid[row][9 + col] = this.next_chemino.shape.matrix[row][col];
    
                }
            }
        },

        setChemino(){
            this.chemino_grid= JSON.parse(JSON.stringify(INITIAL_GRID))
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    this.chemino_grid[row][9 + col] = this.next_chemino.shape.matrix[row][col];
    
                }
            }
            this.col_position = 0
            this.row_position = 0
            this.is_chemino_falling = true
        },
        moveDownChemino(){
            this.row_position = this.row_position + 1
            for (let row=24; row>=0; row--){
                for(let col=0; col<=21;col++){
                    if(typeof this.chemino_grid[row][col] === 'string'){
                        this.chemino_grid[row+1][col] = this.chemino_grid[row][col]
                        this.chemino_grid[row][col] = 0
                    }
                }
            }
        },
        setGrid(){
            
            this.grid = addGrids(this.arena_grid, this.chemino_grid)

        },
        setScore(){
            this.score = this.score 
            console.log('check neighbors')
            const chemino_neighbors = checkNeighbors(this.grid, this.chemino_grid, this.row_position, this.col_position)
            
            this.score = this.score + scoreAtomicNumbers(chemino_neighbors)
            
        },
        updateGame() {

            if (!this.is_chemino_falling) {
                this.setChemino()
                this.updateNext()
                this.setArenaGrid()

            } else {
                if (this.canMoveDown()) {
                    this.moveDownChemino()
                    this.updateNext()

                } else {
                    this.is_chemino_falling = false
                    this.is_next_locked = false
                    this.setArenaGrid()
                    console.log('score #1')
                    this.setScore()

                }
            }

            this.setGrid()


        },
        moveLeftChemino() {
            if (!this.canMoveSide('left')) return
                this.col_position = this.col_position - 1
                for (let row = 0; row <= 24; row++) {
                    for (let col = 0; col <= 20; col++) {
                        if (typeof this.chemino_grid[row][col] === 'string') {
                            // Move para a esquerda
                            this.chemino_grid[row][col - 1] = this.chemino_grid[row][col]
                            this.chemino_grid[row][col] = 0
                        }
                    }
                }
        
        },
        moveRightChemino() {
            if (!this.canMoveSide('right')) return
                this.col_position = this.col_position + 1
                for (let row = 24; row >= 0; row--) {
                    for (let col = 20; col >= 0; col--) {
                        if (typeof this.chemino_grid[row][col] === 'string') {
                            // Move para a direita
                            this.chemino_grid[row][col + 1] = this.chemino_grid[row][col]
                            this.chemino_grid[row][col] = 0
                        }
                    }
                }
            
        },
        async dropChemino() {        
            // Enquanto puder mover para baixo, move
            while (this.canMoveDown()) {
                this.moveDownChemino()
                this.setGrid()
                await new Promise(resolve => setTimeout(resolve, 30))
            }
            // this.is_chemino_falling = false
            // this.is_next_locked = false
            // // Agora que ele não pode mais descer, você:
            // this.setArenaGrid()    // <-- fixa o chemino na arena na posição FINAL
            // this.setChemino() // <-- gera um novo chemino
            // this.setGrid()          // <-- atualiza o grid para refletir
        },
        
        rotateChemino() {
            this.pauseGameLoop()

            // 1. Extrair a peça atual (3x3) da chemino_grid

            // 1. Extrair a peça atual (3x3) da chemino_grid, considerando a posição atual (row_position, col_position)
    const piece: (number | string)[][] = [];

    for (let row = 0; row < 3; row++) {
        const pieceRow: (number | string)[] = [];
        for (let col = 0; col < 3; col++) {
            // Calcular a posição no grid
            const gridRow = this.row_position + row ;
            const gridCol = this.col_position + col + 9 ;

            // Verificar se a célula está dentro dos limites do grid
            if (gridRow >= 0 && gridRow < this.chemino_grid.length && gridCol >= 0 && gridCol < this.chemino_grid[0].length) {
                pieceRow.push(this.chemino_grid[gridRow][gridCol]);
            } else {
                pieceRow.push(0);  // Preencher com 0 se o índice estiver fora do limite
            }
        }
        piece.push(pieceRow);
    }

        
            // 2. Rotacionar a peça 90 graus para a direita em torno da célula central (1,1)
            const rotatedPiece: (number | string)[][] = [];
            for (let col = 0; col < 3; col++) {
                const newRow: (number | string)[] = [];
                for (let row = 2; row >= 0; row--) {
                    newRow.push(piece[row][col]);
                }
                rotatedPiece.push(newRow);
            }
        

            // 3. Verificar se a rotação é válida: a peça rotacionada pode não ultrapassar os limites do grid ou colidir com outra peça
            let canRotate = true;
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    const newRow = row + this.row_position;
                    const newCol = col + this.col_position + 9;
                    if (rotatedPiece[row][col] !== 0) {
                        if (newRow < 0 || newRow >= 25 || newCol < 0 || newCol >= 21 || this.arena_grid[newRow][newCol] !== 0) {
                            canRotate = false;
                            break;
                        }
                    }
                }
            }    
            // 4. Se a rotação for válida, aplicar a rotação
            if (canRotate) {
                for (let row = 0; row < 3; row++) {
                    for (let col = 0; col < 3; col++) {
                        const newRow = row + this.row_position;
                        const newCol = col + this.col_position + 9;
                        if (rotatedPiece[row][col] !== 0) {
                            this.chemino_grid[newRow][newCol] = rotatedPiece[row][col];
                        } else {
                            this.chemino_grid[newRow][newCol] = 0;
                        }
                    }
                }
            } else {
            }
                        this.resumeGameLoop()

        },
        
        getRandomItem(): CheminoItem {
            const totalWeight = chemino_items.reduce((sum, chemino) => sum + chemino.weight, 0);
            const random = Math.random() * totalWeight;

            let cumulative = 0;
            for (const chemino of chemino_items) {
                cumulative += chemino.weight;
                if (random < cumulative) {
                    return chemino;
                }
            }
            // fallback de segurança
            return chemino_items[chemino_items.length - 1];
        },
        getNextChemino(): CheminoItem {
            const currentIndex = chemino_items.findIndex(item => item.formula === this.chemino.formula);
        
            // Verifica se encontrou e avança para o próximo
            const nextIndex = (currentIndex + 1) % chemino_items.length; // Faz o loop voltar para o começo se for o último
        
            this.chemino = chemino_items[nextIndex];
            return this.chemino;
        },
        getPrevChemino(): CheminoItem {
            const currentIndex = chemino_items.findIndex(item => item.formula === this.chemino.formula);
            const prevIndex = (currentIndex - 1 + chemino_items.length) % chemino_items.length;
        
            this.chemino = chemino_items[prevIndex];
            return this.chemino;
        },
        getNextReaction(): ReactionItem {
            console.log('next reaction ')
            const currentIndex = reaction_items.findIndex(item => item.id === this.reaction.id);
        
            // Verifica se encontrou e avança para o próximo
            const nextIndex = (currentIndex + 1) % reaction_items.length; // Faz o loop voltar para o começo se for o último
        
            this.reaction = reaction_items[nextIndex];
            return this.reaction;
        },
        getPrevReaction(): ReactionItem {
            console.log('prev reaction')
            const currentIndex = reaction_items.findIndex(item => item.id === this.reaction.id);
            const prevIndex = (currentIndex - 1 + reaction_items.length) % reaction_items.length;
        
            this.reaction = reaction_items[prevIndex];
            return this.reaction;
        },
        
        toggle() {
            this.is_next_locked = !this.is_next_locked;
        },
        }
})