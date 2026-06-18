import './assets/main.css'

import { createApp } from 'vue'
import { createM3UI } from '@m3ui-vue/m3ui-vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.use(createM3UI({ palette: 'blue' }))
app.mount('#app')
