import { createApp, type Plugin } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import UiComponents from '@v3ms/ui'
import './vendors/request'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(UiComponents as unknown as Plugin)

app.mount('#app')
