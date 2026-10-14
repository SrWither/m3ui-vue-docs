<script setup lang="ts">
/* An attachment: a thumbnail for images (opens MLightbox), a file-type tile for the rest. */
import { MIcon, useToast } from '@m3ui-vue/m3ui-vue'
import type { Attachment } from '../data'
import { fileSize as size } from '../useMail'

const props = defineProps<{ file: Attachment }>()
defineEmits<{ view: [] }>()
const toast = useToast()

const kinds = {
  pdf: { icon: 'picture_as_pdf', color: 'text-error' },
  doc: { icon: 'description', color: 'text-primary' },
  sheet: { icon: 'table_chart', color: 'text-success' },
  zip: { icon: 'folder_zip', color: 'text-tertiary' },
  image: { icon: 'image', color: 'text-tertiary' },
}
const download = () => toast.info(`Downloads aren’t part of this demo (${props.file.name})`, { icon: 'download' })
</script>

<template>
  <div class="group relative w-44 overflow-hidden rounded-lg border border-outline-variant bg-surface">
    <button v-if="file.kind === 'image' && file.src" type="button" class="block w-full cursor-zoom-in" :aria-label="`View ${file.name}`" @click="$emit('view')">
      <img :src="file.src" alt="" class="h-28 w-full object-cover" />
    </button>
    <div v-else class="flex h-28 items-center justify-center bg-surface-container">
      <MIcon :name="kinds[file.kind].icon" :size="40" :class="kinds[file.kind].color" />
    </div>
    <div class="flex items-center gap-2 px-2.5 py-2">
      <MIcon :name="kinds[file.kind].icon" :size="18" :class="kinds[file.kind].color" />
      <div class="min-w-0 flex-1">
        <p class="truncate text-label-medium text-on-surface">{{ file.name }}</p>
        <p class="text-label-small text-on-surface-variant">{{ size(file.size) }}</p>
      </div>
      <button type="button" class="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-on-surface-variant hover:bg-on-surface/8" :aria-label="`Download ${file.name}`" @click="download">
        <MIcon name="download" :size="18" />
      </button>
    </div>
  </div>
</template>
