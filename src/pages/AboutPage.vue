<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { MButton, MCard, MChip, MIcon, MShape, MTimeline } from '@m3ui-vue/m3ui-vue'
import type { ShapeName, TimelineItem } from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'

// Hero decoration: three expressive shapes that keep spring-morphing into the next one.
const cycle: ShapeName[] = ['Cookie9Sided', 'Flower', 'SoftBurst', 'Clover4Leaf', 'Sunny', 'Puffy', 'Gem', 'Cookie6Sided']
const step = ref(0)
const heroShapes = (offset: number) => cycle[(step.value + offset) % cycle.length]
let timer: ReturnType<typeof setInterval> | undefined

// They also drift, like the home hero's blobs: continuous sine/cosine on a rAF loop (no keyframe
// waypoints to stutter at), written to a wrapper so it doesn't touch MShape's own root.
const heroFloaters = [
  { offset: 0, box: '-top-16 -right-10 h-56 w-56 md:h-72 md:w-72', color: 'text-primary opacity-20' },
  { offset: 3, box: '-bottom-14 left-1/3 h-40 w-40', color: 'text-tertiary opacity-25' },
  { offset: 5, box: 'top-8 -left-12 h-32 w-32', color: 'text-secondary opacity-20' },
]
const floaters = ref<HTMLElement[]>([])
const drift = [
  { px: 13, py: 9, ps: 7, ax: 26, ay: 20, as: 0.06, pr: 40, phase: 0 },
  { px: 15, py: 11, ps: 8.5, ax: -22, ay: 18, as: 0.08, pr: -55, phase: 2 },
  { px: 18, py: 12.5, ps: 10, ax: 20, ay: 16, as: 0.1, pr: 70, phase: 1 },
]
let rafId = 0
onMounted(() => {
  timer = setInterval(() => { step.value++ }, 2600)
  const start = performance.now()
  const TAU = Math.PI * 2
  function tick(now: number) {
    const t = (now - start) / 1000
    floaters.value.forEach((el, i) => {
      const d = drift[i]
      const x = Math.sin(t * (TAU / d.px) + d.phase) * d.ax
      const y = Math.cos(t * (TAU / d.py) + d.phase) * d.ay
      const sc = 1 + Math.sin(t * (TAU / d.ps)) * d.as
      const r = (t * 360) / d.pr
      el.style.transform = `translate(${x}px, ${y}px) scale(${sc}) rotate(${r}deg)`
    })
    rafId = requestAnimationFrame(tick)
  }
  rafId = requestAnimationFrame(tick)
})
onBeforeUnmount(() => {
  clearInterval(timer)
  cancelAnimationFrame(rafId)
})

const fromMaterial = [
  { icon: 'widgets', title: 'Core components', text: 'Buttons, FABs, cards, chips, dialogs, sheets, menus, navigation, pickers, text fields, sliders and the rest of the M3 catalog.' },
  { icon: 'palette', title: 'Color system', text: 'Every color role, light and dark schemes, tonal palettes and dynamic color generated from a seed.' },
  { icon: 'text_fields', title: 'Typography', text: 'The full type scale, from display to label, with its sizes and line heights.' },
  { icon: 'interests', title: 'Shape', text: 'The corner scale and the 35 expressive shapes, morphing with real springs.' },
  { icon: 'animation', title: 'Motion', text: 'Spring parameters, easing curves and durations taken from the motion tokens.' },
  { icon: 'layers', title: 'Elevation & states', text: 'Elevation levels, hover/focus/press state layers and disabled opacities.' },
]

const beyondMaterial = [
  'Floating windows', 'Code editor', 'Markdown', 'Rich text editor', 'JSON editor & viewer', 'Terminal',
  'Data tables', 'Kanban', 'Scheduler', 'Calendar', 'Command palette', 'Map layer switcher', 'Charts',
  'QR & barcodes', 'Transfer list', 'Tour', 'Layout helpers', 'Toasts & notifications',
]

