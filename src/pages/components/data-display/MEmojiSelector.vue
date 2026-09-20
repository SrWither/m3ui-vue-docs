<script setup lang="ts">
import { ref } from 'vue'
import { MEmojiSelector } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const emojiSelectorProps: PropDef[] = [
  { name: 'categories', type: 'string[]', description: 'Which category ids to show — all categories if omitted' },
  { name: 'search', type: 'boolean', default: 'true', description: 'Show the search bar (filters by category id/label, not individual emoji names)' },
  { name: 'columns', type: 'number', default: '8', description: 'Number of columns in the emoji grid' },
  { name: 'emojiSize', type: 'number', default: '28', description: 'Emoji render size in px' },
]

const emojiSelectorEvents: EventDef[] = [
  { name: 'select', payload: 'string', description: 'Emitted when an emoji in the grid is clicked' },
]

const selectedEmoji = ref('')
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MEmojiSelector</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A full emoji picker panel with category tabs, a scrollable grid, and a search bar
      that filters by category.
    </p>

    <ComponentDemo
      title="Emoji Picker"
      description="Full emoji picker with categories, search, and click-to-select."
      :code="`<MEmojiSelector @select=&quot;onSelect&quot; />`"
      :script="`import { MEmojiSelector } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="flex w-full flex-col gap-4 sm:flex-row">
        <div class="w-full sm:w-80">
          <MEmojiSelector @select="(e: string) => selectedEmoji = e" />
        </div>
        <div v-if="selectedEmoji" class="flex items-center gap-3">
          <span class="text-6xl">{{ selectedEmoji }}</span>
          <span class="text-body-large text-on-surface-variant">Selected</span>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Limited Categories, No Search"
      description="Restrict the visible categories with the categories prop, and hide the search bar."
      :code="`<MEmojiSelector :categories=&quot;['smileys', 'animals']&quot; :search=&quot;false&quot; @select=&quot;onSelect&quot; />`"
    >
      <div class="w-full sm:w-80">
        <MEmojiSelector :categories="['smileys', 'animals']" :search="false" @select="(e: string) => selectedEmoji = e" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="emojiSelectorProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="emojiSelectorEvents" />

    <ComponentPager current="MEmojiSelector" />
  </div>
</template>
