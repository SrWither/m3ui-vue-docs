<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'

const globalSetupCode = `// main.ts
import { createApp } from 'vue'
import { createM3UI } from '@m3ui-vue/m3ui-vue'
import App from './App.vue'

const app = createApp(App)
app.use(createM3UI({
  locale: {
    search: 'Buscar...',
    noResults: 'Sin resultados',
    close: 'Cerrar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    loading: 'Cargando',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    finish: 'Finalizar',
    // ... only override the keys you need
  }
}))
app.mount('#app')`

const perInstanceCode = `<!-- Per-instance override (takes priority over global locale) -->
<MDataTable
  :columns="cols"
  :rows="rows"
  search-placeholder="Rechercher..."
  empty-text="Aucun résultat"
/>

<!-- Tour with German labels -->
<MTour
  v-model="open"
  :steps="steps"
  prev-label="Zurück"
  next-label="Weiter"
  finish-label="Fertig"
/>`

const presetsCode = `// Use a pre-built locale preset
import { createM3UI } from '@m3ui-vue/m3ui-vue'
import { esLocale } from '@m3ui-vue/m3ui-vue/locales'

app.use(createM3UI({ locale: esLocale }))

// Or combine a preset with your own overrides
import { frLocale } from '@m3ui-vue/m3ui-vue/locales'

app.use(createM3UI({
  locale: { ...frLocale, search: 'Chercher ici...' }
}))`

const availablePresetsCode = `// Available presets
import {
  esLocale,  // Spanish
  frLocale,  // French
  ptLocale,  // Portuguese (Brazil)
  deLocale,  // German
  jaLocale,  // Japanese
  zhLocale,  // Chinese (Simplified)
  koLocale,  // Korean
} from '@m3ui-vue/m3ui-vue/locales'`

const composableCode = `<script setup>
import { useLocale } from '@m3ui-vue/m3ui-vue'

// Returns the resolved locale (global overrides merged with defaults)
const locale = useLocale()

console.log(locale.search)  // 'Search...' or your configured value
console.log(locale.close)   // 'Close' or your configured value
<\/script>`