const roles = [
  { bg: 'bg-primary', fg: 'text-on-primary', name: 'primary' },
  { bg: 'bg-primary-container', fg: 'text-on-primary-container', name: 'primary-container' },
  { bg: 'bg-secondary', fg: 'text-on-secondary', name: 'secondary' },
  { bg: 'bg-secondary-container', fg: 'text-on-secondary-container', name: 'secondary-container' },
  { bg: 'bg-tertiary', fg: 'text-on-tertiary', name: 'tertiary' },
  { bg: 'bg-tertiary-container', fg: 'text-on-tertiary-container', name: 'tertiary-container' },
  { bg: 'bg-error', fg: 'text-on-error', name: 'error' },
  { bg: 'bg-surface-container-highest', fg: 'text-on-surface', name: 'surface-container-highest' },
]

const utilityFamilies = [
  { icon: 'format_color_fill', title: 'Color roles', classes: ['bg-primary', 'text-on-surface-variant', 'border-outline-variant', 'bg-tertiary-container'] },
  { icon: 'title', title: 'Type scale', classes: ['text-display-small', 'text-title-large', 'text-body-medium', 'text-label-small'] },
  { icon: 'rounded_corner', title: 'Shape', classes: ['rounded-xs', 'rounded-md', 'rounded-xl', 'rounded-xxl'] },
  { icon: 'layers', title: 'Elevation', classes: ['shadow-elevation-1', 'shadow-elevation-3', 'shadow-elevation-5'] },
  { icon: 'animation', title: 'Motion', classes: ['ease-emphasized', 'ease-standard', 'duration-(--duration-medium-2)'] },
]

const customCode = `<!-- No library component here: only Tailwind classes from the M3 tokens -->
<article class="group rounded-xl bg-surface-container-low p-5 shadow-elevation-1
                transition-all ease-emphasized duration-(--duration-medium-2)
                hover:-translate-y-1 hover:shadow-elevation-3">
  <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg
              bg-tertiary-container text-on-tertiary-container">
    <span class="material-symbols-outlined">hiking</span>
  </div>
  <p class="text-label-medium text-primary">Weekend trip</p>
  <h3 class="text-title-large text-on-surface">Ridge trail, 14 km</h3>
  <p class="text-body-medium text-on-surface-variant">Follows the palette and dark mode.</p>
</article>`

const history: TimelineItem[] = [
  { date: '2021', title: 'Material Design 3 comes out', description: 'I wanted it in my Vue projects, but couldn\'t find an implementation that matched what I was looking for.', icon: 'auto_awesome', color: 'primary' },
  { date: '2021 – 2026', title: 'Components scattered across apps', description: 'I kept building components locally for each app, and sometimes used Quasar because it was more mature.', icon: 'folder_copy', color: 'secondary' },
  { date: 'June 2026', title: 'One library instead of many copies', description: 'v0.1.0: the idea was to stop recreating the same components in every project and keep them in one place.', icon: 'rocket_launch', color: 'tertiary' },
  { date: '2026', title: 'Growing from real apps', description: 'Floating windows, map layer controls, editors and layout components came over from apps I had already built.', icon: 'construction', color: 'secondary' },
  { date: 'October 2026', title: '1.0: all of M3 core', description: 'Every Material Design 3 core component in the library, reviewed against the official Compose source.', icon: 'verified', color: 'primary' },
]
</script>

