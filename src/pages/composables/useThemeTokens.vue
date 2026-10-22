<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { MCard, MSwitch, useThemeTokens } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const names = ['primary', 'tertiary', 'secondary-container', 'outline-variant', 'on-surface-variant'] as const
const settled = useThemeTokens(names)
const live = useThemeTokens(names, { live: true })
const followFade = ref(true)
const colors = computed(() => (followFade.value ? live : settled).value)

const canvas = ref<HTMLCanvasElement>()
const values = [42, 68, 55, 90, 74, 61, 83]

function draw() {
  const c = canvas.value
  const ctx = c?.getContext('2d')
  if (!c || !ctx) return
  const dpr = window.devicePixelRatio || 1
  const w = c.clientWidth
  const h = c.clientHeight
  c.width = w * dpr
  c.height = h * dpr
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, w, h)
  const t = colors.value
  // Grid lines
  ctx.strokeStyle = t['outline-variant']
  ctx.lineWidth = 1
  for (let i = 1; i <= 3; i++) {
    const y = Math.round((h - 24) * (i / 4)) + 0.5
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }
  // Bars, the best one in tertiary
  const gap = 12
  const bw = (w - gap * (values.length - 1)) / values.length
  const max = Math.max(...values)
  values.forEach((v, i) => {
    const bh = ((h - 24) * v) / 100
    ctx.fillStyle = v === max ? t.tertiary : i % 2 ? t['secondary-container'] : t.primary
    ctx.beginPath()
    ctx.roundRect(i * (bw + gap), h - 24 - bh, bw, bh, [8, 8, 0, 0])
    ctx.fill()
    ctx.fillStyle = t['on-surface-variant']
    ctx.font = '12px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]!, i * (bw + gap) + bw / 2, h - 6)
  })
}

onMounted(draw)
watch(colors, draw)

const types: TypeDef[] = [
  {
    name: 'useThemeTokens(names, options?)',
    description: 'The current values of some color tokens, kept up to date across theme changes',
    fields: [
      { name: 'names', type: 'readonly string[]', required: true, description: "Token names without the prefix: ['primary', 'outline-variant'] reads --color-primary and --color-outline-variant. Pass them as const to get a typed result" },
      { name: 'options.live', type: 'boolean', description: "Updates every frame while the theme switch's colors fade (as rgba() midway), so a canvas redrawn on change fades with the page instead of jumping to the new colors. Off by default: Chart.js, MChart and maps animate color changes themselves and only need the final values" },
    ],
  },
  {
    name: 'Returns',
    fields: [
      { name: 'tokens', type: 'Ref<Record<name, string>>', description: "Each token's current value (e.g. '#6750a4'). A new object whenever any of them changes, so watch it or read it in a computed. Empty strings on the server" },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useThemeTokens</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The theme's colors as plain strings, for what can't read CSS variables: your own canvas, a map layer's paint,
      chart colors you compute in code. They stay current across light/dark, palette, contrast and generated (seed) palette changes, read
      once the theme switch's color transition settles.
    </p>

    <ComponentDemo
      title="Canvas chart"
      description="The bars and grid are drawn on a canvas with the token values, and redrawn when they change: switch the theme or the palette in the top bar. With live on, the canvas fades along with the page; off, it jumps to the new colors once the fade ends."
      :code="`<canvas ref=&quot;canvas&quot; class=&quot;h-56 w-full&quot; />`"
      :script="`import { onMounted, ref, watch } from 'vue'
import { useThemeTokens } from '@m3ui-vue/m3ui-vue'

// live: redraw every frame of the theme switch, fading with the page
const colors = useThemeTokens(['primary', 'tertiary', 'outline-variant'] as const, { live: true })
const canvas = ref<HTMLCanvasElement>()

function draw() {
  const ctx = canvas.value!.getContext('2d')!
  ctx.fillStyle = colors.value.primary
  // ...
}
onMounted(draw)
watch(colors, draw)`"
    >
      <div class="flex w-full flex-col gap-4">
        <label class="flex items-center gap-3 text-body-medium">
          <MSwitch v-model="followFade" />
          live (follow the theme switch's fade)
        </label>
        <div class="flex w-full flex-col gap-4 md:flex-row">
          <canvas ref="canvas" class="h-56 min-w-0 flex-1" aria-label="Sales by weekday" role="img" />
          <ul class="flex shrink-0 flex-col gap-2 text-body-small md:w-56">
            <li v-for="n in names" :key="n" class="flex items-center gap-2">
              <span class="size-4 shrink-0 rounded-sm border border-outline-variant" :style="{ background: colors[n] }" />
              <code class="min-w-0 flex-1 truncate text-on-surface-variant">{{ n }}</code>
              <code class="text-on-surface">{{ colors[n] }}</code>
            </li>
          </ul>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Details</p>
      <ul class="list-inside list-disc space-y-1 text-body-medium text-on-surface-variant">
        <li>Anything that can take a CSS variable (a style binding, an SVG fill) should use <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">var(--color-primary)</code> instead: it follows the theme with no JavaScript</li>
        <li>It watches the <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">dark</code> class and the palette and contrast attributes on &lt;html&gt;, and the stylesheet a generated palette writes; a change is read right away and again once the 250ms color transition ends. With <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">live</code> it's read every frame in between (Chromium and Safari animate the tokens themselves; in Firefox, which fades each element instead, the same fade is replayed from the old colors)</li>
        <li>MChart already uses it: its axes, legend, tooltips and any dataset without colors follow the theme on their own (pick roles with its <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">colors</code> prop). Reach for this for your own canvas, a map layer, or chart colors you compute in code</li>
      </ul>
    </MCard>

    <ComponentPager current="useThemeTokens" />
  </div>
</template>
