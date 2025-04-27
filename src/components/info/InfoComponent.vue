<template>
    <div class="info-wrapper">
        <div class="score-section">
            <h3>Score</h3>
            <span>{{ engine.score }}</span>
            <h4>debug states</h4>
            <span>{{ engine.row_position }}</span>
            <span>{{ engine.is_chemino_falling }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">

import { useGameEngine } from '@/stores/engine'

const engine = useGameEngine()



</script>

<style lang="css" scoped>
@import './styles.css';

</style>