import { type FieldRule } from '@arco-design/web-vue'
export declare interface BasicItemProps {
  model: Record<string, unknown>
  prop: string
  label: string
  required?: boolean
  disabled?: boolean
  placeholder?: string

  rules?: Record<string, FieldRule | FieldRule[]>[]

  maxLength?: number
}
