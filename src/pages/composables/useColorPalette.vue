<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MCard, MSelect, useColorPalette } from '@m3ui-vue/m3ui-vue'
import type { SchemeVariant } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const { palette, palettes, set, seed, setSeed } = useColorPalette()

const shown = palettes.slice(0, 12)

const seedColor = ref(seed.value?.seed ?? '#0b57d0')
const variant = ref<SchemeVariant>(seed.value?.variant ?? 'tonal-spot')
const variants: SchemeVariant[] = ['tonal-spot', 'expressive', 'vibrant', 'fidelity', 'content', 'neutral', 'monochrome', 'rainbow', 'fruit-salad']

const types: TypeDef[] = [
  {
    name: 'useColorPalette()',
    description: 'Returned object — module-level state, shared by every call site',
    fields: [
      { name: 'palette', type: 'Ref<string>', description: "The active palette id ('purple' by default, 'seed' while a seed color is active)" },
      { name: 'palettes', type: 'Palette[]', description: 'Every available palette: the 40 built-in ones plus createM3UI({ customPalettes })' },
      { name: 'set', type: '(id: string) => void', description: 'Switches to a palette by id, with a 250ms color transition' },
      { name: 'seed', type: 'Readonly<Ref<ActiveSeed | null>>', description: 'The last seed passed to setSeed(), so a picker can show it again' },
      { name: 'setSeed', type: '(seed: string, options?: SeedOptions) => Promise<void>', description: "Generates a full scheme (light and dark) from one #rrggbb color and switches to it; palette becomes 'seed'" },
      { name: 'persistPalette', type: 'Ref<boolean>', description: 'Whether changes are saved to localStorage (true by default)' },
      { name: 'setPersistPalette', type: '(enabled: boolean) => void', description: 'Turns saving on or off; turning it on saves the current palette right away' },
    ],
  },
  {
    name: 'Palette',
    fields: [
      { name: 'id', type: 'string', required: true, description: "The value of data-palette on <html>, e.g. 'teal'" },
      { name: 'label', type: 'string', required: true, description: 'Name to show in a picker' },
      { name: 'seed', type: 'string', required: true, description: 'Key color. A custom palette with no CSS of its own gets its scheme generated from it' },
    ],
  },
  {
    name: 'SeedOptions',
    fields: [
      { name: 'variant', type: 'SchemeVariant', description: "How the seed spreads into the scheme: 'tonal-spot' (default, Android's), 'expressive', 'vibrant', 'fidelity', 'content', 'neutral', 'monochrome', 'rainbow', 'fruit-salad'" },
      { name: 'contrast', type: 'number', description: '0 standard (default), 0.5 medium, 1 high, -1 reduced' },
    ],
  },
  {
    name: 'ActiveSeed',
    description: 'SeedOptions plus the seed itself',
    fields: [
      { name: 'seed', type: 'string', required: true, description: 'The seed color' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useColorPalette</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Switch the color palette at runtime, or generate one from any color. A palette is the
      <code>data-palette</code> attribute on <code>&lt;html&gt;</code>; it combines with the light/dark scheme from
      useTheme, and the choice is remembered across visits.
    </p>

    <ComponentDemo
      title="Built-in palettes"
      description="palettes lists every palette (id, label, seed); set(id) switches. This changes the colors of the whole docs site."
      :code="`<button
  v-for=&quot;p in palettes&quot;
  :key=&quot;p.id&quot;
  :style=&quot;{ background: p.seed }&quot;
  :aria-pressed=&quot;palette === p.id&quot;
  :title=&quot;p.label&quot;
  @click=&quot;set(p.id)&quot;
/>`"
      :script="`import { useColorPalette } from '@m3ui-vue/m3ui-vue'

const { palette, palettes, set } = useColorPalette()`"
    >
      <div class="flex w-full flex-col gap-4">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="p in shown"
            :key="p.id"
            type="button"
            class="size-10 cursor-pointer rounded-full border-2 transition-transform hover:scale-110"
            :class="palette === p.id ? 'border-on-surface' : 'border-transparent'"
            :style="{ background: p.seed }"
            :aria-pressed="palette === p.id"
            :title="p.label"
            @click="set(p.id)"
          />
        </div>
        <p class="text-body-medium text-on-surface-variant">
          Active: <strong>{{ palette }}</strong> · showing 12 of {{ palettes.length }} —
          <RouterLink to="/styles/palettes" class="text-primary underline">see them all</RouterLink>
        </p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="From a seed color"
      description="setSeed() builds the whole scheme from one color with Google's dynamic color, like Android does from a wallpaper. The generator (about 20 KB gzipped) loads only the first time it's used."
      :code="`<input v-model=&quot;color&quot; type=&quot;color&quot; />
<MSelect v-model=&quot;variant&quot; :options=&quot;variants&quot; label=&quot;Variant&quot; />
<MButton @click=&quot;setSeed(color, { variant })&quot;>Apply</MButton>`"
      :script="`import { ref } from 'vue'
import { useColorPalette } from '@m3ui-vue/m3ui-vue'

const { setSeed } = useColorPalette()
const color = ref('#0b57d0')
const variant = ref('tonal-spot')`"
    >
      <div class="flex w-full flex-wrap items-center gap-4">
        <input v-model="seedColor" type="color" aria-label="Seed color" class="h-12 w-16 cursor-pointer rounded-lg border border-outline-variant bg-transparent" />
        <MSelect v-model="variant" :options="variants.map((v) => ({ value: v, label: v }))" label="Variant" class="w-48" />
        <MButton icon="auto_awesome" @click="setSeed(seedColor, { variant })">Apply</MButton>
        <MButton variant="text" @click="set('purple')">Back to purple</MButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="App defaults"
      description="createM3UI() sets the palette, or seed, a first visit starts with. Once the user picks another, theirs wins on later visits, unless persistPalette is false."
      :code="`// main.ts
app.use(createM3UI({ palette: 'teal' }))

// or generated from your brand color
app.use(createM3UI({ seed: '#c2185b', seedOptions: { variant: 'vibrant' } }))

// always this palette on boot, never saved
app.use(createM3UI({ palette: 'teal', persistPalette: false }))`"
    >
      <MCard variant="filled" class="p-4 text-body-medium text-on-surface-variant">
        Custom palettes with your own CSS, and how each palette is built, are on the
        <RouterLink to="/styles/palettes" class="text-primary underline">Palettes</RouterLink> page.
      </MCard>
    </ComponentDemo>

    <ComponentDemo
      title="Several apps on one domain"
      description="The choices live in localStorage (and cookies with cookies: true), which belong to the whole origin: two apps at example.com/admin and example.com/shop would share one theme and palette. Give each one its own storagePrefix and every key becomes <prefix>-m3-…: theme, palette, seed, contrast, recent colors and emoji."
      :code="`// example.com/admin
app.use(createM3UI({ palette: 'teal', storagePrefix: 'admin' })) // admin-m3-theme, admin-m3-palette…

// example.com/shop
app.use(createM3UI({ palette: 'red', storagePrefix: 'shop' }))

// server-rendered: the same prefix for the head script and the viewport cookie
themeInitScript({ palette: 'red', storagePrefix: 'shop' })
viewportFromHeaders(request.headers, { storagePrefix: 'shop' })`"
    >
      <MCard variant="filled" class="p-4 text-body-medium text-on-surface-variant">
        Apps on different subdomains (admin.example.com, shop.example.com) are already separate origins and never
        share them.
      </MCard>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Related functions</h3>
    <TypesTable
      :types="[
        {
          name: 'generateScheme(seed, options?)',
          description: 'Promise<GeneratedScheme>: the light and dark token values for a seed, without applying them (e.g. to preview a scheme)',
          fields: [
            { name: 'light / dark', type: 'Record<string, string>', required: true, description: 'Role name (as in --color-<name>) → hex' },
          ],
        },
        {
          name: 'schemeToCss(scheme, id)',
          description: 'string: that scheme as [data-palette=\'<id>\'] and [data-palette=\'<id>\'].dark rules, the format of palettes.css',
          fields: [],
        },
        {
          name: 'schemeRoles / SEED_PALETTE',
          description: 'The color roles a generated scheme sets, and the palette id used while a seed is active (\'seed\')',
          fields: [],
        },
      ]"
    />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Details</p>
      <ul class="list-inside list-disc space-y-1 text-body-medium text-on-surface-variant">
        <li>Saved in localStorage under <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">m3-palette</code> (and <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">m3-seed</code>), applied when the library loads, before any component mounts</li>
        <li>A generated scheme's CSS is cached too, so reloading with a seed palette doesn't flash the default colors while the generator loads</li>
        <li>The last choice wins: <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">set(id)</code> after <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">setSeed()</code> switches back to that palette, and the other way around</li>
        <li><code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">'purple'</code> is the baseline in the theme stylesheet; the other 39 need <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">@m3ui-vue/m3ui-vue/palettes</code> imported</li>
      </ul>
    </MCard>

    <ComponentPager current="useColorPalette" />
  </div>
</template>
