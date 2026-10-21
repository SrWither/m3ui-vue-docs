<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MAnimatedNumber, MButton, MIconButton, MIcon, MCard, MSelect } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

// Counter
const count = ref(98)

// Cart total
const items = ref([
  { name: 'Ceramic mug', price: 18.5, qty: 2 },
  { name: 'Linen napkins', price: 24, qty: 1 },
])
const total = () => items.value.reduce((s, i) => s + i.price * i.qty, 0)

// Live ticker
const price = ref(184.32)
const change = ref(0)
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  timer = setInterval(() => {
    const delta = Math.round((Math.random() - 0.48) * 300) / 100
    price.value = Math.max(1, Math.round((price.value + delta) * 100) / 100)
    change.value = delta
  }, 2000)
})
onBeforeUnmount(() => clearInterval(timer))

// Any format
interface FormatPreset { label: string; locale: string; format: Intl.NumberFormatOptions; step: number; start: number }
const presets: Record<string, FormatPreset> = {
  plain: { label: 'Number', locale: 'en', format: { maximumFractionDigits: 0 }, step: 137, start: 12840 },
  usd: { label: 'US dollar', locale: 'en-US', format: { style: 'currency', currency: 'USD' }, step: 12.35, start: 1499.99 },
  eur: { label: 'Euro (Spain)', locale: 'es-ES', format: { style: 'currency', currency: 'EUR' }, step: 12.35, start: 1499.99 },
  ars: { label: 'Argentine peso', locale: 'es-AR', format: { style: 'currency', currency: 'ARS' }, step: 1250, start: 189900 },
  mxn: { label: 'Mexican peso', locale: 'es-MX', format: { style: 'currency', currency: 'MXN' }, step: 45.5, start: 2349 },
  brl: { label: 'Brazilian real', locale: 'pt-BR', format: { style: 'currency', currency: 'BRL' }, step: 15.9, start: 899.9 },
  gbp: { label: 'Pound sterling', locale: 'en-GB', format: { style: 'currency', currency: 'GBP' }, step: 9.99, start: 249 },
  jpy: { label: 'Japanese yen', locale: 'ja-JP', format: { style: 'currency', currency: 'JPY' }, step: 1200, start: 32800 },
  percent: { label: 'Percent', locale: 'en', format: { style: 'percent', maximumFractionDigits: 1 }, step: 0.037, start: 0.42 },
  compact: { label: 'Compact (followers)', locale: 'en', format: { notation: 'compact', maximumFractionDigits: 1 }, step: 1513, start: 12840 },
  speed: { label: 'Speed', locale: 'en', format: { style: 'unit', unit: 'kilometer-per-hour', maximumFractionDigits: 0 }, step: 7, start: 88 },
  temperature: { label: 'Temperature', locale: 'en', format: { style: 'unit', unit: 'celsius', maximumFractionDigits: 1 }, step: 1.3, start: 21.5 },
  storage: { label: 'Storage', locale: 'en', format: { style: 'unit', unit: 'gigabyte', maximumFractionDigits: 1 }, step: 3.7, start: 128 },
}
const presetOptions = Object.entries(presets).map(([value, p]) => ({ value, label: p.label }))
const preset = ref('ars')
const amount = ref(presets.ars!.start)
watch(preset, (p) => (amount.value = presets[p]!.start))
const nudge = (sign: number) => {
  const p = presets[preset.value]!
  amount.value = Math.max(0, Math.round((amount.value + sign * p.step * (0.5 + Math.random())) * 1000) / 1000)
}

// Clock and timer
const now = ref(new Date())
const remaining = ref(90)
const running = ref(false)
let clock: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  clock = setInterval(() => {
    now.value = new Date()
    if (running.value && remaining.value > 0) remaining.value--
    if (remaining.value === 0) running.value = false
  }, 1000)
})
onBeforeUnmount(() => clearInterval(clock))

