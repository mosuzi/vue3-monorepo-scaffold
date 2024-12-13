<template>
  <AMenu
    class="p-menu"
    show-collapse-button
    :default-open-keys="defaultOpenKey"
    :default-selected-keys="defaultSelectedKey"
    @menu-item-click="handleMenuItemClick"
  >
    <template v-for="subRoute in subRoutes">
      <ASubMenu v-if="subRoute.children" :key="subRoute.name + '&g'">
        <template #title>{{ subRoute.title }}</template>
        <AMenuItem v-for="item in subRoute.children" :key="item.name">{{ item.title }}</AMenuItem>
      </ASubMenu>
      <AMenuItem v-else :key="subRoute.name">{{ subRoute.title }}</AMenuItem>
    </template>
  </AMenu>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import subRoutes from '../router/subRoutes'
defineOptions({
  name: 'PMenu'
})
const router = useRouter()
const route = useRoute()
const defaultOpenKey = Array<string>()
const defaultSelectedKey = Array<string>()
defaultSelectedKey.push(route.name as string)
// if (first) {
//   if (first.children) {
//     defaultOpenKey.push(first.name + '&g')
//     defaultSelectedKey.push(first.children[0].name)
//   } else {
//     defaultSelectedKey.push(first.name)
//   }
// }

const handleMenuItemClick = function (key: string) {
  if (key.endsWith('&g')) return
  router.push({
    name: key,
    query: route.query,
    params: route.params
  })
}
</script>

<style lang="scss" scoped>
.p-menu {
  height: 100%;
  text-align: center;
  &:not(.arco-menu-collapsed) {
    width: 220px;
  }
  &.arco-menu {
    background-color: transparent;
  }
}
</style>