const fullSpanishCode = `app.use(createM3UI({
  locale: {
    // Common
    search: 'Buscar...',
    noResults: 'Sin resultados',
    close: 'Cerrar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    loading: 'Cargando',

    // Navigation
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    more: 'más',

    // Tables
    selectedCount: 'seleccionado',
    recordCount: 'registro',
    expand: 'Expandir',
    columns: 'Columnas',
    exportCsv: 'Exportar CSV',
    noGroup: 'Sin grupo',

    // Tour
    finish: 'Finalizar',

    // File upload
    dropText: 'Arrastra archivos aquí o',
    selectText: 'selecciona',
    maxSizePrefix: 'Máx.',
    remove: 'Eliminar',

    // Pickers
    selectDate: 'Seleccionar fecha',
    selectTime: 'Seleccionar hora',
    selectRange: 'Seleccionar rango',
    pickStart: 'Selecciona inicio',
    pickEnd: 'Selecciona fin',
    previousMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',

    // Scheduler
    dayView: 'Día',
    weekView: 'Semana',

    // Transfer list
    available: 'Disponibles',
    selected: 'Seleccionados',
    noItems: 'Sin elementos',
    moveAllRight: 'Mover todos a la derecha',
    moveRight: 'Mover seleccionados a la derecha',
    moveLeft: 'Mover seleccionados a la izquierda',
    moveAllLeft: 'Mover todos a la izquierda',

    // Command palette / Spotlight
    searchCommand: 'Buscar comando...',
    navigateHint: 'navegar',
    selectHint: 'seleccionar',
    openHint: 'abrir',
    closeHint: 'cerrar',

    // Infinite scroll
    loadingMore: 'Cargando...',
    noMoreItems: 'No hay más elementos',

    // Rich text editor
    bold: 'Negrita',
    italic: 'Cursiva',
    underline: 'Subrayado',
    strikethrough: 'Tachado',
    highlight: 'Resaltar',
    bulletList: 'Lista',
    orderedList: 'Lista numerada',
    blockquote: 'Cita',
    code: 'Código',
    alignLeft: 'Izquierda',
    alignCenter: 'Centro',
    alignRight: 'Derecha',
    undo: 'Deshacer',
    redo: 'Rehacer',
    link: 'Enlace',
    image: 'Imagen',
    paragraph: 'Párrafo',
    heading1: 'Título 1',
    heading2: 'Título 2',
    heading3: 'Título 3',
    insertLink: 'Insertar enlace',
    insertImage: 'Insertar imagen',
    imageUrlLabel: 'URL de la imagen',
    insert: 'Insertar',
  }
}))`
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Internationalization (i18n)</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      All component labels default to English. Override any or all of them globally or per-instance.
    </p>

    <!-- How it works -->
    <MCard class="mb-8 flex items-start gap-3 p-4">
      <MIcon name="info" :size="22" class="mt-0.5 shrink-0 text-primary" />
      <div>
        <p class="mb-2 text-body-medium font-medium text-on-surface">Priority order</p>
        <ol class="list-inside list-decimal space-y-1 text-body-medium text-on-surface-variant">
          <li>Props on the component instance <span class="text-on-surface-variant">(highest priority)</span></li>
          <li>Global locale via <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">createM3UI({ locale })</code></li>
          <li>Built-in English defaults <span class="text-on-surface-variant">(fallback)</span></li>
        </ol>
      </div>
    </MCard>

    <!-- Global setup -->
    <h2 class="mb-4 text-headline-small font-medium">Global locale</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      Pass a <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">locale</code> object to
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">createM3UI()</code>.
      You only need to include the keys you want to override &mdash; the rest keep their English defaults.
    </p>
    <MCodeEditor :model-value="globalSetupCode" language="typescript" :readonly="true" :line-numbers="false" min-height="50px" max-height="400px" class="mb-10" />

    <!-- Locale presets -->
    <h2 class="mb-4 text-headline-small font-medium">Locale presets</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      Pre-built locale packages are available for common languages. Import and use them directly &mdash;
      no need to manually define all keys.
    </p>
    <MCodeEditor :model-value="presetsCode" language="typescript" :readonly="true" :line-numbers="false" min-height="50px" max-height="300px" class="mb-6" />
    <MCodeEditor :model-value="availablePresetsCode" language="typescript" :readonly="true" :line-numbers="false" min-height="50px" max-height="250px" class="mb-10" />

    <!-- Per-instance -->
    <h2 class="mb-4 text-headline-small font-medium">Per-instance override</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      Every translatable string is also available as a prop on the component.
      Props always take priority over the global locale.
    </p>
    <MCodeEditor :model-value="perInstanceCode" language="vue" :readonly="true" :line-numbers="false" min-height="50px" max-height="300px" class="mb-10" />

    <!-- useLocale composable -->
    <h2 class="mb-4 text-headline-small font-medium">useLocale composable</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      Access the resolved locale in your own components. Returns all keys merged with defaults.
    </p>
    <MCodeEditor :model-value="composableCode" language="vue" :readonly="true" :line-numbers="false" min-height="50px" max-height="250px" class="mb-10" />

    <!-- Full key reference -->
    <h2 class="mb-4 text-headline-small font-medium">All locale keys</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      Below is the complete list of keys with their English defaults, grouped by category.
      This example shows a full Spanish override.
    </p>
    <MCodeEditor :model-value="fullSpanishCode" language="typescript" :readonly="true" :line-numbers="false" min-height="50px" max-height="800px" class="mb-10" />

    <!-- Key reference table -->
    <h2 class="mb-4 text-headline-small font-medium">Key reference</h2>
    <p class="mb-4 text-body-medium text-on-surface-variant">
      Each key, its English default, and which components use it.
    </p>

    <div class="overflow-hidden rounded-sm border border-outline-variant">
      <table class="w-full border-collapse text-body-medium">
        <thead>
          <tr class="bg-surface-container-high text-label-medium font-medium text-on-surface-variant">
            <th class="px-4 py-3 text-left">Key</th>
            <th class="px-4 py-3 text-left">Default</th>
            <th class="px-4 py-3 text-left">Used by</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-t border-outline-variant bg-primary-container/10">
            <td colspan="3" class="px-4 py-2 text-label-large font-medium text-on-surface">Common</td>
          </tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">search</td><td class="px-4 py-2">'Search...'</td><td class="px-4 py-2 text-on-surface-variant">MDataTable, MTable, MMultiSelect, MTransferList, MSpotlightSearch</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">noResults</td><td class="px-4 py-2">'No results'</td><td class="px-4 py-2 text-on-surface-variant">MDataTable, MTable, MMultiSelect, MCommandPalette, MSpotlightSearch</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">close</td><td class="px-4 py-2">'Close'</td><td class="px-4 py-2 text-on-surface-variant">MDialog, MAlert, MSnackbar</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">cancel</td><td class="px-4 py-2">'Cancel'</td><td class="px-4 py-2 text-on-surface-variant">MConfirmDialog, MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">confirm</td><td class="px-4 py-2">'Confirm'</td><td class="px-4 py-2 text-on-surface-variant">MConfirmDialog</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">loading</td><td class="px-4 py-2">'Loading'</td><td class="px-4 py-2 text-on-surface-variant">MSpinner</td></tr>

          <tr class="border-t border-outline-variant bg-primary-container/10">
            <td colspan="3" class="px-4 py-2 text-label-large font-medium text-on-surface">Navigation</td>
          </tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">previous</td><td class="px-4 py-2">'Previous'</td><td class="px-4 py-2 text-on-surface-variant">MTour, MScheduler, MDateRangePicker</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">next</td><td class="px-4 py-2">'Next'</td><td class="px-4 py-2 text-on-surface-variant">MTour, MScheduler, MDateRangePicker</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">today</td><td class="px-4 py-2">'Today'</td><td class="px-4 py-2 text-on-surface-variant">MCalendar, MScheduler</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">more</td><td class="px-4 py-2">'more'</td><td class="px-4 py-2 text-on-surface-variant">MCalendar</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">finish</td><td class="px-4 py-2">'Finish'</td><td class="px-4 py-2 text-on-surface-variant">MTour</td></tr>

          <tr class="border-t border-outline-variant bg-primary-container/10">
            <td colspan="3" class="px-4 py-2 text-label-large font-medium text-on-surface">Tables</td>
          </tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">selectedCount</td><td class="px-4 py-2">'selected'</td><td class="px-4 py-2 text-on-surface-variant">MDataTable, MTable</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">recordCount</td><td class="px-4 py-2">'record'</td><td class="px-4 py-2 text-on-surface-variant">MDataTable</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">expand</td><td class="px-4 py-2">'Expand'</td><td class="px-4 py-2 text-on-surface-variant">MDataTable</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">columns</td><td class="px-4 py-2">'Columns'</td><td class="px-4 py-2 text-on-surface-variant">MDataTable</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">exportCsv</td><td class="px-4 py-2">'Export CSV'</td><td class="px-4 py-2 text-on-surface-variant">MDataTable</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">noGroup</td><td class="px-4 py-2">'No group'</td><td class="px-4 py-2 text-on-surface-variant">MDataTable</td></tr>

          <tr class="border-t border-outline-variant bg-primary-container/10">
            <td colspan="3" class="px-4 py-2 text-label-large font-medium text-on-surface">File upload</td>
          </tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">dropText</td><td class="px-4 py-2">'Drop files here or'</td><td class="px-4 py-2 text-on-surface-variant">MFileUpload</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">selectText</td><td class="px-4 py-2">'browse'</td><td class="px-4 py-2 text-on-surface-variant">MFileUpload</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">maxSizePrefix</td><td class="px-4 py-2">'Max.'</td><td class="px-4 py-2 text-on-surface-variant">MFileUpload</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">remove</td><td class="px-4 py-2">'Remove'</td><td class="px-4 py-2 text-on-surface-variant">MFileUpload</td></tr>

          <tr class="border-t border-outline-variant bg-primary-container/10">
            <td colspan="3" class="px-4 py-2 text-label-large font-medium text-on-surface">Pickers</td>
          </tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">selectDate</td><td class="px-4 py-2">'Select date'</td><td class="px-4 py-2 text-on-surface-variant">MDatePicker</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">selectTime</td><td class="px-4 py-2">'Select time'</td><td class="px-4 py-2 text-on-surface-variant">MTimePicker</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">selectRange</td><td class="px-4 py-2">'Select range'</td><td class="px-4 py-2 text-on-surface-variant">MDateRangePicker</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">pickStart</td><td class="px-4 py-2">'Select start'</td><td class="px-4 py-2 text-on-surface-variant">MDateRangePicker</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">pickEnd</td><td class="px-4 py-2">'Select end'</td><td class="px-4 py-2 text-on-surface-variant">MDateRangePicker</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">previousMonth</td><td class="px-4 py-2">'Previous month'</td><td class="px-4 py-2 text-on-surface-variant">MDatePicker, MDateRangePicker, MCalendar</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">nextMonth</td><td class="px-4 py-2">'Next month'</td><td class="px-4 py-2 text-on-surface-variant">MDatePicker, MDateRangePicker, MCalendar</td></tr>

          <tr class="border-t border-outline-variant bg-primary-container/10">
            <td colspan="3" class="px-4 py-2 text-label-large font-medium text-on-surface">Scheduler</td>
          </tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">dayView</td><td class="px-4 py-2">'Day'</td><td class="px-4 py-2 text-on-surface-variant">MScheduler</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">weekView</td><td class="px-4 py-2">'Week'</td><td class="px-4 py-2 text-on-surface-variant">MScheduler</td></tr>

          <tr class="border-t border-outline-variant bg-primary-container/10">
            <td colspan="3" class="px-4 py-2 text-label-large font-medium text-on-surface">Transfer list</td>
          </tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">available</td><td class="px-4 py-2">'Available'</td><td class="px-4 py-2 text-on-surface-variant">MTransferList</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">selected</td><td class="px-4 py-2">'Selected'</td><td class="px-4 py-2 text-on-surface-variant">MTransferList</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">noItems</td><td class="px-4 py-2">'No items'</td><td class="px-4 py-2 text-on-surface-variant">MTransferList</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">moveAllRight</td><td class="px-4 py-2">'Move all right'</td><td class="px-4 py-2 text-on-surface-variant">MTransferList</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">moveRight</td><td class="px-4 py-2">'Move selected right'</td><td class="px-4 py-2 text-on-surface-variant">MTransferList</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">moveLeft</td><td class="px-4 py-2">'Move selected left'</td><td class="px-4 py-2 text-on-surface-variant">MTransferList</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">moveAllLeft</td><td class="px-4 py-2">'Move all left'</td><td class="px-4 py-2 text-on-surface-variant">MTransferList</td></tr>

          <tr class="border-t border-outline-variant bg-primary-container/10">
            <td colspan="3" class="px-4 py-2 text-label-large font-medium text-on-surface">Command palette / Spotlight</td>
          </tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">searchCommand</td><td class="px-4 py-2">'Search command...'</td><td class="px-4 py-2 text-on-surface-variant">MCommandPalette</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">navigateHint</td><td class="px-4 py-2">'navigate'</td><td class="px-4 py-2 text-on-surface-variant">MCommandPalette, MSpotlightSearch</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">selectHint</td><td class="px-4 py-2">'select'</td><td class="px-4 py-2 text-on-surface-variant">MCommandPalette</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">openHint</td><td class="px-4 py-2">'open'</td><td class="px-4 py-2 text-on-surface-variant">MSpotlightSearch</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">closeHint</td><td class="px-4 py-2">'close'</td><td class="px-4 py-2 text-on-surface-variant">MCommandPalette, MSpotlightSearch</td></tr>

          <tr class="border-t border-outline-variant bg-primary-container/10">
            <td colspan="3" class="px-4 py-2 text-label-large font-medium text-on-surface">Infinite scroll</td>
          </tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">loadingMore</td><td class="px-4 py-2">'Loading...'</td><td class="px-4 py-2 text-on-surface-variant">MInfiniteScroll</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">noMoreItems</td><td class="px-4 py-2">'No more items'</td><td class="px-4 py-2 text-on-surface-variant">MInfiniteScroll</td></tr>

          <tr class="border-t border-outline-variant bg-primary-container/10">
            <td colspan="3" class="px-4 py-2 text-label-large font-medium text-on-surface">Rich text editor</td>
          </tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">bold</td><td class="px-4 py-2">'Bold'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">italic</td><td class="px-4 py-2">'Italic'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">underline</td><td class="px-4 py-2">'Underline'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">strikethrough</td><td class="px-4 py-2">'Strikethrough'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">highlight</td><td class="px-4 py-2">'Highlight'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">bulletList</td><td class="px-4 py-2">'Bullet list'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">orderedList</td><td class="px-4 py-2">'Ordered list'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">blockquote</td><td class="px-4 py-2">'Blockquote'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">code</td><td class="px-4 py-2">'Code'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">alignLeft</td><td class="px-4 py-2">'Align left'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">alignCenter</td><td class="px-4 py-2">'Align center'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">alignRight</td><td class="px-4 py-2">'Align right'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">undo</td><td class="px-4 py-2">'Undo'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">redo</td><td class="px-4 py-2">'Redo'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">link</td><td class="px-4 py-2">'Link'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">image</td><td class="px-4 py-2">'Image'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">paragraph</td><td class="px-4 py-2">'Paragraph'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">heading1</td><td class="px-4 py-2">'Heading 1'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">heading2</td><td class="px-4 py-2">'Heading 2'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">heading3</td><td class="px-4 py-2">'Heading 3'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">insertLink</td><td class="px-4 py-2">'Insert link'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">insertImage</td><td class="px-4 py-2">'Insert image'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">imageUrlLabel</td><td class="px-4 py-2">'Image URL'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
          <tr class="border-t border-outline-variant"><td class="px-4 py-2 font-mono text-primary">insert</td><td class="px-4 py-2">'Insert'</td><td class="px-4 py-2 text-on-surface-variant">MRichTextEditor</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
