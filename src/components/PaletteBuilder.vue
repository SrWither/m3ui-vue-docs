<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { MCard, MButton, MIcon, MSegmentedButton, MTooltip, MCheckbox, MTextField, useDevice, generateScheme } from '@m3ui-vue/m3ui-vue'
import type { SegmentedOption, GeneratedScheme } from '@m3ui-vue/m3ui-vue'
import { MColorPicker, MColorPickerModal } from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'

const { isMobile } = useDevice()

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
  {
    label: 'Fixed',
    tokens: [
      'primary-fixed', 'primary-fixed-dim', 'on-primary-fixed', 'on-primary-fixed-variant',
      'secondary-fixed', 'secondary-fixed-dim', 'on-secondary-fixed', 'on-secondary-fixed-variant',
      'tertiary-fixed', 'tertiary-fixed-dim', 'on-tertiary-fixed', 'on-tertiary-fixed-variant',
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

// The scheme comes from the library's dynamic color (Google's material-color-utilities, tonal spot). A custom
// secondary or tertiary color takes the key-color roles of a scheme seeded with it, the way Material Theme
// Builder treats extra key colors.
const generated = ref<GeneratedScheme>({ light: {}, dark: {} })
const KEY_ROLES = ['', 'on-', '-container', 'on--container', '-fixed', '-fixed-dim', 'on--fixed', 'on--fixed-variant']
const roleName = (pattern: string, key: string) =>
  pattern.startsWith('on-') ? `on-${key}${pattern.slice(3)}` : `${key}${pattern}`

function borrowKeyRoles(target: GeneratedScheme, from: GeneratedScheme, key: 'secondary' | 'tertiary') {
  for (const mode of ['light', 'dark'] as const) {
    for (const pattern of KEY_ROLES) {
      const value = from[mode][roleName(pattern, 'primary')]
      if (value) target[mode][roleName(pattern, key)] = value
    }
  }
}

let generation = 0
watch([primaryHex, autoSecondary, secondaryHex, autoTertiary, tertiaryHex], async () => {
  const mine = ++generation
  const scheme = await generateScheme(primaryHex.value)
  if (!autoSecondary.value) borrowKeyRoles(scheme, await generateScheme(secondaryHex.value), 'secondary')
  if (!autoTertiary.value) borrowKeyRoles(scheme, await generateScheme(tertiaryHex.value), 'tertiary')
  if (mine === generation) generated.value = scheme
}, { immediate: true })

const effectiveSecondaryHex = computed(() => (autoSecondary.value ? generated.value.light.secondary ?? '' : secondaryHex.value))
const effectiveTertiaryHex = computed(() => (autoTertiary.value ? generated.value.light.tertiary ?? '' : tertiaryHex.value))

const generatedLight = computed(() => generated.value.light)
const generatedDark  = computed(() => generated.value.dark)

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

// ── Modal state (mobile) ──────────────────────────────────────────────────────

const showPrimaryModal   = ref(false)
const showSecondaryModal = ref(false)
const showTertiaryModal  = ref(false)
const showManualModal    = ref(false)
const activeManualToken  = ref('')

function openManualModal(token: string) {
  activeManualToken.value = token
  showManualModal.value = true
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
          <MTextField
            v-model="paletteName"
            label="Palette name"
            placeholder="my-brand"
            variant="outlined"
            field-bg="var(--color-surface-container)"
          />
        </div>
        <MSegmentedButton v-model="builderMode" :options="modeOptions" />
      </div>

      <!-- ── GENERATED MODE ─────────────────────────────────────────────── -->
      <template v-if="builderMode === 'generated'">
        <div class="mb-6 grid gap-4 sm:grid-cols-3">
          <!-- Primary -->
          <div>
            <template v-if="!isMobile">
              <MColorPicker
                v-model="primaryHex"
                label="Primary (seed)"
                field-bg="var(--color-surface-container)"
              />
            </template>
            <template v-else>
              <button
                type="button"
                class="flex w-full items-center gap-3 rounded-lg border border-outline-variant bg-surface-container p-3 text-left"
                @click="showPrimaryModal = true"
              >
                <div class="h-9 w-9 shrink-0 rounded-full border border-outline-variant/50 shadow-sm" :style="{ backgroundColor: primaryHex }" />
                <div class="min-w-0">
                  <p class="text-label-large font-medium">Primary (seed)</p>
                  <p class="font-mono text-label-small text-on-surface-variant">{{ primaryHex }}</p>
                </div>
                <MIcon name="colorize" :size="18" class="ml-auto shrink-0 text-on-surface-variant" />
              </button>
              <MColorPickerModal v-model="primaryHex" v-model:show="showPrimaryModal" title="Primary (seed)" />
            </template>
          </div>

          <!-- Secondary -->
          <div>
            <template v-if="!isMobile">
              <MColorPicker
                v-model="secondaryHex"
                :label="autoSecondary ? 'Secondary (auto)' : 'Secondary'"
                field-bg="var(--color-surface-container)"
                :disabled="autoSecondary"
              />
            </template>
            <template v-else>
              <button
                type="button"
                class="flex w-full items-center gap-3 rounded-lg border border-outline-variant bg-surface-container p-3 text-left"
                :class="autoSecondary ? 'opacity-50 pointer-events-none' : ''"
                @click="showSecondaryModal = true"
              >
                <div class="h-9 w-9 shrink-0 rounded-full border border-outline-variant/50 shadow-sm" :style="{ backgroundColor: effectiveSecondaryHex }" />
                <div class="min-w-0">
                  <p class="text-label-large font-medium">{{ autoSecondary ? 'Secondary (auto)' : 'Secondary' }}</p>
                  <p class="font-mono text-label-small text-on-surface-variant">{{ effectiveSecondaryHex }}</p>
                </div>
                <MIcon name="colorize" :size="18" class="ml-auto shrink-0 text-on-surface-variant" />
              </button>
              <MColorPickerModal v-model="secondaryHex" v-model:show="showSecondaryModal" title="Secondary" />
            </template>
            <MCheckbox v-model="autoSecondary" label="Derive automatically" class="mt-1.5 px-1" />
          </div>

          <!-- Tertiary -->
          <div>
            <template v-if="!isMobile">
              <MColorPicker
                v-model="tertiaryHex"
                :label="autoTertiary ? 'Tertiary (auto)' : 'Tertiary'"
                field-bg="var(--color-surface-container)"
                :disabled="autoTertiary"
              />
            </template>
            <template v-else>
              <button
                type="button"
                class="flex w-full items-center gap-3 rounded-lg border border-outline-variant bg-surface-container p-3 text-left"
                :class="autoTertiary ? 'opacity-50 pointer-events-none' : ''"
                @click="showTertiaryModal = true"
              >
                <div class="h-9 w-9 shrink-0 rounded-full border border-outline-variant/50 shadow-sm" :style="{ backgroundColor: effectiveTertiaryHex }" />
                <div class="min-w-0">
                  <p class="text-label-large font-medium">{{ autoTertiary ? 'Tertiary (auto)' : 'Tertiary' }}</p>
                  <p class="font-mono text-label-small text-on-surface-variant">{{ effectiveTertiaryHex }}</p>
                </div>
                <MIcon name="colorize" :size="18" class="ml-auto shrink-0 text-on-surface-variant" />
              </button>
              <MColorPickerModal v-model="tertiaryHex" v-model:show="showTertiaryModal" title="Tertiary" />
            </template>
            <MCheckbox v-model="autoTertiary" label="Derive automatically" class="mt-1.5 px-1" />
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
                    <MTooltip :text="`${t.key} · ${tokenColor(t.key, false)}`" placement="top" :delay="200">
                      <div
                        class="h-8 w-7 cursor-default rounded-l-full border border-outline-variant/50"
                        :style="{ backgroundColor: tokenColor(t.key, false) }"
                      />
                    </MTooltip>
                    <MTooltip :text="`${t.key} (dark) · ${tokenColor(t.key, true)}`" placement="top" :delay="200">
                      <div
                        class="h-8 w-7 cursor-default rounded-r-full border border-outline-variant/50"
                        :style="{ backgroundColor: tokenColor(t.key, true) }"
                      />
                    </MTooltip>
                  </div>
                  <span class="text-center text-label-small text-on-surface-variant">{{ t.label }}</span>
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
              <MButton variant="text" @click="resetGroup(group.tokens)">
                <MIcon name="refresh" :size="14" />
                Reset group
              </MButton>
            </div>

            <!-- Token pickers -->
            <template v-if="!isMobile">
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
            </template>
            <template v-else>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="token in group.tokens"
                  :key="token + themeMode"
                  type="button"
                  class="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container px-3 py-2 text-left"
                  @click="openManualModal(token)"
                >
                  <div class="h-7 w-7 shrink-0 rounded-full border border-outline-variant/50" :style="{ backgroundColor: getManualToken(token) }" />
                  <div class="min-w-0">
                    <p class="truncate text-label-small font-medium">{{ token }}</p>
                    <p class="font-mono text-label-small text-on-surface-variant">{{ getManualToken(token) }}</p>
                  </div>
                </button>
              </div>
            </template>
          </div>
        </div>

        <!-- Reset all -->
        <div class="mb-2 flex justify-end">
          <MButton variant="text" @click="seedManual">
            <MIcon name="refresh" :size="16" />
            Reset all from generated
          </MButton>
        </div>

        <!-- Shared modal for mobile manual editing -->
        <MColorPickerModal
          v-if="isMobile"
          :model-value="getManualToken(activeManualToken)"
          v-model:show="showManualModal"
          :title="activeManualToken"
          @update:model-value="setManualToken(activeManualToken, $event)"
        />
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
