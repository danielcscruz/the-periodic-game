import chemino_items from '@/components/elements/cheminos'
import type { CheminoItem } from '@/components/elements/cheminos'
import { defineStore } from 'pinia'

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

    for (let row = 0; row < gridA.length; row++) {
        for (let col = 0; col < gridA[row].length; col++) {
            const a = gridA[row][col];
            const b = gridB[row][col];
            const c = gridC[row]?.[col] ?? 0; // Se gridC não existir ou for vazio, considera 0

            if (a === 1) continue; // valor imutável

            if (b !== 0) {
                if (a !== 0 && a !== b) {
                    throw new Error(`Erro de adição: sobreposição diferente detectada em [${row}, ${col}]`);
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


export const useGameEngine = defineStore('engine', {
    state: () => {
        return {
            grid: JSON.parse(JSON.stringify(INITIAL_GRID)) as (number | string)[][],
            chemino_grid: JSON.parse(JSON.stringify(INITIAL_GRID)) as (number | string)[][],
            next_grid: JSON.parse(JSON.stringify(INITIAL_GRID)) as (number | string)[][],
            arena_grid: JSON.parse(JSON.stringify(INITIAL_GRID)) as (number | string)[][],
            next_chemino: chemino_items[0] as CheminoItem,
            is_next_locked: false,
            is_chemino_falling: false,
            is_game_over: false,
            prep_chemino: true,
            row_position: 0,
            score: 1,
            isRunning: true,
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
        stopGameLoop() {
            if (this.intervalId) {
                clearInterval(this.intervalId)
                this.intervalId = null
            }
            this.isRunning = false
        },

        setArenaGrid(){
            this.arena_grid = this.grid
        },
        checkOverflow(){

        },
        checkCollision() {
            for (let row = 24; row >= 3; row--) {
                for (let col = 0; col <= 20; col++) {
                    if (this.arena_grid[row][col] !== 1 && this.chemino_grid[row][col] !== 0) {
                        if (this.arena_grid[row + 1][col] !== 0) {
                            console.log('colisão');
                            console.log(this.arena_grid[row + 1][col])
                            this.is_chemino_falling = false
                            this.is_next_locked = false
                            // this.setArenaGrid()
                        }
                    }
                }
            }
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
            console.log('reiniciou Chemino grid')
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    this.chemino_grid[row][9 + col] = this.next_chemino.shape.matrix[row][col];
    
                }
            }
            this.row_position = 0
            this.is_chemino_falling = true
        },
        fallCheminoGrid(){
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
        updateGame() {
            //Game engine

            // this.nextChemino()
            
            if(!this.is_chemino_falling){
                this.setChemino()
                this.updateNext()
                this.setArenaGrid()
                
            }else{
                this.updateNext()
                this.fallCheminoGrid()
                this.setGrid()
                this.checkCollision()
            }
            this.setGrid()

            this.score = this.score +1

        },
        moveLeftChemino(){
            for(let col=0; col<=21; col++){
                for(let row=0; row<=24;row++){
                    if(typeof this.chemino_grid[row][col] === 'string'){
                        this.chemino_grid[row][col-1] = this.chemino_grid[row][col]
                        this.chemino_grid[row][col] = 0
                }
                }
            }
        },
        moveRightChemino(){
            for(let col=21; col>=0; col--){
                for(let row=0; row<=24;row++){
                    if(typeof this.chemino_grid[row][col] === 'string'){
                        this.chemino_grid[row][col+1] = this.chemino_grid[row][col]
                        this.chemino_grid[row][col] = 0
                }
                }
            }
        },
        rotateChemino() {
            // Copia uma área 3x3 onde está o chemino
            const tempMatrix: (number | string)[][] = [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ];
        
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    tempMatrix[row][col] = this.chemino_grid[this.row_position + row]?.[9 + col] ?? 0;
                }
            }
        
            // Função para rotacionar uma matriz 3x3 90 graus sentido horário
            const rotatedMatrix = tempMatrix[0].map((_, index) => 
                tempMatrix.map(row => row[index]).reverse()
            );
        
            // Antes de aplicar, você pode validar colisão ou borda aqui se quiser
        
            // Limpa a área antiga
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (typeof this.chemino_grid[this.row_position + row]?.[9 + col] === 'string') {
                        this.chemino_grid[this.row_position + row][9 + col] = 0;
                    }
                }
            }
        
            // Aplica a matriz rotacionada
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (rotatedMatrix[row][col] !== 0) {
                        this.chemino_grid[this.row_position + row][9 + col] = rotatedMatrix[row][col];
                    }
                }
            }
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
        toggle() {
            this.is_next_locked = !this.is_next_locked;
        },
        }
})