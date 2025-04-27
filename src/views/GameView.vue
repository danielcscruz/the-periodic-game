<script setup lang="ts">
import GridComponent from '@/components/grid/GridComponent.vue';

</script>

<template>
  <main>
    <div class="container">
      <GridComponent/>

    </div>
</main>
</template>

<style scoped>


.container{
  height: 100vh;
  background-color: rgb(31, 28, 49);
  display: grid;
  gap: 1rem;
  align-items: center;
}
</style>
