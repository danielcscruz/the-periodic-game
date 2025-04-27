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
                            <div v-else class="cell-element"><span>{{ cell }}</span></div>
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
                            <div v-else class="cell-element">{{ cell }}</div>
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
</div>

</template>


<script setup lang="ts">
import { onMounted, onUnmounted, onBeforeUnmount } from 'vue'
import { useGameEngine } from '@/stores/engine'
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



    // Adiciona o evento de "keydown" ao montar o componente
document.addEventListener('keydown', handleKeyDown)

    // Limpa o evento ao desmontar o componente
onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyDown);
})

onUnmounted(() => {
    engine.stopGameLoop()
})

</script>

<style lang="css" scoped>
@import './styles.css';
</style>