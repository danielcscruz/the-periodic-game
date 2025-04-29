<script setup lang="ts">
import GridComponent from '@/components/grid/GridComponent.vue';
// import InfoComponent from '@/components/info/InfoComponent.vue'

</script>

<template>
  <main>
    <div class="container">
      <GridComponent/>
      <!-- <InfoComponent /> -->

    </div>
</main>
</template>

<style scoped>


.container{
  height: 100vh;
  background-color: rgb(31, 28, 49);
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
