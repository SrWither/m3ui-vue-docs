import './assets/main.css'

import { createApp } from 'vue'
import { createM3UI, palettes } from '@m3ui-vue/m3ui-vue'
import App from './App.vue'
import router from './router'

const randomPalette = palettes[Math.floor(Math.random() * palettes.length)]!.id

const app = createApp(App)
app.use(router)
app.use(createM3UI({ palette: randomPalette }))
app.mount('#app')
