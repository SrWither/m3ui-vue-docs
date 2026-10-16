<script setup lang="ts">
import { ref } from 'vue'
import { MEmojiSelector, MTextField } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const emojiSelectorProps: PropDef[] = [
  { name: 'categories', type: 'string[]', description: "Category ids to show, all by default: 'smileys', 'gestures', 'people', 'animals', 'nature', 'food', 'activities', 'travel', 'objects', 'symbols', 'flags'" },
  { name: 'search', type: 'boolean', default: 'true', description: 'Show the search field. It matches emoji names and keywords in the app language, ignoring accents, and in English' },
  { name: 'columns', type: 'number', description: 'A fixed number of columns. By default, as many as fit the width' },
  { name: 'emojiSize', type: 'number', default: '28', description: 'Emoji size in px' },
  { name: 'recent', type: 'boolean', default: 'true', description: "Remember picked emoji and show them first, under Recently used (stored in this browser's localStorage)" },
  { name: 'recentLimit', type: 'number', default: '24', description: 'How many recent emoji to keep' },
  { name: 'skinTones', type: 'boolean', default: 'true', description: 'Offer skin tones: long press, right click or Shift+Enter on an emoji that takes them, or the hand button for all of them. The choice is remembered' },
  { name: 'preview', type: 'boolean', default: 'true', description: 'Show the hovered or focused emoji with its name at the bottom' },
  { name: 'height', type: 'string', default: "'320px'", description: 'Height of the scrolling grid' },
]

const emojiSelectorEvents: EventDef[] = [
  { name: 'select', payload: 'string', description: 'An emoji was picked, with the skin tone applied' },
]

const keys = [
  ['Type in the search field', 'Find emoji by name or keyword; Enter picks the first result, ↓ goes to the results'],
  ['← → ↑ ↓, Home, End', 'Move through the grid'],
  ['Enter or Space', 'Pick the focused emoji'],
  ['Shift+Enter, right click, long press', 'Skin tones for that emoji (a small corner mark shows which take them)'],
]

const selectedEmoji = ref('')
const message = ref('')
const compactPicked = ref('')
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MEmojiSelector</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      An emoji picker in the style of Android's and Gboard's: the full Unicode set (Emoji 15.0) by category, recently
      used ones first, skin tones, and search by name in the app's language. The names come from Unicode's CLDR and
      load only when the picker is used, one language at a time. Switch the docs language to search in it.
    </p>

    <ComponentDemo
      title="Emoji Picker"
      description="Try searching for “heart” or “pizza”, hover an emoji to see its name, right click (or long press) a hand to pick a skin tone, and pick a few to fill Recently used."
      :code="`<MEmojiSelector @select=&quot;onSelect&quot; />`"
      :script="`function onSelect(emoji: string) {
  // emoji includes the skin tone, e.g. '👍🏽'
}`"
    >
      <div class="flex w-full flex-col gap-4 sm:flex-row">
        <div class="w-full sm:w-96">
          <MEmojiSelector @select="(e: string) => selectedEmoji = e" />
        </div>
        <div v-if="selectedEmoji" class="flex items-center gap-3">
          <span class="text-6xl">{{ selectedEmoji }}</span>
          <span class="text-body-medium text-on-surface-variant">Selected</span>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="In a Composer"
      description="Picked emoji go into a text field. Here the grid is shorter and has a fixed number of columns."
      :code="`<MTextField v-model=&quot;message&quot; label=&quot;Message&quot; />
<MEmojiSelector :columns=&quot;8&quot; height=&quot;220px&quot; @select=&quot;(e) => (message += e)&quot; />`"
    >
      <div class="flex w-full max-w-sm flex-col gap-3">
        <MTextField v-model="message" label="Message" />
        <MEmojiSelector :columns="8" height="220px" @select="(e: string) => (message += e)" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Compact"
      description="Only some categories, without search, preview or skin tones: a quick reaction palette."
      :code="`<MEmojiSelector
  :categories=&quot;['smileys', 'gestures']&quot;
  :search=&quot;false&quot;
  :preview=&quot;false&quot;
  :skin-tones=&quot;false&quot;
  :recent=&quot;false&quot;
  height=&quot;180px&quot;
/>`"
    >
      <div class="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
        <div class="w-full sm:w-80">
          <MEmojiSelector :categories="['smileys', 'gestures']" :search="false" :preview="false" :skin-tones="false" :recent="false" height="180px" @select="(e: string) => compactPicked = e" />
        </div>
        <span v-if="compactPicked" class="text-5xl">{{ compactPicked }}</span>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Keyboard and gestures</h3>
    <div class="mb-6 overflow-hidden rounded-xl border border-outline-variant">
      <div v-for="[how, what] in keys" :key="how" class="grid grid-cols-[minmax(9rem,16rem)_1fr] gap-4 border-b border-outline-variant px-4 py-2.5 last:border-b-0">
        <span class="text-label-large text-on-surface">{{ how }}</span>
        <span class="text-body-medium text-on-surface-variant">{{ what }}</span>
      </div>
    </div>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="emojiSelectorProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="emojiSelectorEvents" />

    <p class="mt-4 text-body-small text-on-surface-variant">
      The data is also exported: <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">emojiCategories</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">allEmojis</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">randomEmoji()</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">withSkinTone(emoji, tone)</code> and
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">toneableEmojis</code>. A template ref exposes
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">focus()</code>.
    </p>

    <ComponentPager current="MEmojiSelector" />
  </div>
</template>
