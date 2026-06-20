<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  MButton, MCard, MIcon, MTextField, MSwitch, MChip, MFab,
  MIconButton, MBadge, MAvatar, MSelect, MProgressBar, MSpinner,
  MAlert, MTooltip, MSlider, MRating, MExpansionPanel, useToast,
  MStack, MFlex, MGrid, MCenter, MDivider, MCheckbox,
  MEmoji, MEmojiButton, MEmojiSelector, MDialog,
  useTheme, useColorPalette,
} from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'
import { MMarkdown } from '@m3ui-vue/m3ui-vue/markdown'

const toast = useToast()
const { theme, cycle } = useTheme()
const { palette, palettes: paletteList, set: setPalette } = useColorPalette()

const themeIcon = computed(() =>
  theme.value === 'dark' ? 'dark_mode' : theme.value === 'light' ? 'light_mode' : 'brightness_auto',
)

const email = ref('')
const selectVal = ref<string | number | null>(null)
const notifications = ref(true)
const sliderVal = ref(60)
const ratingVal = ref(4)
const panelOpen = ref(true)
const panelFreeOpen = ref(false)
const pickedEmoji = ref('')
const dialogOpen = ref(false)

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
| Palettes | 20 built-in |`

const todoDone = ref([false, true, false])
const todoItems = ['Ship new release', 'Write tests', 'Update docs']

const categories = [
  { label: 'Buttons & Actions', icon: 'smart_button', count: 4, to: '/components/buttons' },
  { label: 'Inputs & Forms', icon: 'input', count: 13, to: '/components/inputs' },
  { label: 'Data Display', icon: 'dashboard', count: 17, to: '/components/data-display' },
  { label: 'Feedback', icon: 'feedback', count: 7, to: '/components/feedback' },
  { label: 'Navigation', icon: 'menu_open', count: 11, to: '/components/navigation' },
  { label: 'Layout', icon: 'grid_view', count: 21, to: '/components/layout' },
  { label: 'Overlays', icon: 'layers', count: 3, to: '/components/overlays' },
  { label: 'Tables', icon: 'table_chart', count: 4, to: '/components/tables' },
  { label: 'Utility', icon: 'build', count: 6, to: '/components/utility' },
  { label: 'Editors', icon: 'code', count: 6, to: '/components/editors' },
  { label: 'Advanced', icon: 'auto_awesome', count: 6, to: '/components/advanced' },
]
</script>

<template>
  <MStack gap="xl">
    <!-- ══ HERO ══════════════════════════════════════════════════ -->
    <section class="relative overflow-hidden rounded-2xl bg-primary-container px-6 py-16 text-center md:px-12 md:py-20">
      <div class="absolute inset-0 opacity-10">
        <div class="hero-blob absolute -top-20 -left-20 h-64 w-64 rounded-full bg-primary" />
        <div class="hero-blob hero-blob-2 absolute -right-16 -bottom-16 h-80 w-80 rounded-full bg-tertiary" />
        <div class="hero-blob hero-blob-3 absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary" />
      </div>

      <MStack align="center" gap="md" class="relative">
        <MFlex align="center" gap="sm">
          <span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-elevation-2">
            <MIcon name="widgets" :size="32" class="text-on-primary" />
          </span>
          <h1 class="text-display-small font-bold text-on-primary-container md:text-display-medium">M3UI Vue</h1>
        </MFlex>

        <p class="max-w-2xl text-title-medium text-on-primary-container/80">
          70+ Material Design 3 components for Vue 3 + Tailwind CSS v4.
          Beautiful, accessible, tree-shakeable. With 30 color palettes, dark mode, i18n, and full TypeScript support.
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
          <MChip icon="widgets" tone="primary">100+ Components</MChip>
          <MChip icon="palette" tone="secondary">20 Palettes</MChip>
          <MChip icon="dark_mode" tone="tertiary">Dark Mode</MChip>
          <MChip icon="code">TypeScript</MChip>
        </MFlex>
      </MStack>
    </section>

    <!-- ══ LIVE THEME SWITCHER ═══════════════════════════════════ -->
    <section>
      <MStack gap="md">
        <MFlex align="center" gap="sm">
          <MIcon name="palette" :size="28" class="text-primary" />
          <h2 class="text-headline-small font-medium">Live Theme Switching</h2>
        </MFlex>
        <p class="text-body-large text-on-surface-variant">
          Pick a color — the entire page updates instantly. Works with dark mode too.
        </p>

        <MCard variant="outlined" class="p-6">
          <MFlex align="center" justify="between" class="mb-4">
            <span class="text-title-small font-medium">Active palette</span>
            <MIconButton :icon="themeIcon" label="Toggle theme" @click="cycle" />
          </MFlex>
          <div class="mx-auto grid grid-cols-10 gap-2" style="max-width: 440px">
            <MTooltip v-for="p in paletteList" :key="p.id" :text="p.label">
              <button
                type="button"
                class="flex aspect-square w-full cursor-pointer items-center justify-center rounded-full transition-all duration-150 hover:scale-110"
                :class="palette === p.id ? 'ring-2 ring-on-surface ring-offset-2 ring-offset-surface scale-110' : ''"
                :style="{ backgroundColor: p.seed }"
                @click="setPalette(p.id)"
              >
                <MIcon v-if="palette === p.id" name="check" :size="18" class="text-white" />
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
      </MStack>
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
          <MCodeEditor v-model="sampleCode" language="typescript" min-height="220px" max-height="300px" />
          <MCard variant="outlined" class="overflow-hidden p-5">
            <MMarkdown :source="markdownDemo" />
          </MCard>
        </MGrid>
      </MStack>
    </section>

    <!-- ══ INTERACTIVE DEMOS ═════════════════════════════════════ -->
    <section>
      <MStack gap="md">
        <MFlex align="center" gap="sm">
          <MIcon name="touch_app" :size="28" class="text-primary" />
          <h2 class="text-headline-small font-medium">Interactive Components</h2>
        </MFlex>

        <MGrid :cols="1" :md="2" :lg="3" gap="md">
          <!-- Mini todo -->
          <MCard class="p-5">
            <MStack gap="sm">
              <MFlex align="center" justify="between">
                <h3 class="text-title-medium font-medium">Quick Tasks</h3>
                <MBadge :count="todoDone.filter(d => !d).length" color="primary">
                  <MIcon name="checklist" :size="22" class="text-on-surface-variant" />
                </MBadge>
              </MFlex>
              <MStack gap="xs">
                <MFlex v-for="(item, i) in todoItems" :key="i" align="center" gap="sm" class="rounded-lg p-2 transition-colors hover:bg-on-surface/4">
                  <MCheckbox v-model="todoDone[i]!" />
                  <span class="text-body-medium" :class="todoDone[i] ? 'line-through opacity-50' : ''">{{ item }}</span>
                </MFlex>
              </MStack>
              <MProgressBar :value="Math.round(todoDone.filter(d => d).length / todoDone.length * 100)" />
            </MStack>
          </MCard>

          <!-- Inputs showcase -->
          <MCard class="p-5">
            <MStack gap="sm">
              <h3 class="text-title-medium font-medium">Form Controls</h3>
              <MTextField v-model="email" label="Email" leading-icon="mail" variant="outlined" />
              <MSelect
                v-model="selectVal"
                :options="[{ label: 'Vue 3', value: 'vue' }, { label: 'React', value: 'react' }, { label: 'Svelte', value: 'svelte' }]"
                label="Framework"
                variant="outlined"
              />
              <MFlex align="center" justify="between">
                <span class="text-body-medium">Dark mode</span>
                <MSwitch :model-value="theme === 'dark'" @update:model-value="cycle" />
              </MFlex>
              <MSlider v-model="sliderVal" label="Volume" :show-value="true" />
            </MStack>
          </MCard>

          <!-- Emoji + Social card -->
          <MCard class="p-5">
            <MStack gap="md">
              <h3 class="text-title-medium font-medium">Fun Stuff</h3>

              <MFlex align="center" gap="md">
                <MStack align="center" gap="xs">
                  <MEmojiButton emoji="😎" :size="36" category="smileys" @click="(e: string) => pickedEmoji = e" />
                  <span class="text-label-small text-on-surface-variant">Hover me</span>
                </MStack>
                <MEmojiButton emoji="🐱" :size="36" category="animals" @click="(e: string) => pickedEmoji = e" />
                <MEmojiButton emoji="🍕" :size="36" category="food" @click="(e: string) => pickedEmoji = e" />
                <MEmojiButton emoji="🚀" :size="36" category="travel" @click="(e: string) => pickedEmoji = e" />
                <span v-if="pickedEmoji" class="text-headline-large">{{ pickedEmoji }}</span>
              </MFlex>

              <MDivider />

              <MFlex align="center" gap="sm">
                <div class="flex -space-x-2">
                  <MAvatar name="Alice" :size="36" />
                  <MAvatar name="Bob" :size="36" />
                  <MAvatar name="Carol" :size="36" />
                </div>
                <span class="text-body-small text-on-surface-variant">3 contributors</span>
              </MFlex>

              <MRating v-model="ratingVal" :half-increments="true" />
            </MStack>
          </MCard>
        </MGrid>
      </MStack>
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
                  A Material Design 3 component library for Vue 3 + Tailwind CSS v4 with 100+ components.
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

<style>
@keyframes hero-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -20px) scale(1.05); }
  50% { transform: translate(-20px, 15px) scale(0.95); }
  75% { transform: translate(15px, 25px) scale(1.08); }
}
@keyframes hero-float-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(-25px, 20px) scale(1.1); }
  50% { transform: translate(20px, -15px) scale(0.92); }
  75% { transform: translate(-10px, -25px) scale(1.05); }
}
@keyframes hero-float-3 {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  33% { transform: translate(calc(-50% + 25px), calc(-50% - 20px)) scale(1.12); }
  66% { transform: translate(calc(-50% - 20px), calc(-50% + 15px)) scale(0.9); }
}
.hero-blob {
  animation: hero-float 12s ease-in-out infinite;
}
.hero-blob-2 {
  animation: hero-float-2 15s ease-in-out infinite;
}
.hero-blob-3 {
  animation: hero-float-3 18s ease-in-out infinite;
}
</style>
