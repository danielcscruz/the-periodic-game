<script setup lang="ts">
import { useGameEngine } from '@/stores/engine'
import { elementDictionary } from '@/components/elements/periodic'

const engine = useGameEngine()

const prevChemino = () => {
    engine.getPrevChemino();
}
const nextChemino = () => {
    engine.getNextChemino();
}
const prevReaction = () => {
    engine.getPrevReaction();
}
const nextReaction = () => {
    engine.getNextReaction();
}
const startNewGame = () => {
    engine.startNewGame();
}

const getClassForCell = (cell: string| number) => {
    const cellKey = cell.toString(); // Converte o valor para string
    return elementDictionary[cellKey].class || 'undefined'
};
</script>

<template>
    <div class="welcome-wrapper">
                        <h1 class="title">Periodic Tetris</h1>
                    <div class="wrapper">
                        <div class="display">
                            <h2 class="sub-title">Cheminos</h2>
                            <div class="chemino-display">
                                <button class="prev-next" @click="prevChemino">&lt;</button>
                                <table>
                                    <tbody>
                                        <tr v-for="(row, rowIndex) in engine.chemino.shape.matrix" :key="rowIndex">
                                            <td v-for="(cell, cellIndex) in row" :key="cellIndex" class='cell'>                        
                                                <div v-if="cell == 0" class="cell-blank display-blank"></div>
                                                <div v-else-if="cell == 1" class="cell-x"></div>
                                                <div v-else :class="getClassForCell(cell)" class="cell-element cell-element-display"><span>{{ cell }}</span></div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button class="prev-next" @click="nextChemino">></button>
                            </div>
                            <span class="display-span">{{  engine.chemino.display }}</span>
                        </div>
                    </div>
                    <div class="wrapper">
                        <div class="display">
                            <h2 class="sub-title">Reações</h2>
                            <div class="chemino-display">
                                <button class="prev-next" @click="prevReaction">&lt;</button>
                                <table>
                                    <tbody>
                                        <tr v-for="(row, rowIndex) in engine.reaction.matrix" :key="rowIndex">
                                            <td v-for="(cell, cellIndex) in row" :key="cellIndex" class='cell'>                        
                                                <div v-if="cell == 0" class="cell-blank display-blank"></div>
                                                <div v-else-if="cell == 1" class="cell-x"></div>
                                                <div v-else :class="getClassForCell(cell)" class="cell-element cell-element-display"><span>{{ cell }}</span></div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button class="prev-next" @click="nextReaction">></button>
                            </div>
                            <span class="display-span">{{  engine.reaction.reaction }}</span>
                        </div>
                    </div>
                    <button  @click="startNewGame">Iniciar</button>
    </div>
</template>

<style lang="css" scoped>
@import '../grid/styles.css';
body {
  user-select: none;
}
tr{
    display: flex;
    justify-content: center;
}
td{
    height: 30px;
    width: 30px;
    margin: 2px;

}
.wrapper{
    display: flex;
    justify-content: center;
}
.display{
    display: flex;
    flex-direction: column;
    background-color: rgb(31, 28, 49);
    border: 1px solid rgb(194, 191, 191);
    margin-top: 20px;

}
.display-span{
    font-family: Tiny5;
    color: rgb(194, 191, 191);
    font-size: 20px;

}

.chemino-display{
    height: 150px;
    width: 300px;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    align-items: center;

    
}

.cell-element-display{
    height: 30px;
    width: 30px;
    color: rgb(194, 191, 191);
}
.table{
    border: 1px solid white;
}
h6{
    font-family: Tiny5;
    font-size: 20px;
    font-weight: 800;
    text-align: center;
    line-height: 22px;

    
}


h2{
    font-family: Tiny5;
    font-size: 30px;
    font-weight: 800;
    text-align: center;
    color: black;

}

button{
    background-color: rgba(51, 50, 50, 0.8);
    border: 1px dotted rgb(194, 191, 191);
    color: rgb(194, 191, 191);
    font-family: Tiny5;
    font-size: 20px;
    padding: 12px;
    margin: 20px;
    cursor: pointer;
}

button:hover{
    background-color: rgb(194, 191, 191);
    border: 1px dotted rgba(51, 50, 50, 0.8);
    color: rgba(51, 50, 50, 0.8);
}

.prev-next{
    display: flex;
    margin: 0 auto;
    text-align: center;
    justify-content: center;
    align-items: center;
    text-justify: center;
    height: 30px;
    width: 30px;
}
.title{
    font-family: Tiny5;
    font-size: 70px;
    font-weight: 800;
    text-align: center;
    color: rgb(194, 191, 191);
}
.sub-title{
    color: rgb(194, 191, 191);

}
</style>