<template>
  <DynamicForm class="dynamic-form-view" :model="model" :structure="structure"></DynamicForm>
  {{ model }}
</template>

<script setup lang="ts">
import type { Structure } from '@v3ms/ui'
import { reactive } from 'vue'
const model = reactive({})
const structure: Structure = reactive([
  {
    prop: 'username',
    label: '用户名',
    type: 'input',
    required: true
  }
])
</script>

<style lang="scss" scoped>
.dynamic-form-view {
  width: 100%;
  box-sizing: border-box;
  padding: 24px;
}
</style>
