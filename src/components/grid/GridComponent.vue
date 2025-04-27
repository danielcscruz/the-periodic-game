<template>
<div class="periodic-container">
    <div class="grid-wrapper">
        <div class="scoreboard">{{ engine.score }}</div>
            <table>
                <tbody>
                    <tr v-for="(row, rowIndex) in engine.grid" :key="rowIndex">
                        <td v-for="(cell, cellIndex) in row" :key="cellIndex"
                :class="[rowIndex < 4 ? 'cell-next' : 'cell']">                        
                            <div v-if="cell == 0" class="cell-blank"></div>
                            <div v-else-if="cell == 1" class="cell-x"></div>
                            <div v-else :class="getClassForCell(cell)" class="cell-element"><span>{{ cell }}</span></div>
                        </td>
                    </tr>
                </tbody>
            </table>
    </div>
            <div class="next-wrapper" @click="lockNext">
                <div class="next-locked">
                    <table>
                        <tbody>
                            <tr v-for="(row, rowIndex) in engine.next_chemino.shape.matrix" :key="rowIndex">
                                <td v-for="(cell, cellIndex) in row" :key="cellIndex"
                        class="cell-next">                        
                                    <div v-if="cell == 0" class="cell-blank"></div>
                                    <div v-else-if="cell == 1" class="cell-x"></div>
                                    <div v-else :class="getClassForCell(cell)" class="cell-element">{{ cell }}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h4 v-if="engine.is_next_locked">locked!</h4>
                </div>
            </div>
        
        <div class="controls">
                <div class="control-rotate" @click="rotateChemino"></div>
                <div class="control-bottom">
                    <div class="control-left" @click="moveLeft"></div>
                    <div class="control-down" @click="moveDown"></div>
                    <div class="control-right" @click="moveRight"></div>
                </div>
            </div>
            
            <div v-if="engine.is_game_over" class="game-over">
                <div class="game-over-wrapper">
                    <h3>Game Over</h3>
                    <h4>Seu score</h4>
                    <h4>{{ engine. score }}</h4>
                    <button @click="startNewGame">Reiniciar</button>
                </div>
            </div>
        
</div>

</template>


<script setup lang="ts">
import { onMounted, onUnmounted, onBeforeUnmount } from 'vue'
import { useGameEngine } from '@/stores/engine'
import { classDictionary } from './classDictionary'; // Importando o dicionário

const engine = useGameEngine()

onMounted(() => {
    engine.startGameLoop()
})

const handleKeyDown = (event: KeyboardEvent) => {
    switch(event.code) {
        case 'Space':
            engine.toggle();
            break;
        case 'ArrowUp':
            engine.rotateChemino();
            break;
        case 'ArrowLeft':
            engine.moveLeftChemino();
            break;
        case 'ArrowRight':
            engine.moveRightChemino();
            break;
        case 'ArrowDown':
            engine.dropChemino();
            break;
    }
}

const moveLeft = () => {
    engine.moveLeftChemino();
}

const moveRight = () => {
    engine.moveRightChemino();
}

const moveDown = () => {
    engine.dropChemino();
}

const lockNext = () => {
    engine.toggle();
}

const rotateChemino = () => {
    engine.rotateChemino();
}

const startNewGame = () => {
    engine.startNewGame();
}



    // Adiciona o evento de "keydown" ao montar o componente
document.addEventListener('keydown', handleKeyDown)

    // Limpa o evento ao desmontar o componente
onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyDown);
})

onUnmounted(() => {
    engine.stopGameLoop()
})

const getClassForCell = (cell: string| number) => {
    const cellKey = cell.toString(); // Converte o valor para string
    return classDictionary[cellKey] || 'undefined'; // Classe padrão caso não haja correspondência
};


</script>

<style lang="css" scoped>
@import './styles.css';
</style>