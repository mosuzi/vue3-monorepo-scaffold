<template>
  <ALayout class="default-layout" :class="{ 'with-sider': withSider }">
    <template v-if="withSider">
      <ALayoutSider><slot name="sider"></slot></ALayoutSider>
      <ALayout class="inner-layout">
        <ALayoutHeader><slot name="header"></slot></ALayoutHeader>
        <ALayoutContent><slot></slot></ALayoutContent>
      </ALayout>
    </template>
    <template v-else>
      <ALayoutHeader><slot name="header"></slot></ALayoutHeader>
      <ALayoutContent><slot></slot></ALayoutContent>
    </template>
    <!-- <a-layout-footer><slot name="footer"></slot></a-layout-footer> -->
  </ALayout>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DefaultLayout'
})
defineProps<{ withSider?: boolean }>()
</script>

<style lang="scss" scoped>
.default-layout {
  width: 100%;
  height: 100%;
  // background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
  :deep(.arco-layout-header) {
    justify-content: center;
  }
  :deep(.arco-layout-header),
  :deep(.arco-layout-sider-children),
  :deep(.arco-layout-content) {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    font-stretch: condensed;
    // text-align: center;
  }
  .arco-layout {
    overflow: hidden;
  }

  :deep(.arco-layout-header) {
    height: 56px;
    flex: 0 0 auto;
  }

  :deep(.arco-layout-sider) {
    width: unset !important;
    background-color: transparent;
    // box-shadow: none;
  }

  :deep(.arco-layout-content) {
    flex: 1;
    overflow: hidden;
  }
}
</style>
