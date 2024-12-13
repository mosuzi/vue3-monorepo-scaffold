import * as components from '../src/index'
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    DynamicForm: typeof components.DynamicForm
    DefaultLayout: typeof components.DefaultLayout
  }
}
export {}
