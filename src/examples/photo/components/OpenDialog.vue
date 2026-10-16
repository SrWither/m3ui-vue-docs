<script setup lang="ts">
/* Pick a sample photo or open one of your own (it never leaves the browser). */
import { computed, ref } from 'vue'
import { MButton, MDialog, MFileUpload, type UploadFile } from '@m3ui-vue/m3ui-vue'
import { sampleThumb, samples } from '../samples'
import { usePhoto } from '../usePhoto'

const { dialogs, openSample, openFile, hasEdits } = usePhoto()
const files = ref<UploadFile[]>([])
// Drawn on first open, not when the example loads.
const thumbs = computed(() => (dialogs.open ? Object.fromEntries(samples.map((s) => [s.id, sampleThumb(s.id)])) : {}))

function pickSample(id: string) {
  openSample(id)
  dialogs.open = false
}
function onSelect(list: UploadFile[]) {
  const f = list[0]?.file
  files.value = []
  if (!f) return
  openFile(f)
  dialogs.open = false
}
</script>

<template>
  <MDialog v-model="dialogs.open" title="Open a photo" max-width="560px">
    <p v-if="hasEdits" class="mb-4 text-body-medium text-on-surface-variant">Opening another photo replaces this one and its history. Export it first if you want to keep it.</p>
    <p class="mb-2 text-label-large text-on-surface-variant">Samples</p>
    <div class="mb-5 grid grid-cols-3 gap-3">
      <button
        v-for="s in samples"
        :key="s.id"
        type="button"
        class="group flex flex-col gap-1.5 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-secondary"
        @click="pickSample(s.id)"
      >
        <span class="block aspect-3/2 w-full overflow-hidden rounded-lg bg-surface-container-highest">
          <img v-if="thumbs[s.id]" :src="thumbs[s.id]" alt="" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </span>
        <span class="text-label-medium text-on-surface">{{ s.name }}</span>
      </button>
    </div>
    <p class="mb-2 text-label-large text-on-surface-variant">From your device</p>
    <MFileUpload v-model="files" accept="image/*" drop-text="Drop a photo here" @select="onSelect" />
    <template #actions>
      <MButton variant="text" @click="dialogs.open = false">Cancel</MButton>
    </template>
  </MDialog>
</template>
