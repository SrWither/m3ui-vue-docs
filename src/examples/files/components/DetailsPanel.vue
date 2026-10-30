<script setup lang="ts">
/* Details of the selected item (or the current folder): picture, type, size, owner, dates, and a PDF's notes. */
import { computed } from 'vue'
import { MButton, MDivider, MIcon, MIconButton } from '@m3ui-vue/m3ui-vue'
import { formatDate, formatSize, KIND_COLOR, KIND_ICON, KIND_LABEL, useFiles } from '../useFiles'
import Thumb from './Thumb.vue'

defineEmits<{ close: [] }>()
const f = useFiles()

const item = computed(() => (f.selectedItems.value.length === 1 ? f.selectedItems.value[0]! : f.byId(f.folder.value) ?? null))
const where = computed(() => {
  const i = item.value
  if (!i) return ''
  const names: string[] = []
  let p = f.byId(i.parent)
  while (p) {
    names.unshift(p.name)
    p = f.byId(p.parent)
  }
  return ['My files', ...names].join(' › ')
})
const notes = computed(() => item.value?.annotations ?? [])
const full = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' })
</script>

<template>
  <aside class="flex h-full flex-col overflow-y-auto">
    <div class="flex h-14 shrink-0 items-center gap-2 pr-1 pl-4">
      <MIcon v-if="item" :name="KIND_ICON[item.kind]" :size="22" filled :style="{ color: item.color ?? KIND_COLOR[item.kind] }" />
      <p class="min-w-0 flex-1 truncate text-title-medium">{{ item?.name ?? 'Details' }}</p>
      <MIconButton icon="close" label="Close details" @click="$emit('close')" />
    </div>

    <div v-if="!item" class="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center text-on-surface-variant">
      <MIcon name="info" :size="40" />
      <p class="text-body-medium">{{ f.selectedItems.value.length > 1 ? `${f.selectedItems.value.length} items selected` : 'Select a file to see its details' }}</p>
    </div>

    <div v-else class="flex flex-col gap-4 px-4 pb-6">
      <Thumb :item="item" class="aspect-[4/3] rounded-xl" />
      <MButton v-if="item.kind !== 'folder'" icon="open_in_new" variant="tonal" @click="f.open(item)">Open</MButton>
      <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-body-medium">
        <dt class="text-on-surface-variant">Type</dt><dd>{{ KIND_LABEL[item.kind] }}</dd>
        <dt class="text-on-surface-variant">Size</dt><dd>{{ item.kind === 'folder' ? `${formatSize(f.sizeOf(item))}, ${f.countIn(item.id)} items` : formatSize(item.size) }}</dd>
        <dt class="text-on-surface-variant">Location</dt><dd class="min-w-0 break-words">{{ where }}</dd>
        <dt class="text-on-surface-variant">Owner</dt><dd>{{ item.owner }}</dd>
        <dt class="text-on-surface-variant">Modified</dt><dd>{{ full.format(item.modified) }}</dd>
        <template v-if="item.artist"><dt class="text-on-surface-variant">Artist</dt><dd>{{ item.artist }}</dd></template>
        <template v-if="item.trashed"><dt class="text-on-surface-variant">Trashed</dt><dd>{{ formatDate(item.trashed) }}</dd></template>
      </dl>

      <template v-if="item.kind === 'pdf'">
        <MDivider />
        <p class="text-title-small">Annotations</p>
        <p v-if="!notes.length" class="text-body-medium text-on-surface-variant">None yet. Open it and use the edit button to highlight, add notes or draw.</p>
        <ul v-else class="flex flex-col gap-2">
          <li v-for="a in notes" :key="a.id" class="flex gap-3 rounded-lg bg-surface-container p-3">
            <span class="mt-1 size-3 shrink-0 rounded-full" :style="{ backgroundColor: a.color }" />
            <span class="min-w-0 flex-1 text-body-medium">
              <span class="block text-label-medium text-on-surface-variant">Page {{ a.page }} · {{ a.type === 'highlight' ? 'Highlight' : a.type === 'note' ? 'Note' : 'Drawing' }}</span>
              <span v-if="a.quote" class="line-clamp-2 italic">"{{ a.quote }}"</span>
              <span v-if="a.text" class="block">{{ a.text }}</span>
            </span>
          </li>
        </ul>
      </template>
    </div>
  </aside>
</template>
