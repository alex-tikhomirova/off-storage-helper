import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import './scss/main.scss'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

app.mount('#app')
