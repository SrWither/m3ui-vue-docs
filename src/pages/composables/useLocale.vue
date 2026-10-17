<script setup lang="ts">
import { MButton, MCard, MSegmentedButton, useLocale } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'
import { activeLocaleId, localeOptions, setSiteLocale } from '@/composables/useSiteLocale'

const locale = useLocale()

const types: TypeDef[] = [
  {
    name: 'useLocale()',
    description: 'Returns a reactive M3Locale: the English defaults with the app locale merged over them. It updates when the app locale changes',
    fields: [
      { name: 'lang', type: 'string', description: "BCP-47 language tag ('en', 'es', …), for your own Intl formatting" },
      { name: '<key>', type: 'string', description: 'Every built-in string: cancel, confirm, close, search, noResults, previous, next, today, selectDate, … (the full list is on the i18n page)' },
    ],
  },
  {
    name: 'defaultLocale',
    description: 'M3Locale: the English strings, exported for building a locale of your own',
    fields: [],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useLocale</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The library's built-in strings in the app's language, the same ones its components show. Use it in your own
      components so a "Cancel" you write matches the one in MConfirmDialog, in every language the app supports.
    </p>

    <ComponentDemo
      title="In your own component"
      description="Switch the language: the strings come from the locale given to createM3UI(), and change live when it's a ref."
      :code="`<MButton variant=&quot;text&quot;>{{ locale.cancel }}</MButton>
<MButton>{{ locale.confirm }}</MButton>

<p>{{ new Intl.DateTimeFormat(locale.lang, { dateStyle: 'full' }).format(new Date()) }}</p>`"
      :script="`import { useLocale } from '@m3ui-vue/m3ui-vue'

const locale = useLocale()`"
    >
      <div class="flex w-full flex-col gap-4">
        <MSegmentedButton
          :model-value="activeLocaleId"
          :options="localeOptions.slice(0, 5).map((l) => ({ value: l.id, label: l.label }))"
          density="compact"
          @update:model-value="(v: string | number | (string | number)[]) => setSiteLocale(String(v))"
        />
        <MCard variant="outlined" class="flex flex-col gap-4 p-4">
          <p class="text-body-large">{{ new Intl.DateTimeFormat(locale.lang, { dateStyle: 'full' }).format(new Date()) }}</p>
          <div class="flex justify-end gap-2">
            <MButton variant="text">{{ locale.cancel }}</MButton>
            <MButton>{{ locale.confirm }}</MButton>
          </div>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Providing the locale"
      description="Pass a preset (or your own partial object) to createM3UI. Keys you leave out stay in English."
      :code="`// main.ts
import { createM3UI } from '@m3ui-vue/m3ui-vue'
import { esLocale } from '@m3ui-vue/m3ui-vue/locales'

app.use(createM3UI({ locale: esLocale }))

// switchable at runtime
const appLocale = ref(esLocale)
app.use(createM3UI({ locale: appLocale }))
appLocale.value = frLocale

// only a few keys of your own
app.use(createM3UI({ locale: { lang: 'it', cancel: 'Annulla', confirm: 'Conferma' } }))`"
    >
      <MCard variant="filled" class="p-4 text-body-medium text-on-surface-variant">
        The 7 bundled translations, every key with its default and which component uses it are on the
        <RouterLink to="/getting-started/i18n" class="text-primary underline">i18n</RouterLink> page.
      </MCard>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Details</p>
      <ul class="list-inside list-disc space-y-1 text-body-medium text-on-surface-variant">
        <li>Call it inside <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">setup</code>: it reads the locale <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">createM3UI()</code> provides to the app</li>
        <li>Without the plugin, or without a <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">locale</code> option, every string is English</li>
        <li>Some strings have placeholders filled in at the call site, e.g. <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">paginationPage</code> is <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">'Page {page} of {pages}'</code>: use <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">.replace('{page}', …)</code></li>
        <li>Components that render built-in text also take it as a prop; a prop always wins over the locale</li>
      </ul>
    </MCard>

    <ComponentPager current="useLocale" />
  </div>
</template>
