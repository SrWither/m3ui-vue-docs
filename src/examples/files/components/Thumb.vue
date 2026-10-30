<script lang="ts">
import { effectScope, watch } from 'vue'
import { usePdf } from '@m3ui-vue/m3ui-vue/pdf'

// A PDF's first page, rendered once per file through usePdf (kept for the session, in its own scope)
const pdfThumbs = new Map<string, Promise<string | null>>()
function pdfThumb(src: string) {
  let p = pdfThumbs.get(src)
  if (!p) {
    p = new Promise((resolve) => {
      effectScope(true).run(() => {
        const pdf = usePdf(src)
        // An encrypted file (or a broken one) has no picture
        watch([pdf.doc, pdf.needsPassword, pdf.error], ([doc, locked, err]) => {
          if (locked || err) resolve(null)
          else if (doc) pdf.thumbnail(1, 280).then(resolve, () => resolve(null))
        }, { immediate: true })
      })
    })
    pdfThumbs.set(src, p)
  }
  return p
}
</script>

<script setup lang="ts">
/* The picture of an item: a folder in its color, a PDF's first page, a photo, a poster or a cover. */
import { ref, watchEffect } from 'vue'
import { MIcon } from '@m3ui-vue/m3ui-vue'
import { KIND_COLOR, KIND_ICON } from '../useFiles'
import type { Item } from '../data'

const props = defineProps<{ item: Item }>()

const url = ref<string | null>(null)
watchEffect(() => {
  const i = props.item
  url.value = i.kind === 'image' ? i.src ?? null : i.thumb ?? null
  if (i.kind === 'pdf' && i.src) {
    const src = i.src
    pdfThumb(src).then((u) => { if (props.item.src === src) url.value = u })
  }
})
</script>

<template>
  <div class="relative flex items-center justify-center overflow-hidden bg-surface-container-high">
    <img
      v-if="url && item.kind !== 'folder'"
      :src="url"
      alt=""
      class="h-full w-full"
      :class="item.kind === 'pdf' ? 'object-cover object-top' : 'object-cover'"
      loading="lazy"
      draggable="false"
    />
    <MIcon v-else :name="item.kind === 'pdf' && item.name.includes('password') ? 'lock' : KIND_ICON[item.kind]" :size="48" filled :style="{ color: item.color ?? KIND_COLOR[item.kind] }" />
    <span v-if="item.kind === 'video'" class="absolute flex size-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm">
      <MIcon name="play_arrow" :size="28" filled />
    </span>
  </div>
</template>
