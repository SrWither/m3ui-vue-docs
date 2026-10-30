import './assets/main.css'

import { createApp } from 'vue'
import { createM3UI } from '@m3ui-vue/m3ui-vue'
import { setPdfWorker } from '@m3ui-vue/m3ui-vue/pdf'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import App from './App.vue'
import router from './router'
import { siteLocale } from './composables/useSiteLocale'
import './composables/useSiteFont' // applies the saved font before mount

const app = createApp(App)
app.use(router)
// pdf.js parses documents in this worker (MPdfViewer, usePdf)
setPdfWorker(pdfWorker)
app.use(createM3UI({ locale: siteLocale, themeColor: 'surface' }))
app.mount('#app')
