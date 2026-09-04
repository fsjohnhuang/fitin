<script setup lang="ts">
import FitinCanvas from "./components/fitin-canvas.vue";
import FitinContainer from "./components/fitin-container.vue";
</script>

<template>
  <FitinCanvas :design-width="920" :design-height="680">
    <FitinContainer :design-width="200" :design-height="300">
      <div
        style="
          height: 100%;
          display: flex;
          flex-direction: column;
          background: red;
        "
      ></div>
    </FitinContainer>
  </FitinCanvas>
</template>
