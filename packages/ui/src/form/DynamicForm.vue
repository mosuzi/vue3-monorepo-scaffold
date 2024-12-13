<template>
  <AForm ref="formRef" :model="model" :layout="layout" v-bind="$attrs" class="dynamic-form">
    <component
      :is="getComponent(item)"
      v-for="item in structure"
      :key="item.prop"
      :model="model"
      v-bind="item"
    />
  </AForm>
</template>

<script setup lang="ts">
import { VNodeTypes, markRaw, defineAsyncComponent, ref } from 'vue'
import { dash2Pascal } from '@v3ms/utils'
import { Structure, StructureItem } from '../../types/index'
import { Form } from '@arco-design/web-vue'
defineOptions({
  name: 'DynamicForm'
})
withDefaults(
  defineProps<{
    model: Record<string, unknown>
    structure: Structure
    layout?: 'horizontal' | 'vertical' | 'inline'
  }>(),
  {
    layout: 'vertical'
  }
)
const formRef = ref<InstanceType<typeof Form>>()

const getComponent = (item: StructureItem): VNodeTypes => {
  if (item.component) return item.component
  return markRaw(defineAsyncComponent(() => import(`./items/${dash2Pascal(item.type)}.vue`)))
}

const validate = function () {
  if (!formRef.value) return Promise.reject(new Error('formRef is not defined'))
  return formRef.value.validate()
}

defineExpose({
  validate
})
</script>

<style lang="scss" scoped>
.dynamic-form {
  &:deep(.arco-form) {
    height: 100%;
  }
}
</style>
