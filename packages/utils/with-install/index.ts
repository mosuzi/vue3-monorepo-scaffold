import type { App, Plugin } from 'vue'
type SFCWithInstall<T> = T & Plugin
type ComponentWithName = {
  name: string
}
type ComponentWithDisplayName = {
  __name: string
}
export const withInstall = <T>(component: T) => {
  const com = component as SFCWithInstall<T>
  com.install = (app: App) => {
    const name = (com as unknown as ComponentWithName).name
    const displayName = (com as unknown as ComponentWithDisplayName).__name
    app.component(name || displayName, com)
  }
  return component as T & Plugin
}