const numberProps: PropDef[] = [
  { name: 'value', type: 'number | Date', description: 'The value: a number, a Date for times, or seconds for a duration' },
  { name: 'type', type: "'number' | 'datetime' | 'duration'", description: "number (Intl.NumberFormat), datetime (Intl.DateTimeFormat; a Date or a timestamp) or duration (seconds as h:mm:ss, hours only when there are some). Defaults to datetime for a Date, number otherwise" },
  { name: 'format', type: 'Intl.NumberFormatOptions | Intl.DateTimeFormatOptions', description: "Intl options for the type: { style: 'currency', currency: 'EUR' }, { style: 'percent' }, { style: 'unit', unit: 'celsius' }, { notation: 'compact' } for numbers; { timeStyle: 'medium' } (the default), { hour: '2-digit', minute: '2-digit' }, { dateStyle: 'short' } for times. Unused for durations. Dollar-sign currencies show their country (AR$, MX$, US$) in any language; set currencyDisplay for Intl's own output ('symbol' gives the local peso as a plain $)" },
  { name: 'locale', type: 'string', description: "BCP-47 language for the format (es-AR for Argentine pesos and separators); defaults to the app's locale (lang)" },
  { name: 'spring', type: '{ dampingRatio: number; stiffness: number }', description: 'The rolling spring; Standard SlowSpatial (an unhurried landing, no visible bounce) by default. motionSprings has the M3 ones' },
  { name: 'animate', type: 'boolean', default: 'true', description: "Roll to new values; false (or the system's reduced motion) jumps to them" },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MAnimatedNumber</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A number, time or duration whose digits roll to their new value on a spring, like an odometer: each digit
      rolls on its own, up when the value grows and down when it shrinks, and digits that appear or go away open and
      close. Any <code>Intl</code> format in your app's language: currencies, percent, units, compact numbers, clocks
      and dates. Screen readers read the value, not the digits. Size and color it like text.
    </p>

    <ComponentDemo
      title="Counter"
      description="Cross 99 → 100 to see a new digit open up, and 100 → 99 to see it close."
      :code="`<template>
  <MAnimatedNumber :value=&quot;count&quot; class=&quot;text-display-large&quot; />
  <MIconButton icon=&quot;remove&quot; @click=&quot;count--&quot; />
  <MIconButton icon=&quot;add&quot; @click=&quot;count++&quot; />
</template>`"
    >
      <div class="flex items-center gap-6">
        <MIconButton icon="remove" label="Decrease" variant="tonal" size="md" @click="count--" />
        <MAnimatedNumber :value="count" class="min-w-[3ch] justify-center text-display-large text-primary" />
        <MIconButton icon="add" label="Increase" variant="filled" size="md" @click="count++" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Currency"
      description="A cart total in euros: the separators and the symbol follow the locale."
      :code="`<template>
  <MAnimatedNumber :value=&quot;total&quot; :format=&quot;{ style: 'currency', currency: 'EUR' }&quot; class=&quot;text-headline-medium&quot; />
</template>`"
    >
      <MCard variant="outlined" class="w-full max-w-sm p-4">
        <div v-for="item in items" :key="item.name" class="flex items-center gap-2 py-1">
          <span class="flex-1 text-body-large">{{ item.name }}</span>
          <MIconButton icon="remove" label="One less" size="xs" :disabled="item.qty === 0" @click="item.qty--" />
          <MAnimatedNumber :value="item.qty" class="w-6 justify-center text-title-medium" />
          <MIconButton icon="add" label="One more" size="xs" @click="item.qty++" />
        </div>
        <div class="mt-3 flex items-baseline border-t border-outline-variant pt-3">
          <span class="flex-1 text-title-medium">Total</span>
          <MAnimatedNumber :value="total()" :format="{ style: 'currency', currency: 'EUR' }" class="text-headline-small font-medium" />
        </div>
      </MCard>
    </ComponentDemo>

    <ComponentDemo
      title="Live Value"
      description="A price that updates every two seconds: digits that didn't change stay still."
      :code="`<template>
  <MAnimatedNumber :value=&quot;price&quot; :format=&quot;{ style: 'currency', currency: 'USD' }&quot; class=&quot;text-display-small&quot; />
</template>`"
    >
      <div class="flex flex-col items-center gap-1">
        <span class="text-label-large text-on-surface-variant">ACME · Nasdaq</span>
        <MAnimatedNumber :value="price" :format="{ style: 'currency', currency: 'USD' }" locale="en" class="text-display-small" />
        <span class="flex items-center gap-1 text-label-large" :class="change >= 0 ? 'text-success' : 'text-error'">
          <MIcon :name="change >= 0 ? 'trending_up' : 'trending_down'" :size="18" />
          <MAnimatedNumber :value="change" :format="{ signDisplay: 'always', minimumFractionDigits: 2 }" locale="en" />
        </span>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Any Format"
      description="Pick a format: currencies with their own symbol and separators per country, percent, compact numbers and units. Anything Intl.NumberFormat takes works."
      :code="`<template>
  <MAnimatedNumber :value=&quot;189900&quot; locale=&quot;es-AR&quot; :format=&quot;{ style: 'currency', currency: 'ARS' }&quot; />
  <MAnimatedNumber :value=&quot;0.42&quot; :format=&quot;{ style: 'percent' }&quot; />
  <MAnimatedNumber :value=&quot;88&quot; :format=&quot;{ style: 'unit', unit: 'kilometer-per-hour' }&quot; />
  <MAnimatedNumber :value=&quot;12840&quot; :format=&quot;{ notation: 'compact' }&quot; />
</template>`"
    >
      <div class="flex w-full max-w-md flex-col items-center gap-5">
        <MSelect v-model="preset" :options="presetOptions" label="Format" class="w-full" />
        <MAnimatedNumber :value="amount" :locale="presets[preset]!.locale" :format="presets[preset]!.format" class="text-display-medium" />
        <code class="text-body-small text-on-surface-variant">locale="{{ presets[preset]!.locale }}" :format="{{ JSON.stringify(presets[preset]!.format) }}"</code>
        <div class="flex gap-2">
          <MButton variant="tonal" icon="remove" @click="nudge(-1)">Less</MButton>
          <MButton icon="add" @click="nudge(1)">More</MButton>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Clock and Timer"
      description="A Date rolls as a time (Intl.DateTimeFormat, your locale's clock); type=&quot;duration&quot; shows seconds as m:ss, adding hours past an hour. Tens of minutes and seconds roll through 0-5 only, so 59 → 00 is one step."
      :code="`<template>
  <MAnimatedNumber :value=&quot;now&quot; :format=&quot;{ hour: '2-digit', minute: '2-digit', second: '2-digit' }&quot; />
  <MAnimatedNumber :value=&quot;remaining&quot; type=&quot;duration&quot; />
</template>`"
    >
      <div class="flex w-full flex-wrap justify-center gap-4">
        <MCard variant="filled" class="flex min-w-56 flex-col items-center gap-1 p-5">
          <span class="text-label-large text-on-surface-variant">Local time</span>
          <MAnimatedNumber :value="now" :format="{ hour: '2-digit', minute: '2-digit', second: '2-digit' }" class="text-display-small" />
          <MAnimatedNumber :value="now" :format="{ weekday: 'long', day: 'numeric', month: 'long' }" class="text-body-medium text-on-surface-variant" />
        </MCard>
        <MCard variant="filled" class="flex min-w-56 flex-col items-center gap-2 p-5">
          <span class="text-label-large text-on-surface-variant">Tea timer</span>
          <MAnimatedNumber :value="remaining" type="duration" class="text-display-small" :class="remaining === 0 && 'text-error'" />
          <div class="flex gap-2">
            <MIconButton :icon="running ? 'pause' : 'play_arrow'" :label="running ? 'Pause' : 'Start'" variant="filled" :disabled="remaining === 0" @click="running = !running" />
            <MIconButton icon="replay" label="Reset" variant="tonal" @click="(remaining = 90), (running = false)" />
            <MIconButton icon="more_time" label="Add a minute" variant="tonal" @click="remaining += 60" />
          </div>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="numberProps" />

    <ComponentPager current="MAnimatedNumber" />
  </div>
</template>
