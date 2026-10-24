<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { iconMap } from '@/nav/sections'

const groups = [
  {
    title: 'Theming',
    items: [
      { name: 'useTheme', description: 'Light, dark or system color scheme, remembered across visits.' },
      { name: 'useThemeTokens', description: 'The theme\'s colors as strings for canvases and charts, kept current across theme changes.' },
      { name: 'useColorPalette', description: 'Switch the color palette at runtime, or generate one from a seed color.' },
      { name: 'useLocale', description: 'The built-in UI strings in the app language, for your own components.' },
    ],
  },
  {
    title: 'Feedback',
    items: [
      { name: 'useToast', description: 'Programmatic, imperative toast messages — no component to mount.' },
      { name: 'useNotification', description: 'Programmatic notifications with squared corners, actions, and positioning.' },
      { name: 'usePageProgress', description: 'Drive the MPageProgress top bar by hand: start, set a percentage, done.' },
    ],
  },
  {
    title: 'Layout & utilities',
    items: [
      { name: 'useWindowSizeClass', description: 'M3 window size classes (compact to extra-large) for the window or any element.' },
      { name: 'useDevice', description: 'Reactive composable for detecting a mobile-sized viewport.' },
      { name: 'useDebounce', description: 'Debounce a function, cancelled automatically when the component unmounts.' },
      { name: 'useAutoGrow', description: 'Grow your own textarea with its text, between a minimum and a maximum of rows.' },
      { name: 'useSpring', description: 'Animate numbers on a real spring, with Material 3\'s motion specs, like the components do.' },
      { name: 'useScrollReveal', description: 'Reveal elements in refs as they scroll into view (the engine behind v-reveal).' },
      { name: 'useConfetti', description: 'A burst of confetti in expressive shapes and your theme\'s colors, for the end of a flow.' },
      { name: 'useFireworks', description: 'Rockets that burst into rings, hearts and flowers of sparks in your theme\'s colors, for the big moments.' },
      { name: 'useReactions', description: 'An emoji or icon that floats up swaying, like reactions over a live stream or a video call.' },
      { name: 'useContainerTransform', description: 'Opens one MContainerTransform from many elements (a grid of cards, one detail view).' },
      { name: 'useFieldBg', description: 'Detect the background behind a field so an outlined label can cut through its border.' },
    ],
  },
  {
    title: 'Maps (from /map)',
    items: [
      { name: 'useMap', description: 'The MMap\'s MapLibre map, listeners that clean up, and the click owner, for controls and tools of your own.' },
      { name: 'useMapLayers', description: 'The style\'s layers with visibility, opacity, groups and base maps, for a layer panel of your own.' },
      { name: 'useMapFilter', description: 'Filter a map layer on top of the filter its style already has: ranges, dates, searches.' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Composables</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Functions you call from <code>&lt;script setup&gt;</code> to use the library's shared state: theme, palette,
      language, toasts and window size. Import them by name from <code>@m3ui-vue/m3ui-vue</code>, like the components.
    </p>

    <section v-for="g in groups" :key="g.title" class="mb-8">
      <h2 class="mb-3 text-title-large font-medium">{{ g.title }}</h2>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <router-link
          v-for="c in g.items"
          :key="c.name"
          :to="`/composables/${c.name.toLowerCase()}`"
          class="no-underline"
        >
          <MCard clickable class="flex h-full flex-col gap-2 p-4">
            <div class="flex items-center gap-2">
              <MIcon :name="iconMap[c.name] ?? 'code'" :size="22" class="text-primary" />
              <span class="text-title-medium font-medium">{{ c.name }}</span>
            </div>
            <p class="text-body-small text-on-surface-variant">{{ c.description }}</p>
          </MCard>
        </router-link>
      </div>
    </section>
  </div>
</template>
