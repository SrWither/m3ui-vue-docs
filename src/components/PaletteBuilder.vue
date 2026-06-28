<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { MCard, MButton, MIcon, MSegmentedButton, MTooltip, MCheckbox } from '@m3ui-vue/m3ui-vue'
import type { SegmentedOption } from '@m3ui-vue/m3ui-vue'
import { MColorPicker } from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'

// ── Color math ────────────────────────────────────────────────────────────────

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let hue: number
  switch (max) {
    case r: hue = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
    case g: hue = ((b - r) / d + 2) / 6; break
    default: hue = ((r - g) / d + 4) / 6
  }
  return { h: Math.round(hue * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToHex(h: number, s: number, l: number): string {
  const sl = Math.max(0, Math.min(100, s)) / 100
  const ll = Math.max(0, Math.min(100, l)) / 100
  const a = sl * Math.min(ll, 1 - ll)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const c = ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * c).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function keyTokens(h: number, s: number, dark: boolean) {
  const sat = Math.min(s, 85)
  if (!dark) return {
    color:       hslToHex(h, sat,        35),
    onColor:     hslToHex(h, 5,          99),
    container:   hslToHex(h, sat * 0.45, 90),
    onContainer: hslToHex(h, sat * 0.8,  12),
  }
  return {
    color:       hslToHex(h, sat * 0.72, 78),
    onColor:     hslToHex(h, sat * 0.8,  18),
    container:   hslToHex(h, sat * 0.6,  28),
    onContainer: hslToHex(h, sat * 0.45, 88),
  }
}

function surfaceTokens(h: number, dark: boolean): Record<string, string> {
  if (!dark) return {
    'surface':                   hslToHex(h, 4,  98),
    'on-surface':                hslToHex(h, 5,  10),
    'surface-variant':           hslToHex(h, 14, 90),
    'on-surface-variant':        hslToHex(h, 8,  27),
    'surface-dim':               hslToHex(h, 7,  86),
    'surface-bright':            hslToHex(h, 4,  98),
    'surface-container-lowest':  '#ffffff',
    'surface-container-low':     hslToHex(h, 4,  96),
    'surface-container':         hslToHex(h, 6,  93),
    'surface-container-high':    hslToHex(h, 6,  90),
    'surface-container-highest': hslToHex(h, 6,  87),
    'background':                hslToHex(h, 4,  98),
    'on-background':             hslToHex(h, 5,  10),
    'outline':                   hslToHex(h, 7,  45),
    'outline-variant':           hslToHex(h, 10, 78),
    'inverse-surface':           hslToHex(h, 5,  19),
    'inverse-on-surface':        hslToHex(h, 4,  95),
    'inverse-primary':           hslToHex(h, Math.min(85, 70), 78),
  }
  return {
    'surface':                   hslToHex(h, 5,  7),
    'on-surface':                hslToHex(h, 8,  89),
    'surface-variant':           hslToHex(h, 8,  27),
    'on-surface-variant':        hslToHex(h, 6,  77),
    'surface-dim':               hslToHex(h, 5,  7),
    'surface-bright':            hslToHex(h, 5,  22),
    'surface-container-lowest':  hslToHex(h, 5,  4),
    'surface-container-low':     hslToHex(h, 5,  10),
    'surface-container':         hslToHex(h, 5,  13),
    'surface-container-high':    hslToHex(h, 5,  17),
    'surface-container-highest': hslToHex(h, 5,  21),
    'background':                hslToHex(h, 5,  7),
    'on-background':             hslToHex(h, 8,  89),
    'outline':                   hslToHex(h, 6,  55),
    'outline-variant':           hslToHex(h, 8,  27),
    'inverse-surface':           hslToHex(h, 8,  89),
    'inverse-on-surface':        hslToHex(h, 5,  19),
    'inverse-primary':           hslToHex(h, Math.min(85, 70), 35),
  }
}

const ERROR_LIGHT: Record<string, string> = {
  'error':              '#B3261E',
  'on-error':           '#ffffff',
  'error-container':    '#F9DEDC',
  'on-error-container': '#410E0B',
}
const ERROR_DARK: Record<string, string> = {
  'error':              '#F2B8B5',
  'on-error':           '#601410',
  'error-container':    '#8C1D18',
  'on-error-container': '#F9DEDC',
}

// ── Token groups definition ───────────────────────────────────────────────────

const TOKEN_GROUPS: { label: string; tokens: string[] }[] = [
  { label: 'Primary',   tokens: ['primary', 'on-primary', 'primary-container', 'on-primary-container'] },
  { label: 'Secondary', tokens: ['secondary', 'on-secondary', 'secondary-container', 'on-secondary-container'] },
  { label: 'Tertiary',  tokens: ['tertiary', 'on-tertiary', 'tertiary-container', 'on-tertiary-container'] },
  { label: 'Error',     tokens: ['error', 'on-error', 'error-container', 'on-error-container'] },
  {
    label: 'Surface',
    tokens: [
      'surface', 'on-surface', 'surface-variant', 'on-surface-variant',
      'surface-dim', 'surface-bright',
      'surface-container-lowest', 'surface-container-low', 'surface-container',
      'surface-container-high', 'surface-container-highest',
    ],
  },
  {
    label: 'Background & Outline',
    tokens: [
      'background', 'on-background',
      'outline', 'outline-variant',
      'inverse-surface', 'inverse-on-surface', 'inverse-primary',
    ],
  },
]

// ── Mode state ────────────────────────────────────────────────────────────────

type BuilderMode = 'generated' | 'manual'
type ThemeMode = 'light' | 'dark'

const modeOptions: SegmentedOption[] = [
  { value: 'generated', label: 'Generated', icon: 'auto_awesome' },
  { value: 'manual',    label: 'Manual',    icon: 'tune' },
]
const themeModeOptions: SegmentedOption[] = [
  { value: 'light', label: 'Light', icon: 'light_mode' },
  { value: 'dark',  label: 'Dark',  icon: 'dark_mode' },
]

const builderMode = ref<BuilderMode>('generated')
const themeMode   = ref<ThemeMode>('light')
const paletteName = ref('my-brand')

// ── Generated mode ────────────────────────────────────────────────────────────

const primaryHex    = ref('#6750A4')
const autoSecondary = ref(true)
const secondaryHex  = ref('#4355B9')
const autoTertiary  = ref(true)
const tertiaryHex   = ref('#6E5676')

const primaryHsl = computed(() => hexToHsl(primaryHex.value))

const effectiveSecondaryHex = computed(() => {
  if (!autoSecondary.value) return secondaryHex.value
  const { h, s } = primaryHsl.value
  return hslToHex((h + 35) % 360, Math.max(s - 15, 20), 38)
})

const effectiveTertiaryHex = computed(() => {
  if (!autoTertiary.value) return tertiaryHex.value
  const { h, s } = primaryHsl.value
  return hslToHex((h - 55 + 360) % 360, Math.max(s - 10, 25), 42)
})

function buildGenerated(dark: boolean): Record<string, string> {
  const p  = primaryHsl.value
  const sh = hexToHsl(effectiveSecondaryHex.value)
  const th = hexToHsl(effectiveTertiaryHex.value)
  const pk = keyTokens(p.h, p.s, dark)
  const sk = keyTokens(sh.h, sh.s, dark)
  const tk = keyTokens(th.h, th.s, dark)
  const sf = surfaceTokens(p.h, dark)
  const er = dark ? ERROR_DARK : ERROR_LIGHT
  return {
    'primary': pk.color, 'on-primary': pk.onColor,
    'primary-container': pk.container, 'on-primary-container': pk.onContainer,
    'secondary': sk.color, 'on-secondary': sk.onColor,
    'secondary-container': sk.container, 'on-secondary-container': sk.onContainer,
    'tertiary': tk.color, 'on-tertiary': tk.onColor,
    'tertiary-container': tk.container, 'on-tertiary-container': tk.onContainer,
    ...er, ...sf,
  }
}

const generatedLight = computed(() => buildGenerated(false))
const generatedDark  = computed(() => buildGenerated(true))

// ── Manual mode ───────────────────────────────────────────────────────────────

const manualLight = ref<Record<string, string>>({})
const manualDark  = ref<Record<string, string>>({})

function seedManual() {
  manualLight.value = { ...generatedLight.value }
  manualDark.value  = { ...generatedDark.value }
}

watch(builderMode, (m) => {
  if (m === 'manual' && Object.keys(manualLight.value).length === 0) seedManual()
})

function resetGroup(groupTokens: string[]) {
  const gen = themeMode.value === 'light' ? generatedLight.value : generatedDark.value
  const manual = themeMode.value === 'light' ? manualLight : manualDark
  for (const t of groupTokens) manual.value[t] = gen[t]!
}

function setManualToken(token: string, value: string) {
  if (themeMode.value === 'light') manualLight.value[token] = value
  else manualDark.value[token] = value
}

function getManualToken(token: string): string {
  const map = themeMode.value === 'light' ? manualLight.value : manualDark.value
  return map[token] ?? '#000000'
}

// ── Effective tokens (used for preview + export) ──────────────────────────────

const effectiveLight = computed(() =>
  builderMode.value === 'generated' ? generatedLight.value : manualLight.value
)
const effectiveDark = computed(() =>
  builderMode.value === 'generated' ? generatedDark.value : manualDark.value
)

// ── CSS generation ────────────────────────────────────────────────────────────

function tokensToVars(tokens: Record<string, string>, indent = '  '): string {
  return Object.entries(tokens)
    .map(([k, v]) => `${indent}--color-${k}: ${v};`)
    .join('\n')
}

const generatedCss = computed(() => {
  const name = paletteName.value.trim() || 'my-brand'
  return `[data-palette='${name}'] {\n${tokensToVars(effectiveLight.value)}\n}\n\n[data-palette='${name}'].dark {\n${tokensToVars(effectiveDark.value)}\n}`
})

// ── Live preview ──────────────────────────────────────────────────────────────

const isPreviewing = ref(false)
let styleEl: HTMLStyleElement | null = null
let prevPalette: string | null = null

function injectStyle() {
  styleEl?.remove()
  styleEl = document.createElement('style')
  styleEl.id = 'm3-palette-builder-preview'
  styleEl.textContent = `[data-palette='__preview__'] {\n${tokensToVars(effectiveLight.value)}\n}\n[data-palette='__preview__'].dark {\n${tokensToVars(effectiveDark.value)}\n}`
  document.head.appendChild(styleEl)
}

function applyPreview() {
  prevPalette = document.documentElement.getAttribute('data-palette')
  injectStyle()
  document.documentElement.setAttribute('data-palette', '__preview__')
  isPreviewing.value = true
}

function clearPreview() {
  styleEl?.remove()
  styleEl = null
  if (prevPalette !== null) document.documentElement.setAttribute('data-palette', prevPalette)
  else document.documentElement.removeAttribute('data-palette')
  prevPalette = null
  isPreviewing.value = false
}

watch([effectiveLight, effectiveDark], () => {
  if (isPreviewing.value) injectStyle()
})

onUnmounted(clearPreview)

// ── Copy ──────────────────────────────────────────────────────────────────────

const copied = ref(false)
async function copyCSS() {
  await navigator.clipboard.writeText(generatedCss.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

// ── Swatch helpers ────────────────────────────────────────────────────────────

const swatchGroups = computed(() => [
  {
    label: 'Primary',
    tokens: [
      { key: 'primary', label: 'Primary' },
      { key: 'on-primary', label: 'On' },
      { key: 'primary-container', label: 'Container' },
      { key: 'on-primary-container', label: 'On Cont.' },
    ],
  },
  {
    label: 'Secondary',
    tokens: [
      { key: 'secondary', label: 'Secondary' },
      { key: 'on-secondary', label: 'On' },
      { key: 'secondary-container', label: 'Container' },
      { key: 'on-secondary-container', label: 'On Cont.' },
    ],
  },
  {
    label: 'Tertiary',
    tokens: [
      { key: 'tertiary', label: 'Tertiary' },
      { key: 'on-tertiary', label: 'On' },
      { key: 'tertiary-container', label: 'Container' },
      { key: 'on-tertiary-container', label: 'On Cont.' },
    ],
  },
  {
    label: 'Error',
    tokens: [
      { key: 'error', label: 'Error' },
      { key: 'on-error', label: 'On' },
      { key: 'error-container', label: 'Container' },
      { key: 'on-error-container', label: 'On Cont.' },
    ],
  },
  {
    label: 'Surface',
    tokens: [
      { key: 'surface', label: 'Surface' },
      { key: 'on-surface', label: 'On' },
      { key: 'surface-container', label: 'Container' },
      { key: 'surface-variant', label: 'Variant' },
      { key: 'outline', label: 'Outline' },
    ],
  },
])

function tokenColor(key: string, dark: boolean): string {
  return dark ? (effectiveDark.value[key] ?? '#000') : (effectiveLight.value[key] ?? '#000')
}
</script>

<template>
  <div>
    <!-- Preview banner -->
    <div
      v-if="isPreviewing"
      class="mb-4 flex items-center justify-between gap-3 rounded-xl border border-primary bg-primary-container/40 px-4 py-3"
    >
      <div class="flex items-center gap-2 text-body-medium">
        <MIcon name="palette" :size="18" class="text-primary" />
        Previewing <strong class="text-primary">{{ paletteName || 'my-brand' }}</strong> — the entire page is using your palette.
      </div>
      <MButton variant="tonal" @click="clearPreview">Restore</MButton>
    </div>

    <MCard class="mb-6 p-5">
      <!-- Top row: name + mode -->
      <div class="mb-5 flex flex-wrap items-end gap-4">
        <div class="flex-1" style="min-width: 160px">
          <label class="mb-1 block text-label-large font-medium">Palette name</label>
          <input
            v-model="paletteName"
            type="text"
            placeholder="my-brand"
            class="w-full rounded-lg border border-outline-variant bg-surface-container px-3 py-2 text-body-medium text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <MSegmentedButton v-model="builderMode" :options="modeOptions" />
      </div>

      <!-- ── GENERATED MODE ─────────────────────────────────────────────── -->
      <template v-if="builderMode === 'generated'">
        <div class="mb-6 grid gap-4 sm:grid-cols-3">
          <!-- Primary -->
          <MColorPicker
            v-model="primaryHex"
            label="Primary (seed)"
            field-bg="var(--color-surface-container)"
          />

          <!-- Secondary -->
          <div>
            <MColorPicker
              v-model="secondaryHex"
              :label="autoSecondary ? 'Secondary (auto)' : 'Secondary'"
              field-bg="var(--color-surface-container)"
              :disabled="autoSecondary"
            />
            <MCheckbox v-model="autoSecondary" label="Derive automatically" class="mt-1.5 px-1 text-label-small text-on-surface-variant" />
          </div>

          <!-- Tertiary -->
          <div>
            <MColorPicker
              v-model="tertiaryHex"
              :label="autoTertiary ? 'Tertiary (auto)' : 'Tertiary'"
              field-bg="var(--color-surface-container)"
              :disabled="autoTertiary"
            />
            <MCheckbox v-model="autoTertiary" label="Derive automatically" class="mt-1.5 px-1 text-label-small text-on-surface-variant" />
          </div>
        </div>

        <!-- Token swatches preview -->
        <div class="mb-6 space-y-3">
          <p class="text-label-large font-medium">Generated tokens</p>
          <div class="flex flex-wrap gap-x-6 gap-y-3">
            <div v-for="g in swatchGroups" :key="g.label">
              <p class="mb-1.5 text-label-small text-on-surface-variant">{{ g.label }}</p>
              <div class="flex gap-1.5">
                <div v-for="t in g.tokens" :key="t.key" class="flex flex-col items-center gap-1">
                  <div class="flex">
                    <MTooltip :rich="true" :text="t.key" placement="top" :delay="300">
                      <div
                        class="h-8 w-7 cursor-default rounded-l-full border border-outline-variant/50"
                        :style="{ backgroundColor: tokenColor(t.key, false) }"
                      />
                      <template #content>
                        <div class="flex flex-col gap-0.5">
                          <span class="text-label-small text-on-surface-variant">Light</span>
                          <span class="font-mono text-body-small">{{ tokenColor(t.key, false) }}</span>
                        </div>
                      </template>
                    </MTooltip>
                    <MTooltip :rich="true" :text="t.key" placement="top" :delay="300">
                      <div
                        class="h-8 w-7 cursor-default rounded-r-full border border-outline-variant/50"
                        :style="{ backgroundColor: tokenColor(t.key, true) }"
                      />
                      <template #content>
                        <div class="flex flex-col gap-0.5">
                          <span class="text-label-small text-on-surface-variant">Dark</span>
                          <span class="font-mono text-body-small">{{ tokenColor(t.key, true) }}</span>
                        </div>
                      </template>
                    </MTooltip>
                  </div>
                  <span class="text-center text-on-surface-variant" style="font-size:9px; line-height:1.2">{{ t.label }}</span>
                </div>
              </div>
            </div>
          </div>
          <p class="text-label-small text-on-surface-variant">Left half = light · Right half = dark</p>
        </div>
      </template>

      <!-- ── MANUAL MODE ────────────────────────────────────────────────── -->
      <template v-else>
        <div class="mb-5">
          <p class="mb-1 text-label-medium text-on-surface-variant">
            Edit each token individually. Initialized from generated values.
          </p>
          <MSegmentedButton v-model="themeMode" :options="themeModeOptions" class="mt-3" />
        </div>

        <div class="mb-4 space-y-6">
          <div v-for="group in TOKEN_GROUPS" :key="group.label">
            <!-- Group header -->
            <div class="mb-3 flex items-center justify-between">
              <p class="text-label-large font-medium">{{ group.label }}</p>
              <button
                type="button"
                class="flex items-center gap-1 text-label-small text-primary hover:underline"
                @click="resetGroup(group.tokens)"
              >
                <MIcon name="refresh" :size="14" />
                Reset group
              </button>
            </div>

            <!-- Token pickers -->
            <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <MColorPicker
                v-for="token in group.tokens"
                :key="token + themeMode"
                :model-value="getManualToken(token)"
                :label="token"
                field-bg="var(--color-surface-container)"
                @update:model-value="setManualToken(token, $event)"
              />
            </div>
          </div>
        </div>

        <!-- Reset all -->
        <div class="mb-2 flex justify-end">
          <MButton variant="text" @click="seedManual">
            <MIcon name="refresh" :size="16" />
            Reset all from generated
          </MButton>
        </div>
      </template>

      <!-- ── Actions ────────────────────────────────────────────────────── -->
      <div class="flex flex-wrap items-center gap-3 border-t border-outline-variant pt-4">
        <MButton v-if="!isPreviewing" @click="applyPreview">
          <MIcon name="visibility" :size="18" />
          Preview on page
        </MButton>
        <MButton v-else variant="tonal" color="error" @click="clearPreview">
          <MIcon name="visibility_off" :size="18" />
          Remove preview
        </MButton>
      </div>
    </MCard>

    <!-- CSS export -->
    <div class="mb-2 flex items-center justify-between">
      <p class="text-label-large font-medium">Generated CSS</p>
      <MButton variant="tonal" @click="copyCSS">
        <MIcon :name="copied ? 'check' : 'content_copy'" :size="16" />
        {{ copied ? 'Copied!' : 'Copy' }}
      </MButton>
    </div>
    <MCodeEditor
      :model-value="generatedCss"
      language="css"
      :readonly="true"
      :line-numbers="true"
      min-height="200px"
      max-height="600px"
    />
  </div>
</template>
