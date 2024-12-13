<template>
  <DefaultLayout class="home" with-sider>
    <RouterView></RouterView>
    <template #header>
      <div class="custom-header"><IconHtml></IconHtml> This is a header </div>
    </template>
    <template #sider>
      <PMenu></PMenu>
    </template>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { IconHtml } from '@v3ms/icons'
import PMenu from '@/components/PMenu.vue'
import { RouterView } from 'vue-router'
</script>

<style lang="scss" scoped>
.home {
  background: linear-gradient(180deg, #c3d3ff 0%, rgba(239, 241, 247, 0) 100%);
  // &:deep(.dynamic-form) {
  // flex: 1 0 auto;
  // }
  .custom-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 24px;
  }
  .v3ms-svg {
    margin-right: 8px;
  }
}
</style>
