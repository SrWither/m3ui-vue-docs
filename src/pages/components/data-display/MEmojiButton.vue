<script setup lang="ts">
import { ref } from 'vue'
import { MEmojiButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const emojiButtonProps: PropDef[] = [
  { name: 'emoji', type: 'string', default: "'😀'", description: 'Default/current emoji shown before any hover cycling or click' },
  { name: 'size', type: 'number', default: '28', description: 'Emoji font size in pixels (the button itself is size + 12px)' },
  { name: 'label', type: 'string', description: "Accessible label — defaults to 'Emoji {emoji}'" },
  { name: 'randomOnHover', type: 'boolean', default: 'true', description: 'Cycle to a random emoji on hover (Discord-style)' },
  { name: 'category', type: 'string', description: "Limit the random pool to a category id (e.g. 'smileys', 'animals') when randomOnHover is on" },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
]

const emojiButtonEvents: EventDef[] = [
  { name: 'click', payload: 'string', description: 'Emitted on click with the currently displayed emoji (whatever hover last cycled to)' },
]

const selectedEmoji = ref('')
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MEmojiButton</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A single emoji button that cycles through a random pool on hover (Discord-style) and emits
      whichever emoji is showing when clicked.
    </p>

    <ComponentDemo
      title="Discord-style Hover"
      description="Hover the button to see random emojis cycle. Click to trigger."
      :code="`<MEmojiButton emoji=&quot;😎&quot; @click=&quot;onPick&quot; />`"
      :script="`import { MEmojiButton } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-center gap-2">
          <MEmojiButton emoji="😎" :size="32" @click="(e: string) => selectedEmoji = e" />
          <span class="text-label-small text-on-surface-variant">All</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MEmojiButton emoji="🐱" :size="32" category="animals" @click="(e: string) => selectedEmoji = e" />
          <span class="text-label-small text-on-surface-variant">Animals</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MEmojiButton emoji="🍕" :size="32" category="food" @click="(e: string) => selectedEmoji = e" />
          <span class="text-label-small text-on-surface-variant">Food</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MEmojiButton emoji="😊" :size="32" :random-on-hover="false" @click="(e: string) => selectedEmoji = e" />
          <span class="text-label-small text-on-surface-variant">No random</span>
        </div>
        <p v-if="selectedEmoji" class="ml-4 text-body-large">
          Picked: <span class="text-headline-medium">{{ selectedEmoji }}</span>
        </p>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="emojiButtonProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="emojiButtonEvents" />

    <ComponentPager current="MEmojiButton" />
  </div>
</template>
