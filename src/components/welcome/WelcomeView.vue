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
/* @import '../grid/styles.css'; */
body {
  user-select: none;
}
.welcome-wrapper{
    display: flex;
    flex-direction: column;
    max-width: 80%;
}
tr{
    display: flex;
    justify-content: center;
}
td{

}
.cell{
    /* border: 1px solid white; */
    width: var(--cell-width);
    height: var(--cell-height);
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    position: relative;
    font-family: Tiny5;
    color: rgb(194, 191, 191);
    height: 30px;
    width: 30px;

}
.cell-element-display{
    height: 100%;
    width: 100%;
}
table{
    /* border: 1px solid white; */
    border-collapse: collapse;
    table-layout: fixed; /* <--- muito importante! */
    width: 100%;
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
    height: 180px;

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
    padding: 8px;
    margin: 20px;
    cursor: pointer;
    width: 80px;
    width: 100px;
    align-self: center;

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
    font-size: 80px;
    font-weight: 800;
    text-align: center;
    color: rgb(194, 191, 191);
    @media screen and (max-width:900px) {
        font-size: 45px;

        
    }
}
.sub-title{
    color: rgb(194, 191, 191);
    @media screen and (max-width:900px) {
        font-size: 20px;

        
    }
}
/* Classe para hidrogênio */
.hydrogen {
    border: 0.5px solid #ff1e56; /* Vermelho neon */
}

/* Classe para gases nobres */
.noble-gas {
    border: 0.5px solid #00b0ff; /* Azul neon */
}

/* Classe para metais alcalinos */
.alkali-metal {
    border: 0.5px solid #ff0000; /* Vermelho neon */
}

/* Classe para metais alcalino-terrosos */
.alkaline-earth-metal {
    border: 0.5px solid #ff6f00; /* Laranja neon */
}

/* Classe para metaloides */
.metalloid {
    border: 0.5px solid #ffa500; /* Laranja-amarelo neon */
}

/* Classe para não-metais */
.non-metal {
    border: 0.5px solid #32cd32; /* Verde neon */
}

/* Classe para halogênios */
.halogen {
    border: 0.5px solid #00ff00; /* Verde neon claro */
}

/* Classe para metais de transição */
.transition-metal {
    border: 0.5px solid #ffff00; /* Amarelo neon */
}

/* Classe para lantânidos */
.lanthanide {
    border: 0.5px solid #ff9b6a; /* Laranja neon claro */
}

/* Classe para actinídeos */
.actinide {
    border: 0.5px solid #ffec3d; /* Amarelo neon claro */
}

/* Classe para outros metais */
.metal {
    border: 0.5px solid #ffd700; /* Amarelo ouro neon */
}

.undefined {
    border: 0.5px solid #f0e68c; /* Amarelo neon mais suave */
}


</style>