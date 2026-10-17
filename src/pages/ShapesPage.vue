<script setup lang="ts">
import { MCard } from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'

// M3's corner scale (ShapeKeyTokens), with the three steps Material 3 Expressive added
const scale = [
  { token: 'None', cls: 'rounded-none', px: 0 },
  { token: 'Extra small', cls: 'rounded-xs', px: 4 },
  { token: 'Small', cls: 'rounded-sm', px: 8 },
  { token: 'Medium', cls: 'rounded-md', px: 12 },
  { token: 'Large', cls: 'rounded-lg', px: 16 },
  { token: 'Large increased', cls: 'rounded-lg-increased', px: 20, expressive: true },
  { token: 'Extra large', cls: 'rounded-xl', px: 28 },
  { token: 'Extra large increased', cls: 'rounded-xl-increased', px: 32, expressive: true },
  { token: 'Extra extra large', cls: 'rounded-xxl', px: 48, expressive: true },
  { token: 'Full', cls: 'rounded-full', px: null },
]

const tokensCode = `/* theme.css */
@theme {
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-lg-increased: 20px;
  --radius-xl: 28px;
  --radius-xl-increased: 32px;
  --radius-xxl: 48px;
}`

const usageCode = `<div class="rounded-xl-increased bg-surface-container-high p-6">…</div>

<!-- One corner, or one side -->
<div class="rounded-t-xxl rounded-b-xs">…</div>

<!-- In your own CSS -->
.hero { border-radius: var(--radius-xxl); }`
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Shapes</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Material 3's corner radius scale, as Tailwind utilities and CSS variables. Components use it for their own
      corners; use the same steps in your markup so custom surfaces match them.
    </p>

    <h2 class="mb-4 text-headline-small font-medium">Corner scale</h2>
    <p class="mb-4 text-body-medium text-on-surface-variant">
      Each step is a <code>rounded-*</code> class (and <code>rounded-t-*</code>, <code>rounded-s-*</code> and the
      other sides and corners). The three marked <em>Expressive</em> come from Material 3 Expressive, which
      rounds containers more. The largest is <code>xxl</code>, not <code>2xl</code>: <code>rounded-2xl</code> and
      <code>rounded-3xl</code> stay Tailwind's own 16px and 24px.
    </p>
    <MCard class="mb-10 overflow-hidden">
      <div
        v-for="s in scale"
        :key="s.cls"
        class="flex items-center gap-4 border-b border-outline-variant px-4 py-3 last:border-b-0"
      >
        <div :class="s.cls" class="h-14 w-20 shrink-0 bg-primary-container" />
        <div class="min-w-0 flex-1">
          <p class="text-title-small">
            {{ s.token }}
            <span v-if="s.expressive" class="ml-1 rounded-full bg-tertiary-container px-2 py-0.5 text-label-small text-on-tertiary-container">Expressive</span>
          </p>
          <code class="text-label-medium text-primary">{{ s.cls }}</code>
        </div>
        <span class="shrink-0 text-label-large text-on-surface-variant">{{ s.px === null ? '50%' : `${s.px}px` }}</span>
      </div>
    </MCard>

    <h2 class="mb-4 text-headline-small font-medium">Tokens</h2>
    <p class="mb-3 text-body-medium text-on-surface-variant">
      Defined in the library's <code>theme.css</code>. Override any of them in your own <code>@theme</code> block,
      after the imports, to change every component and utility that uses it.
    </p>
    <MCodeEditor :model-value="tokensCode" language="css" :readonly="true" :line-numbers="false" min-height="50px" max-height="260px" class="mb-6" />

    <h2 class="mb-4 text-headline-small font-medium">Using them</h2>
    <MCodeEditor :model-value="usageCode" language="vue" :readonly="true" :line-numbers="false" min-height="50px" max-height="200px" class="mb-6" />

    <p class="text-body-medium text-on-surface-variant">
      For M3 Expressive's other shapes (cookie, clover, flower, sunny and the rest), with morphing between them,
      see <RouterLink to="/components/layout/mshape" class="text-primary underline">MShape</RouterLink>.
    </p>
  </div>
</template>
