import * as components from './src/index'
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IconHtml: typeof components.IconHtml
  }
}
export {}