<template>
  <div class="flex flex-col gap-14">
    <!-- ══ HERO ══════════════════════════════════════════════════ -->
    <section class="relative overflow-hidden rounded-xl bg-primary-container px-6 py-14 md:px-12 md:py-20">
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div v-for="f in heroFloaters" :key="f.offset" ref="floaters" class="absolute" :class="f.box">
          <MShape :shape="heroShapes(f.offset)" class="h-full w-full" :class="f.color" />
        </div>
      </div>
      <div class="relative max-w-2xl">
        <p class="mb-3 text-label-large tracking-wide text-primary uppercase">About</p>
        <h1 class="mb-4 text-display-small font-medium text-on-primary-container md:text-display-medium">
          Material Design 3, made for Vue.
        </h1>
        <p class="mb-6 text-title-medium text-on-primary-container/80">
          Not a theme that looks like Material: an implementation of it, built from Google's guidelines and ported
          from the official Jetpack Compose source. Free for anyone, for anything.
        </p>
        <div class="flex flex-wrap gap-2">
          <RouterLink to="/getting-started/setup"><MButton icon="rocket_launch">Get started</MButton></RouterLink>
          <a href="https://github.com/SrWither/m3ui-vue" target="_blank" rel="noopener">
            <MButton variant="tonal" icon="code">Source on GitHub</MButton>
          </a>
        </div>
      </div>
    </section>

    <!-- ══ FROM MATERIAL ══════════════════════════════════════════ -->
    <section>
      <h2 class="mb-2 text-headline-medium font-medium text-on-surface">What comes from Material</h2>
      <p class="mb-6 max-w-3xl text-body-large text-on-surface-variant">
        The core of the library is Material Design 3 itself. Anatomy and behavior follow the guidelines, and the exact
        values (dp sizes, color roles, elevation, spring stiffness and damping) are ported from Google's Kotlin
        implementation in androidx and its design tokens, not eyeballed from screenshots.
      </p>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MCard v-for="f in fromMaterial" :key="f.title" variant="filled" class="p-5">
          <span class="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-on-primary">
            <MIcon :name="f.icon" :size="24" />
          </span>
          <p class="mb-1 text-title-medium font-medium text-on-surface">{{ f.title }}</p>
          <p class="text-body-medium text-on-surface-variant">{{ f.text }}</p>
        </MCard>
      </div>

      <!-- Color roles strip: reacts to the palette and theme picked in the top bar -->
      <div class="mt-3 grid grid-cols-2 overflow-hidden rounded-xl sm:grid-cols-4 lg:grid-cols-8">
        <div v-for="r in roles" :key="r.name" class="flex h-24 items-end p-3" :class="[r.bg, r.fg]">
          <span class="text-label-small break-all">{{ r.name }}</span>
        </div>
      </div>
      <p class="mt-2 text-body-small text-on-surface-variant">
        Try another palette or dark mode from the top bar: every color on this page is a Material color role.
      </p>
    </section>

    <!-- ══ BEYOND MATERIAL ════════════════════════════════════════ -->
    <section class="grid gap-6 md:grid-cols-5">
      <div class="md:col-span-2">
        <h2 class="mb-2 text-headline-medium font-medium text-on-surface">What goes beyond it</h2>
        <p class="mb-3 text-body-large text-on-surface-variant">
          Real apps need things Material doesn't define. Those components are my own design, built from the same
          pieces: the same color roles, type scale, shapes, elevation and motion, so they sit next to the official
          ones without looking out of place.
        </p>
        <p class="text-body-medium text-on-surface-variant">
          Their pages say when a component isn't part of the M3 spec. Many came from apps I had already built.
        </p>
      </div>
      <MCard variant="outlined" class="p-5 md:col-span-3">
        <div class="mb-4 flex items-center gap-2">
          <MIcon name="extension" :size="22" class="text-tertiary" />
          <p class="text-title-medium font-medium text-on-surface">Extended components</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <MChip v-for="b in beyondMaterial" :key="b">{{ b }}</MChip>
        </div>
      </MCard>
    </section>

    <!-- ══ TAILWIND ═══════════════════════════════════════════════ -->
    <section>
      <h2 class="mb-2 text-headline-medium font-medium text-on-surface">Not limited to the components</h2>
      <p class="mb-6 max-w-3xl text-body-large text-on-surface-variant">
        The library is built on Tailwind CSS v4, and its design tokens are Tailwind theme variables. That gives you
        new utility classes for every Material color role, the type scale, shapes, elevation and motion, so you can
        build your own UI with the same system the components use, and it follows the palette and dark mode too.
      </p>

      <div class="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div v-for="u in utilityFamilies" :key="u.title" class="rounded-lg bg-surface-container p-4">
          <div class="mb-3 flex items-center gap-2">
            <MIcon :name="u.icon" :size="20" class="text-primary" />
            <p class="text-title-small font-medium text-on-surface">{{ u.title }}</p>
          </div>
          <div class="flex flex-col gap-1">
            <code v-for="c in u.classes" :key="c" class="text-label-medium break-all text-on-surface-variant">{{ c }}</code>
          </div>
        </div>
      </div>

      <div class="grid items-center gap-6 lg:grid-cols-2">
        <MCodeEditor :model-value="customCode" language="html" :readonly="true" :line-numbers="false" min-height="60px" max-height="360px" />
        <div class="flex justify-center rounded-xl bg-surface-container-lowest p-8">
          <article
            class="group w-full max-w-xs rounded-xl bg-surface-container-low p-5 shadow-elevation-1 transition-all ease-emphasized duration-(--duration-medium-2) hover:-translate-y-1 hover:shadow-elevation-3"
          >
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-tertiary-container text-on-tertiary-container">
              <span class="material-symbols-outlined">hiking</span>
            </div>
            <p class="text-label-medium text-primary">Weekend trip</p>
            <h3 class="text-title-large text-on-surface">Ridge trail, 14 km</h3>
            <p class="text-body-medium text-on-surface-variant">Follows the palette and dark mode.</p>
          </article>
        </div>
      </div>
      <p class="mt-3 text-body-medium text-on-surface-variant">
        See <RouterLink to="/styles/colors" class="text-primary underline">Colors</RouterLink>,
        <RouterLink to="/styles/typography" class="text-primary underline">Typography</RouterLink>,
        <RouterLink to="/styles/shapes" class="text-primary underline">Shapes</RouterLink> and
        <RouterLink to="/styles/motion" class="text-primary underline">Motion</RouterLink> for every class.
      </p>
    </section>

    <!-- ══ HISTORY ════════════════════════════════════════════════ -->
    <section class="grid gap-8 md:grid-cols-5">
      <div class="md:col-span-2">
        <h2 class="mb-2 text-headline-medium font-medium text-on-surface">How it started</h2>
        <p class="mb-3 text-body-large text-on-surface-variant">
          I've always liked Material Design. M3UI Vue started as a way to stop rebuilding the same components in
          every project.
        </p>
        <p class="text-body-medium text-on-surface-variant">
          I use it in my own applications, including projects I work on professionally, so I keep finding things
          to fix and refine. It isn't perfect, and some parts are more mature than others. I don't work on it
          full-time, but I'll keep improving it, especially since I use it myself.
        </p>
      </div>
      <div class="md:col-span-3">
        <MTimeline :items="history" />
      </div>
    </section>

    <!-- ══ FREE ═══════════════════════════════════════════════════ -->
    <section class="relative overflow-hidden rounded-xl bg-tertiary-container px-6 py-10 md:px-12">
      <MShape shape="Heart" class="pointer-events-none absolute -right-8 -bottom-10 h-48 w-48 text-tertiary opacity-15" aria-hidden="true" />
      <div class="relative max-w-2xl">
        <MIcon name="volunteer_activism" :size="32" class="mb-3 text-on-tertiary-container" />
        <h2 class="mb-3 text-headline-medium font-medium text-on-tertiary-container">Free, for everyone</h2>
        <p class="mb-3 text-body-large text-on-tertiary-container/90">
          M3UI Vue is open source under the
          <a href="https://github.com/SrWither/m3ui-vue/blob/main/LICENSE" target="_blank" rel="noopener" class="underline">MIT license</a>.
          Use it in personal, commercial or professional projects without paying anything, without signing up and
          without owing anything back: no fees, no paid tier, no requirement to credit it in your app or to contribute.
        </p>
        <p class="mb-3 text-body-medium text-on-tertiary-container/80">
          The only condition the MIT license sets is keeping its copyright and license notice with copies of the
          library's code, which installing it from npm already does.
        </p>
        <p class="text-body-medium text-on-tertiary-container/80">
          It's a personal project, not a business, and it doesn't try to compete with other UI libraries. I made it
          public in case it's useful to others. Bug reports and ideas are welcome on
          <a href="https://github.com/SrWither/m3ui-vue" target="_blank" rel="noopener" class="underline">GitHub</a>.
        </p>
      </div>
    </section>

    <p class="text-body-small text-on-surface-variant">
      Material Design is a design system by Google. M3UI Vue is an independent project and isn't affiliated with or
      endorsed by Google.
    </p>
  </div>
</template>
