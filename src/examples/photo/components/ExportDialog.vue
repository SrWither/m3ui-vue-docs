<script setup lang="ts">
/* File name, format, quality and size, with the resulting dimensions; downloads the file. */
import { computed, ref, watch } from 'vue'
import { MButton, MDialog, MSegmentedButton, MSelect, MSlider, MTextField, useToast } from '@m3ui-vue/m3ui-vue'
import { usePhoto } from '../usePhoto'

const p = usePhoto()
const { dialogs, doc } = p
const toast = useToast()

const name = ref('')
const format = ref<string | number | (string | number)[]>('image/jpeg')
const quality = ref(90)
const scale = ref<unknown>(1)
const busy = ref(false)
watch(() => dialogs.export, (open) => { if (open) name.value = `${doc.value.name} (edited)` })

const formats = [
  { value: 'image/jpeg', label: 'JPEG' },
  { value: 'image/png', label: 'PNG' },
  { value: 'image/webp', label: 'WebP' },
]
const sizes = [
  { value: 1, label: 'Full size' },
  { value: 0.75, label: '75%' },
  { value: 0.5, label: '50%' },
  { value: 0.25, label: '25%' },
]
const ext = computed(() => ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' })[format.value as string])
const dims = computed(() => {
  const r = p.viewRect(false)
  const k = scale.value as number
  return `${Math.round(r.w * k)} × ${Math.round(r.h * k)} px`
})

async function save() {
  busy.value = true
  const blob = await p.exportBlob(format.value as string, quality.value / 100, scale.value as number)
  busy.value = false
  if (!blob) return toast.error('Export failed')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${name.value.trim() || 'photo'}.${ext.value}`
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  dialogs.export = false
  toast.success(`Saved ${a.download} (${(blob.size / 1024 / 1024).toFixed(1)} MB)`, { icon: 'download_done' })
}
</script>

<template>
  <MDialog v-model="dialogs.export" title="Export" max-width="440px">
    <div class="flex flex-col gap-5">
      <MTextField v-model="name" label="File name" :hint="`.${ext}`" />
      <div>
        <p class="mb-2 text-label-large text-on-surface-variant">Format</p>
        <MSegmentedButton v-model="format" :options="formats" />
      </div>
      <div v-if="format !== 'image/png'">
        <div class="mb-1 flex justify-between text-label-large text-on-surface-variant">
          <span>Quality</span><span class="tabular-nums">{{ quality }}%</span>
        </div>
        <MSlider v-model="quality" :min="30" :max="100" aria-label="Quality" />
      </div>
      <MSelect v-model="scale" :options="sizes" label="Size" variant="outlined" :hint="dims" />
    </div>
    <template #actions>
      <MButton variant="text" @click="dialogs.export = false">Cancel</MButton>
      <MButton icon="download" :loading="busy" @click="save">Export</MButton>
    </template>
  </MDialog>
</template>
