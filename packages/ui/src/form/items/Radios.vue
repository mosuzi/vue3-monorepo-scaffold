<template>
  <AFormItem
    class="dynamic-radios"
    :field="prop"
    :label="label"
    validate-trigger="input"
    :required="required"
    :disabled="disabled"
  >
    <ARadioGroup v-model="model[prop]" :default-value="defaultOption" :direction="direction">
      <ARadio v-for="item in computedOptions" :key="item.value" :value="item.value">
        <template #radio="{ checked }">
          <div class="dynamic-radio-content" :class="{ checked: checked }">
            <span class="arco-icon-hover arco-radio-icon-hover">
              <span class="arco-radio-icon"></span>
            </span>
            <ATypographyText
              class="flat-bottom break-word"
              :ellipsis="{
                css: true,
                showTooltip: true
              }"
              >{{ item.label }}</ATypographyText
            >
          </div>
        </template>
      </ARadio>
    </ARadioGroup>
  </AFormItem>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BasicItemProps } from '../../../types/basic-item-props'
export type DynamicRadiosStandardOption = {
  label: string
  value: string
}
export type DynamicRadiosOption = DynamicRadiosStandardOption | string
export type DynamicRadiosStandardOptions = Array<DynamicRadiosStandardOption>
export type DynamicRadiosOptions = Array<DynamicRadiosOption>
export type DynamicRadiosProps = BasicItemProps & {
  options: DynamicRadiosOptions
  defaultOption: string
}
defineOptions({
  name: 'DynamicRadios'
})
const props = withDefaults(defineProps<DynamicRadiosProps>(), {
  options: () => [] as DynamicRadiosOptions
})

const computedOptions = computed((): DynamicRadiosStandardOptions => {
  return props.options.map(item => {
    if (typeof item === 'string') {
      return {
        label: item,
        value: item
      }
    } else {
      return item
    }
  })
})
const direction = computed(() => (props.options.length > 2 ? 'vertical' : 'horizontal'))
</script>

<style lang="scss" scoped>
.dynamic-radios {
  .arco-radio-group {
    width: 100%;
    display: flex;
    gap: 24px;
    .arco-radio {
      flex: 1;
      margin-right: 0;
    }
  }
  .arco-radio-group-direction-vertical.arco-radio-group {
    flex-direction: column;
    gap: 12px;
  }
  :deep(.arco-form-item-content-wrapper) {
    .arco-form-item-content {
      flex: 1;
    }
    .dynamic-radio-content {
      width: 100%;
      border: 1px solid #e5e6eb;
      color: #1d2129;
      padding: 4px 12px;
      box-sizing: border-box;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
}
</style>
