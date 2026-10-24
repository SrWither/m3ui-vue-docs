<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MIconButton, MScheme, useReactions } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const { react } = useReactions()

const emojis = ['💖', '👍', '🎉', '😂', '😮', '👏']

// A like that counts and floats a heart on each tap
const likes = ref(128)
function like(e: MouseEvent) {
  likes.value++
  react(e.currentTarget as Element, { icon: 'favorite', color: '#e91e63' })
}

const types: TypeDef[] = [
  {
    name: 'useReactions()',
    description: 'Returns react(). fireReaction(origin, content, options?) is the same as a plain function, outside components',
    fields: [
      { name: 'react(origin, content, options?)', type: '(origin: MouseEvent | Element | { x, y } | undefined, content: ReactionContent, options?: ReactionOptions) => void', required: true, description: 'Floats the content up from the pointer of a click (from the element for a keyboard click), from an element\'s center, or from a point in viewport pixels; undefined starts it at the lower middle of the screen' },
    ],
  },
  {
    name: 'ReactionContent',
    description: "string | { icon: string; filled?: boolean; color?: string }",
    fields: [
      { name: "'🎉'", type: 'string', description: 'Any text: an emoji, \'+1\', a short word' },
      { name: '{ icon }', type: 'object', description: 'A Material Symbol, filled unless filled: false, in color or the theme\'s primary where it starts (an MScheme\'s inside one)' },
    ],
  },
  {
    name: 'ReactionOptions',
    fields: [
      { name: 'count', type: 'number', description: 'How many float up together, a little apart (1)' },
      { name: 'size', type: 'number', description: 'Size in px (32)' },
      { name: 'distance', type: 'number', description: 'How far it rises, in px (260)' },
      { name: 'duration', type: 'number', description: 'How long it floats, in ms (2200)' },
      { name: 'sway', type: 'number', description: 'How far it sways to each side, in px (20)' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useReactions</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      An emoji or an icon that pops up and floats away swaying, the way reactions rise over a live stream or a video
      call. Tap again and again for a stream of them. Each one is animated by the browser's compositor, in a layer over
      the page that ignores clicks and screen readers; with reduced motion they only fade in and out where they start.
    </p>

    <ComponentDemo
      title="Emoji Reactions"
      description="Pass the click event and it floats up from the pointer."
      :code="`<script setup>
import { useReactions } from '@m3ui-vue/m3ui-vue'
const { react } = useReactions()
const emojis = ['💖', '👍', '🎉', '😂', '😮', '👏']
</script>

<template>
  <button v-for=&quot;e in emojis&quot; :key=&quot;e&quot; type=&quot;button&quot; class=&quot;size-12 rounded-full text-2xl&quot; @click=&quot;react($event, e)&quot;>
    {{ e }}
  </button>
</template>`"
    >
      <div class="flex flex-wrap justify-center gap-1 rounded-full bg-surface-container px-3 py-1">
        <button
          v-for="e in emojis"
          :key="e"
          type="button"
          class="grid size-12 cursor-pointer place-items-center rounded-full text-2xl transition-transform hover:bg-on-surface/8 active:scale-90"
          :aria-label="`React ${e}`"
          @click="react($event, e)"
        >{{ e }}</button>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="A Like Button"
      description="An icon floats from the button's center on every tap, filled and in its color."
      :code="`<MButton variant=&quot;tonal&quot; icon=&quot;favorite&quot; @click=&quot;like&quot;>{{ likes }}</MButton>

<script setup>
function like(e) {
  likes.value++
  react(e.currentTarget, { icon: 'favorite', color: '#e91e63' })
}
</script>`"
    >
      <MButton variant="tonal" icon="favorite" @click="like">{{ likes }}</MButton>
    </ComponentDemo>

    <ComponentDemo
      title="A Handful, and Bigger"
      description="count sends several at once, a little apart; size, distance, duration and sway shape how they float. An icon takes the primary color of the scheme it starts in."
      :code="`<MButton @click=&quot;react($event, '👏', { count: 6 })&quot;>Applause</MButton>
<MButton @click=&quot;react($event, '🚀', { size: 56, distance: 420, duration: 3000 })&quot;>To the moon</MButton>
<MScheme seed=&quot;#3b8a5a&quot;>
  <MButton @click=&quot;react($event, { icon: 'thumb_up' }, { count: 3 })&quot;>Agree</MButton>
</MScheme>`"
    >
      <div class="flex flex-wrap justify-center gap-3">
        <MButton variant="tonal" @click="react($event, '👏', { count: 6 })">👏 Applause</MButton>
        <MButton variant="tonal" @click="react($event, '🚀', { size: 56, distance: 420, duration: 3000 })">🚀 To the moon</MButton>
        <MScheme seed="#3b8a5a">
          <MButton icon="thumb_up" @click="react($event, { icon: 'thumb_up' }, { count: 3 })">Agree</MButton>
        </MScheme>
        <MIconButton icon="star" variant="tonal" aria-label="Star" @click="react($event, { icon: 'star', color: '#f5b400' }, { count: 4, sway: 40 })" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <ComponentPager current="useReactions" />
  </div>
</template>
