<script setup lang="ts">
/*
 * A file opened full screen over the drive: PDFs in MPdfViewer (annotations saved with the file), videos in
 * MVideoPlayer and audio in MAudioPlayer, both stepping through the other files of their kind in that folder.
 * Escape or the back arrow closes it.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { MAudioPlayer, MVideoPlayer } from '@m3ui-vue/m3ui-vue/media'
import { MPdfViewer, type PdfAnnotation } from '@m3ui-vue/m3ui-vue/pdf'
import { MIcon, MIconButton, MTooltip } from '@m3ui-vue/m3ui-vue'
import { KIND_COLOR, KIND_ICON, useFiles } from '../useFiles'

const props = defineProps<{ id: string; wide: boolean }>()
const f = useFiles()
const item = computed(() => f.byId(props.id))

// The other files of the same kind beside it, for previous / next
const siblings = computed(() => {
  const i = item.value
  return i ? f.items.value.filter((x) => x.kind === i.kind && x.parent === i.parent && !x.trashed) : []
})
const at = computed(() => siblings.value.findIndex((x) => x.id === props.id))
const step = (d: number) => {
  const next = siblings.value[at.value + d]
  if (next) f.viewing.value = next.id
}
const playing = ref(true)

const close = () => (f.viewing.value = null)
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && !e.defaultPrevented) close()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

const annotations = computed({
  get: () => item.value?.annotations ?? [],
  set: (list: PdfAnnotation[]) => f.setAnnotations(props.id, list),
})
</script>

<template>
  <div v-if="item" class="fixed inset-0 z-50 flex flex-col bg-surface-container-lowest text-on-surface" role="dialog" aria-modal="true" :aria-label="item.name">
    <header class="flex h-14 shrink-0 items-center gap-2 bg-surface-container-low px-2">
      <MIconButton icon="arrow_back" label="Close" @click="close" />
      <MIcon :name="KIND_ICON[item.kind]" :size="22" filled :style="{ color: KIND_COLOR[item.kind] }" />
      <p class="min-w-0 flex-1 truncate text-title-medium">{{ item.name }}</p>
      <MTooltip :text="item.starred ? 'Remove from Starred' : 'Add to Starred'">
        <MIconButton :icon="item.starred ? 'star' : 'star_outline'" :label="item.starred ? 'Remove from Starred' : 'Add to Starred'" @click="f.toggleStar([item])" />
      </MTooltip>
      <MTooltip text="Download"><MIconButton icon="download" label="Download" @click="f.download(item)" /></MTooltip>
      <MTooltip text="Move to trash"><MIconButton icon="delete" label="Move to trash" @click="f.trash([item])" /></MTooltip>
    </header>

    <div class="relative min-h-0 flex-1">
      <MPdfViewer
        v-if="item.kind === 'pdf'"
        :key="item.id"
        v-model:annotations="annotations"
        :src="item.src"
        :file-name="item.name"
        :title="wide ? undefined : ''"
        annotate
        author="You"
        :sidebar="wide ? 'thumbnails' : null"
        class="absolute inset-0"
      />

      <div v-else-if="item.kind === 'video'" class="absolute inset-0 flex items-center justify-center bg-black p-0 sm:p-6">
        <MVideoPlayer
          v-model:playing="playing"
          :src="item.src"
          :poster="item.thumb"
          :title="item.name.replace(/\.\w+$/, '')"
          :has-previous="at > 0"
          :has-next="at < siblings.length - 1"
          autoplay
          class="max-h-full w-full max-w-6xl sm:rounded-xl"
          @previous="step(-1)"
          @next="step(1)"
          @ended="step(1)"
        />
      </div>

      <div v-else-if="item.kind === 'audio'" class="absolute inset-0 flex items-center justify-center overflow-y-auto p-6">
        <div class="flex w-full max-w-md flex-col items-center gap-6">
          <img :src="item.thumb" alt="" class="aspect-square w-full max-w-80 rounded-3xl object-cover shadow-elevation-3" />
          <MAudioPlayer
            v-model:playing="playing"
            :src="item.src"
            :title="item.name.replace(/\.\w+$/, '')"
            :artist="item.artist"
            :has-previous="at > 0"
            :has-next="at < siblings.length - 1"
            :speeds="[0.75, 1, 1.25, 1.5]"
            seek-bar="wavy"
            autoplay
            class="w-full"
            @previous="step(-1)"
            @next="step(1)"
            @ended="step(1)"
          >
            <template #artwork><span /></template>
          </MAudioPlayer>
        </div>
      </div>
    </div>
  </div>
</template>
