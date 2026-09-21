<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  MButton, MCard, MIcon, MChip, MFab,
  MIconButton, MAvatar, MProgressBar, MSpinner,
  MAlert, MTooltip, MRating, MExpansionPanel, useToast,
  MStack, MFlex, MGrid, MDivider, MTree,
  MEmoji, MEmojiButton, MDialog,
  MDatePicker, MColorPicker, MTagInput,
  useTheme, useColorPalette,
} from '@m3ui-vue/m3ui-vue'
import type { TreeNode } from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'
import { MMarkdown } from '@m3ui-vue/m3ui-vue/markdown'
import { MQRCode } from '@m3ui-vue/m3ui-vue/qrcode'
import { MBarcode } from '@m3ui-vue/m3ui-vue/barcode'
import { activeLocaleId, localeOptions, setSiteLocale } from '@/composables/useSiteLocale'
import { onMounted, onUnmounted } from 'vue'

const version = ref('')
onMounted(async () => {
  try {
    const res = await fetch('https://registry.npmjs.org/@m3ui-vue/m3ui-vue/latest')
    const data = await res.json()
    version.value = data.version
  } catch { /* fallback: chip hidden via v-if */ }
})

// Hero blobs: driven by continuous sine/cosine functions on a rAF loop instead of CSS
// @keyframes — a handful of keyframe waypoints (even many of them) is still a finite set of
// sampled points with a direction change at every one, which reads as a subtle stutter/tremble
// no matter the easing. A real trig function has no waypoints to begin with, so there's nothing
// to be discontinuous at — this is the same "real per-frame motion, not CSS" convention the
// library's own spring-driven components (MProgressBar, MTabs, etc.) already follow.
const blob1 = ref<HTMLElement | null>(null)
const blob2 = ref<HTMLElement | null>(null)
const blob3 = ref<HTMLElement | null>(null)
let blobRafId = 0
onMounted(() => {
  const start = performance.now()
  const TAU = Math.PI * 2
  function tick(now: number) {
    const t = (now - start) / 1000
    // Rounded to whole pixels — Firefox's compositor visibly shimmers on large, low-contrast,
    // blurred-looking elements (these are 10%-opacity 192-320px circles) driven by continuously
    // varying sub-pixel transform values, even though the underlying motion is smooth math.
    if (blob1.value) {
      const x = Math.round(Math.sin(t * (TAU / 13)) * 26)
      const y = Math.round(Math.cos(t * (TAU / 9)) * 20)
      const s = 1 + Math.sin(t * (TAU / 7)) * 0.06
      blob1.value.style.transform = `translate(${x}px, ${y}px) scale(${s})`
    }
    if (blob2.value) {
      const x = Math.round(Math.cos(t * (TAU / 15)) * -22)
      const y = Math.round(Math.sin(t * (TAU / 11)) * 18)
      const s = 1 + Math.cos(t * (TAU / 8.5)) * 0.08
      blob2.value.style.transform = `translate(${x}px, ${y}px) scale(${s})`
    }
    if (blob3.value) {
      const x = Math.round(Math.sin(t * (TAU / 18) + 1) * 20)
      const y = Math.round(Math.cos(t * (TAU / 12.5) + 1) * 16)
      const s = 1 + Math.sin(t * (TAU / 10)) * 0.1
      blob3.value.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${s})`
    }
    blobRafId = requestAnimationFrame(tick)
  }
  blobRafId = requestAnimationFrame(tick)
})
onUnmounted(() => cancelAnimationFrame(blobRafId))

const toast = useToast()
const { theme, cycle } = useTheme()
const { palette, palettes: paletteList, set: setPalette } = useColorPalette()

const themeIcon = computed(() =>
  theme.value === 'dark' ? 'dark_mode' : theme.value === 'light' ? 'light_mode' : 'brightness_auto',
)

const ratingVal = ref(4)
const panelOpen = ref(true)
const panelFreeOpen = ref(false)
const pickedEmoji = ref('')
const dialogOpen = ref(false)

const pickedDate = ref<string | null>(null)
const pickedColor = ref('#6750a4')
const tags = ref(['vue', 'm3'])

const sampleCode = ref(`import { MButton, MCard } from '@m3ui-vue/m3ui-vue'

function App() {
  const count = ref(0)
  return { count }
}`)

const markdownDemo = `## Markdown Preview

Supports **bold**, *italic*, and \`inline code\`.

\`\`\`typescript copy {2}
const greeting = "Hello!"
console.log(greeting)
\`\`\`

> Syntax colors adapt to the active palette.

| Feature | Status |
|---------|--------|
| Dark mode | Ready |
| Palettes | 40 built-in |`


const projectTree: TreeNode[] = [
  {
    id: 'src', label: 'src', icon: 'folder', children: [
      {
        id: 'components', label: 'components', icon: 'folder', children: [
          { id: 'MButton', label: 'MButton.vue', icon: 'description' },
          { id: 'MCard', label: 'MCard.vue', icon: 'description' },
          { id: 'MDialog', label: 'MDialog.vue', icon: 'description' },
          { id: 'MTree', label: 'MTree.vue', icon: 'description' },
        ],
      },
      {
        id: 'composables', label: 'composables', icon: 'folder', children: [
          { id: 'useTheme', label: 'useTheme.ts', icon: 'description' },
          { id: 'useColorPalette', label: 'useColorPalette.ts', icon: 'description' },
        ],
      },
      { id: 'indexts', label: 'index.ts', icon: 'description' },
    ],
  },
  { id: 'packagejson', label: 'package.json', icon: 'description' },
]

const categories = [
  { label: 'Buttons & Actions', icon: 'smart_button', count: 8, to: '/components/buttons' },
  { label: 'Inputs & Forms', icon: 'input', count: 23, to: '/components/inputs' },
  { label: 'Data Display', icon: 'dashboard', count: 20, to: '/components/data-display' },
  { label: 'Feedback', icon: 'feedback', count: 11, to: '/components/feedback' },
  { label: 'Navigation', icon: 'menu_open', count: 13, to: '/components/navigation' },
  { label: 'Layout', icon: 'grid_view', count: 26, to: '/components/layout' },
  { label: 'Overlays', icon: 'layers', count: 5, to: '/components/overlays' },
  { label: 'Tables', icon: 'table_chart', count: 4, to: '/components/tables' },
  { label: 'Utility', icon: 'build', count: 7, to: '/components/utility' },
  { label: 'Editors', icon: 'code', count: 6, to: '/components/editors' },
  { label: 'Advanced', icon: 'auto_awesome', count: 9, to: '/components/advanced' },
]
</script>

<template>
  <MStack gap="xl">
    <!-- ══ HERO ══════════════════════════════════════════════════ -->
    <section class="relative overflow-hidden rounded-2xl bg-primary-container px-6 py-16 text-center md:px-12 md:py-20">
      <div class="absolute inset-0 opacity-10">
        <div ref="blob1" class="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-primary will-change-transform" />
        <div ref="blob2" class="absolute -right-16 -bottom-16 h-80 w-80 rounded-full bg-tertiary will-change-transform" />
        <div ref="blob3" class="absolute top-1/2 left-1/2 h-48 w-48 rounded-full bg-secondary will-change-transform" style="transform: translate(-50%, -50%)" />
      </div>

      <MStack align="center" gap="md" class="relative">
        <MFlex align="center" gap="sm">
          <span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-elevation-2">
            <MIcon name="widgets" :size="32" class="text-on-primary" />
          </span>
          <h1 class="text-display-small font-bold text-on-primary-container md:text-display-medium">M3UI Vue</h1>
        </MFlex>

        <p class="max-w-2xl text-title-medium text-on-primary-container/80">
          135+ Material Design 3 components for Vue 3 + Tailwind CSS v4.
          Beautiful, accessible, tree-shakeable. With 40 color palettes, dark mode, i18n, and full TypeScript support.
        </p>

        <MFlex gap="sm" wrap class="mt-2 justify-center">
          <router-link to="/getting-started/setup">
            <MButton icon="rocket_launch">Get Started</MButton>
          </router-link>
          <router-link to="/components/buttons">
            <MButton variant="tonal" icon="widgets">Components</MButton>
          </router-link>
          <a href="https://github.com/SrWither/m3ui-vue" target="_blank">
            <MButton variant="outlined" icon="open_in_new">GitHub</MButton>
          </a>
        </MFlex>

        <!-- Stats -->
        <MFlex gap="sm" wrap class="mt-4 justify-center">
          <MChip v-if="version" icon="new_releases" tone="primary">v{{ version }}</MChip>
          <MChip icon="widgets" tone="primary">135+ Components</MChip>
          <MChip icon="palette" tone="secondary">40 Palettes</MChip>
          <MChip icon="dark_mode" tone="tertiary">Dark Mode</MChip>
          <MChip icon="code">TypeScript</MChip>
        </MFlex>
      </MStack>
    </section>

    <!-- ══ DOCS NOTICE ════════════════════════════════════════════ -->
    <MAlert variant="outlined" tone="warning" icon="construction" :closable="false">
      <strong>Documentation in progress</strong> — These docs are still being built out.
      Some components, props, events, and slots may exist in the library but are not yet documented here.
      If something seems missing, check the source types or open an issue on GitHub.
    </MAlert>

    <!-- ══ BENTO ROW A — theme switcher (wide) + stats (narrow) ══ -->
    <section>
      <MGrid :cols="1" :md="3" gap="md">
        <MCard variant="outlined" class="p-6 md:col-span-2">
          <MFlex align="center" gap="sm" class="mb-1">
            <MIcon name="palette" :size="24" class="text-primary" />
            <h2 class="text-title-large font-medium">Live Theme Switching</h2>
          </MFlex>
          <p class="mb-4 text-body-medium text-on-surface-variant">
            Pick a color — the entire page updates instantly. Works with dark mode too.
          </p>
          <MFlex align="center" justify="between" class="mb-3">
            <span class="text-title-small font-medium">Active palette</span>
            <MIconButton :icon="themeIcon" label="Toggle theme" @click="cycle" />
          </MFlex>
          <div class="mx-auto grid grid-cols-10 gap-2" style="max-width: 440px">
            <MTooltip v-for="p in paletteList" :key="p.id" :text="p.label">
              <button
                type="button"
                class="flex aspect-square w-full cursor-pointer items-center justify-center rounded-full transition-all duration-150 hover:scale-110"
                :class="palette.value === p.id ? 'ring-2 ring-on-surface ring-offset-2 ring-offset-surface scale-110' : ''"
                :style="{ backgroundColor: p.seed }"
                @click="setPalette(p.id)"
              >
                <MIcon v-if="palette.value === p.id" name="check" :size="18" class="text-white" />
              </button>
            </MTooltip>
          </div>
          <MFlex gap="sm" wrap justify="center" class="mt-5">
            <MButton>Primary</MButton>
            <MButton variant="tonal">Tonal</MButton>
            <MButton variant="outlined">Outlined</MButton>
            <MButton color="error">Error</MButton>
            <MFab icon="add" size="small" />
          </MFlex>
        </MCard>

        <MCard variant="outlined" class="p-5">
          <MFlex align="center" gap="sm" class="mb-1">
            <MIcon name="translate" :size="22" class="text-primary" />
            <h3 class="text-title-medium font-medium">Pick a Language</h3>
          </MFlex>
          <p class="mb-3 text-body-small text-on-surface-variant">
            Switches every component's built-in strings — dates, validation, empty states — live. This page's own text stays in English for now.
          </p>
          <MStack gap="0">
            <button
              v-for="l in localeOptions"
              :key="l.id"
              type="button"
              class="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-2 text-left text-body-medium transition-colors hover:bg-on-surface/8"
              @click="setSiteLocale(l.id)"
            >
              <span>{{ l.label }}</span>
              <MIcon v-if="activeLocaleId === l.id" name="check_circle" :size="18" class="text-primary" />
            </button>
          </MStack>
        </MCard>
      </MGrid>
    </section>

    <!-- ══ COMPONENT CATEGORIES ══════════════════════════════════ -->
    <section>
      <MStack gap="md">
        <MFlex align="center" gap="sm">
          <MIcon name="apps" :size="28" class="text-primary" />
          <h2 class="text-headline-small font-medium">Component Library</h2>
        </MFlex>

        <MStack gap="sm">
          <div v-for="(row, ri) in [categories.slice(0, 4), categories.slice(4, 8), categories.slice(8)]" :key="ri"
            class="flex flex-wrap justify-center gap-3"
          >
            <router-link v-for="cat in row" :key="cat.label" :to="cat.to" class="w-[calc(50%-0.375rem)] sm:w-[calc(25%-0.5625rem)] no-underline">
              <MCard clickable class="flex h-full flex-col items-center gap-2 p-4 text-center">
                <MIcon :name="cat.icon" :size="28" class="text-primary" />
                <span class="text-label-large font-medium">{{ cat.label }}</span>
                <MChip size="small">{{ cat.count }}</MChip>
              </MCard>
            </router-link>
          </div>
        </MStack>
      </MStack>
    </section>

    <!-- ══ EDITORS SHOWCASE ══════════════════════════════════════ -->
    <section>
      <MStack gap="md">
        <MFlex align="center" gap="sm">
          <MIcon name="code" :size="28" class="text-primary" />
          <h2 class="text-headline-small font-medium">Code & Markdown</h2>
        </MFlex>
        <p class="text-body-large text-on-surface-variant">
          Built-in code editor with syntax highlighting, and a markdown renderer with copy buttons and line highlights — all styled to match the active palette.
        </p>

        <MGrid :cols="1" :md="2" gap="md">
          <MCodeEditor v-model="sampleCode" language="typescript" min-height="220px" max-height="600px" class="h-full" />
          <MCard variant="outlined" class="overflow-hidden p-5">
            <MMarkdown :source="markdownDemo" />
          </MCard>
        </MGrid>
      </MStack>
    </section>

    <!-- ══ BENTO ROW B — file tree (wide) + codes (narrow) ══ -->
    <section>
      <MGrid :cols="1" :md="3" gap="md">
        <MCard variant="outlined" class="p-5 md:col-span-2">
          <MFlex align="center" gap="sm" class="mb-4">
            <MIcon name="account_tree" :size="24" class="text-primary" />
            <h2 class="text-title-large font-medium">Familiar Building Blocks</h2>
          </MFlex>
          <MTree :nodes="projectTree" :default-expanded="['src', 'components']" />
        </MCard>

        <MCard variant="outlined" class="flex flex-col items-center gap-4 p-5">
          <MFlex align="center" gap="sm" class="w-full">
            <MIcon name="qr_code_2" :size="24" class="text-primary" />
            <h2 class="text-title-medium font-medium">Generate Codes</h2>
          </MFlex>
          <MQRCode value="https://github.com/SrWither/m3ui-vue" :size="120" label="M3UI Vue on GitHub" />
          <MBarcode value="M3UI-VUE" format="CODE128" :height="50" :width="1.5" />
        </MCard>
      </MGrid>
    </section>

    <!-- ══ BENTO ROW C — pickers + fun/social, 50/50 ══ -->
    <section>
      <MGrid :cols="1" :md="2" gap="md">
        <MCard variant="outlined" class="p-5">
          <MFlex align="center" gap="sm" class="mb-4">
            <MIcon name="tune" :size="24" class="text-primary" />
            <h2 class="text-title-medium font-medium">Pickers & Tags</h2>
          </MFlex>
          <MStack gap="md">
            <MDatePicker v-model="pickedDate" label="Release date" />
            <MColorPicker v-model="pickedColor" label="Brand color" />
            <MTagInput v-model="tags" label="Tags" placeholder="Add a tag…" />
          </MStack>
        </MCard>

        <MCard variant="outlined" class="p-5">
          <MStack gap="md">
            <h2 class="text-title-medium font-medium">Fun Stuff</h2>

            <MFlex align="center" gap="sm" wrap>
              <MEmojiButton emoji="😎" :size="32" category="smileys" @click="(e: string) => pickedEmoji = e" />
              <MEmojiButton emoji="🐱" :size="32" category="animals" @click="(e: string) => pickedEmoji = e" />
              <MEmojiButton emoji="🍕" :size="32" category="food" @click="(e: string) => pickedEmoji = e" />
              <MEmojiButton emoji="🚀" :size="32" category="travel" @click="(e: string) => pickedEmoji = e" />
              <span v-if="pickedEmoji" class="text-headline-medium">{{ pickedEmoji }}</span>
            </MFlex>

            <MDivider />

            <MFlex align="center" gap="sm">
              <div class="flex -space-x-2">
                <MAvatar name="Alice" :size="32" />
                <MAvatar name="Bob" :size="32" />
                <MAvatar name="Carol" :size="32" />
              </div>
              <span class="text-body-small text-on-surface-variant">3 contributors</span>
            </MFlex>

            <MRating v-model="ratingVal" :half-increments="true" />
          </MStack>
        </MCard>
      </MGrid>
    </section>

    <!-- ══ FEEDBACK & OVERLAYS ═══════════════════════════════════ -->
    <section>
      <MStack gap="md">
        <MFlex align="center" gap="sm">
          <MIcon name="notifications_active" :size="28" class="text-primary" />
          <h2 class="text-headline-small font-medium">Feedback & Overlays</h2>
        </MFlex>

        <MGrid :cols="1" :md="2" gap="md">
          <MCard class="p-5">
            <MStack gap="sm">
              <MAlert type="success" title="Saved!">Your changes are live.</MAlert>
              <MAlert type="warning" title="Heads up">API rate limit approaching.</MAlert>
              <MAlert type="error" title="Error">Connection failed. Retrying...</MAlert>
              <MFlex gap="sm" wrap>
                <MButton variant="tonal" icon="check_circle" @click="toast.success('Success!')">Success</MButton>
                <MButton variant="tonal" icon="info" @click="toast.info('FYI: new update available')">Info</MButton>
                <MButton variant="tonal" icon="error" color="error" @click="toast.error('Something broke')">Error</MButton>
              </MFlex>
            </MStack>
          </MCard>

          <MCard class="p-5">
            <MStack gap="md">
              <h3 class="text-title-medium font-medium">Dialogs & More</h3>
              <MButton icon="open_in_new" @click="dialogOpen = true">Open Dialog</MButton>
              <MFlex align="center" gap="md">
                <MSpinner :size="24" />
                <MSpinner :size="24" wavy />
                <MProgressBar :indeterminate="true" class="flex-1" color="tertiary" />
              </MFlex>
              <MStack gap="sm">
                <MExpansionPanel v-model="panelOpen" title="What is M3UI?" icon="help">
                  A Material Design 3 component library for Vue 3 + Tailwind CSS v4 with 135+ components.
                </MExpansionPanel>
                <MExpansionPanel v-model="panelFreeOpen" title="Is it free?" icon="payments">
                  Absolutely! M3UI Vue is MIT licensed — use it in personal projects, commercial apps, SaaS products, or anything else. No attribution required, no strings attached.
                </MExpansionPanel>
              </MStack>
            </MStack>
          </MCard>
        </MGrid>
      </MStack>
    </section>

    <!-- ══ CTA ═══════════════════════════════════════════════════ -->
    <section class="overflow-hidden rounded-2xl bg-primary px-8 py-12 text-center md:px-12">
      <MStack align="center" gap="md">
        <MIcon name="rocket_launch" :size="44" class="text-on-primary" />
        <h2 class="text-headline-medium font-medium text-on-primary">Ready to build?</h2>
        <p class="max-w-lg text-body-large text-on-primary/80">
          Install in seconds. Start building beautiful, accessible Material 3 interfaces with Vue 3.
        </p>
        <MFlex gap="sm" class="mt-2">
          <router-link to="/getting-started/setup">
            <MButton variant="tonal" icon="build">Setup Guide</MButton>
          </router-link>
          <router-link to="/styles/palettes">
            <MButton variant="tonal" icon="palette">Palettes</MButton>
          </router-link>
        </MFlex>
      </MStack>
    </section>

    <!-- Dialog demo -->
    <MDialog v-model="dialogOpen" title="Welcome!">
      <MStack gap="sm">
        <MFlex align="center" gap="sm">
          <MEmoji emoji="👋" :size="32" />
          <p class="text-body-medium text-on-surface-variant">
            This is a Material 3 dialog. It supports a title, custom content, and action buttons.
          </p>
        </MFlex>
      </MStack>
      <template #actions>
        <MButton variant="text" @click="dialogOpen = false">Close</MButton>
        <MButton @click="dialogOpen = false; toast.success('Nice!')">Got it</MButton>
      </template>
    </MDialog>
  </MStack>
</template>

