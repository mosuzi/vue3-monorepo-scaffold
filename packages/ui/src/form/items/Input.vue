<template>
  <AFormItem
    class="dynamic-input"
    :field="prop"
    :label="label"
    validate-trigger="input"
    :required="required"
    :rules="computedRules"
  >
    <AInput v-model="model[prop]" :placeholder="placeholder" :max-length="maxLength" />
  </AFormItem>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BasicItemProps } from '../../../types/basic-item-props'

defineOptions({
  name: 'DynamicInput'
})
const props = defineProps<BasicItemProps>()

const computedRules = computed(() => {
  if (props.rules) return props.rules
  if (props.required) return [{ required: true, message: `请输入${props.label}` }]
  return {}
})
</script>
