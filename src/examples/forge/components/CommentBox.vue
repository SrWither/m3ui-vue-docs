<script setup lang="ts">
/* Markdown comment box with Write / Preview tabs, like on the real thing. */
import { ref } from 'vue'
import { MAvatar, MIcon, MTabs } from '@m3ui-vue/m3ui-vue'
import { MMarkdown } from '@m3ui-vue/m3ui-vue/markdown'
import { me } from '../data'

const text = defineModel<string>({ required: true })
defineProps<{ placeholder?: string; avatar?: boolean; rows?: number }>()
const tab = ref<'write' | 'preview'>('write')
</script>

<template>
  <div class="flex gap-3">
    <MAvatar v-if="avatar" :name="me.name" :size="40" class="hidden shrink-0 sm:inline-flex" />
    <div class="min-w-0 flex-1 overflow-hidden rounded-xl border border-outline-variant bg-surface">
      <!-- Full-width divider; MTabs' own 1px one overlaps it (-mb-px) so the line is even -->
      <div class="border-b-2 border-outline-variant">
        <MTabs v-model="tab" :tabs="[{ value: 'write', label: 'Write' }, { value: 'preview', label: 'Preview' }]" variant="secondary" class="-mb-px max-w-60" />
      </div>
      <div class="p-2">
        <textarea
          v-if="tab === 'write'"
          v-model="text"
          :rows="rows ?? 5"
          :placeholder="placeholder ?? 'Leave a comment (Markdown supported)'"
          class="block w-full resize-y rounded-lg bg-surface-container-low p-3 text-body-medium text-on-surface outline-none placeholder:text-on-surface-variant focus:ring-2 focus:ring-secondary"
        />
        <div v-else class="min-h-28 px-2 py-1">
          <MMarkdown v-if="text.trim()" :source="text" />
          <p v-else class="text-body-medium text-on-surface-variant">Nothing to preview</p>
        </div>
        <div class="mt-2 flex flex-wrap items-center justify-end gap-2">
          <span class="mr-auto flex items-center gap-1 text-label-small text-on-surface-variant">
            <MIcon name="markdown" :size="16" />Markdown is supported
          </span>
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
</template>
