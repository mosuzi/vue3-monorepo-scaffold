<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>
<template>
  <RouterView />
</template>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-weight: normal;
}

.ellipsis {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
