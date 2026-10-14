<script setup lang="ts">
import { computed, ref } from 'vue'
import { MFileUpload, MButton, MCard } from '@m3ui-vue/m3ui-vue'
import type { UploadFile } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

// Upload with progress demo
const uploadFiles = ref<UploadFile[]>([])
const pendingCount = computed(() => uploadFiles.value.filter((f) => f.status === 'pending').length)
const uploading = computed(() => uploadFiles.value.some((f) => f.status === 'uploading'))
function fakeUpload(entry: UploadFile) {
  entry.status = 'uploading'
  entry.progress = 0
  const timer = setInterval(() => {
    entry.progress = Math.min(100, entry.progress + 8 + Math.random() * 18)
    if (entry.progress >= 100) {
      clearInterval(timer)
      entry.status = 'done'
    }
  }, 180)
}
function uploadAll(files: UploadFile[]) {
  files.filter((f) => f.status === 'pending').forEach(fakeUpload)
}

// Template ref demo
const refUpload = ref<InstanceType<typeof MFileUpload> | null>(null)

const fileUploadProps: PropDef[] = [
  { name: 'accept', type: 'string', description: 'Accepted file types (e.g. ".png,.jpg", "image/*")' },
  { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple files' },
  { name: 'maxSize', type: 'number', description: 'Max file size in bytes — oversized files are silently filtered out' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the upload area' },
  { name: 'dropText', type: 'string', description: 'Drop zone main text (defaults to the locale string)' },
  { name: 'selectText', type: 'string', description: 'Drop zone select link text (defaults to the locale string)' },
  { name: 'maxSizePrefix', type: 'string', description: 'Prefix shown before the formatted max size (defaults to the locale string)' },
  { name: 'removeLabel', type: 'string', description: 'Aria label for each file row\'s remove button (defaults to the locale string)' },
  { name: 'modelValue', type: 'UploadFile[]', description: 'Optional v-model with the file list. Bind it to own the list: set it to [] to clear it, or update entries\' status/progress. Unbound, the component keeps the list itself' },
]

const fileUploadEvents: EventDef[] = [
  { name: 'select', payload: 'UploadFile[]', description: 'Emitted with the newly accepted files whenever files are added (drop or picker)' },
  { name: 'remove', payload: 'UploadFile', description: 'Emitted when a file is removed from the list with its remove button' },
  { name: 'update:modelValue', payload: 'UploadFile[]', description: 'Emitted with the new list whenever files are added, removed or cleared (v-model)' },
]

const fileUploadSlots: SlotDef[] = [
  { name: 'dropzone', description: 'Replaces the default icon + text content of the drop zone' },
  { name: '#actions', description: 'Right-aligned row below the list, shown only while it has files. Scope: { files: UploadFile[], clear: () => void }. Put your Upload / Clear buttons here' },
]

const fileUploadTypes: TypeDef[] = [
  {
    name: 'UploadFile',
    description: 'One entry per selected file, passed to the select/remove events and held in v-model. Entries are reactive: setting status/progress on them updates the row.',
    fields: [
      { name: 'file', type: 'File', required: true, description: 'The native File object' },
      { name: 'id', type: 'string', required: true, description: 'Generated unique id (crypto.randomUUID())' },
      { name: 'progress', type: 'number', required: true, description: 'Upload progress 0–100, shown as a bar while status is uploading. You set it; the component never uploads anything itself' },
      { name: 'status', type: "'pending' | 'uploading' | 'done' | 'error'", required: true, description: 'Current upload status, shown as a spinner/check/error icon' },
      { name: 'preview', type: 'string', description: 'Object URL for image previews, revoked automatically when the entry leaves the list' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MFileUpload</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A drag-and-drop file upload zone with image previews, per-file size formatting, and progress/status display. It only selects files: uploading them is up to you, and each entry's status and progress show how it's going.
    </p>

    <ComponentDemo
      title="File Upload"
      description="Drag-and-drop file upload zone with preview and progress tracking."
      :code="`<template>
  <MFileUpload accept=&quot;image/*,.pdf&quot; :multiple=&quot;true&quot; @select=&quot;handleFiles&quot; />
</template>`"
    >
      <div class="mx-auto w-full max-w-lg">
        <MFileUpload accept="image/*,.pdf" :multiple="true" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Single File"
      description="Restrict to a single file upload — a new selection replaces the previous file."
      :code="`<template>
  <MFileUpload accept=&quot;.pdf&quot; />
</template>`"
    >
      <div class="mx-auto w-full max-w-lg">
        <MFileUpload accept=".pdf" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Max Size & Disabled"
      description="maxSize (in bytes) filters out oversized files and is shown formatted in the drop zone text via maxSizePrefix. disabled greys out the whole zone."
      :code="`<template>
  <MFileUpload :max-size=&quot;2 * 1024 * 1024&quot; />
  <MFileUpload :disabled=&quot;true&quot; />
</template>`"
    >
      <div class="flex w-full flex-col gap-4">
        <MFileUpload :max-size="2 * 1024 * 1024" />
        <MFileUpload :disabled="true" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Upload with progress"
      description="Bind v-model to own the list, and use the #actions slot for your buttons. Setting status and progress on each entry drives its progress bar, spinner and check. Here the upload is simulated; in an app, set progress from your request's upload events."
      :code="`<MFileUpload v-model=&quot;files&quot; accept=&quot;image/*,.pdf&quot; multiple>
  <template #actions=&quot;{ files, clear }&quot;>
    <MButton variant=&quot;text&quot; :disabled=&quot;uploading&quot; @click=&quot;clear&quot;>Clear</MButton>
    <MButton icon=&quot;upload&quot; :disabled=&quot;!pendingCount || uploading&quot; @click=&quot;uploadAll(files)&quot;>
      Upload {{ pendingCount || '' }}
    </MButton>
  </template>
</MFileUpload>`"
      :script="`import type { UploadFile } from '@m3ui-vue/m3ui-vue'

const files = ref<UploadFile[]>([])
const pendingCount = computed(() => files.value.filter((f) => f.status === 'pending').length)
const uploading = computed(() => files.value.some((f) => f.status === 'uploading'))

function uploadAll(list: UploadFile[]) {
  for (const entry of list.filter((f) => f.status === 'pending')) {
    entry.status = 'uploading'
    const body = new FormData()
    body.append('file', entry.file)
    axios
      .post('/api/upload', body, {
        onUploadProgress: (e) => (entry.progress = Math.round((e.loaded / (e.total ?? 1)) * 100)),
      })
      .then(() => (entry.status = 'done'))
      .catch(() => (entry.status = 'error'))
  }
}`"
    >
      <div class="mx-auto w-full max-w-lg">
        <MFileUpload v-model="uploadFiles" accept="image/*,.pdf" multiple>
          <template #actions="{ files, clear }">
            <MButton variant="text" :disabled="uploading" @click="clear">Clear</MButton>
            <MButton icon="upload" :disabled="!pendingCount || uploading" @click="uploadAll(files)">
              Upload {{ pendingCount || '' }}
            </MButton>
          </template>
        </MFileUpload>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Clear from a template ref"
      description="Without v-model, the component keeps the list itself and exposes clear() through a template ref, for example to reset the field after a form is submitted."
      :code="`<MFileUpload ref=&quot;upload&quot; multiple />
<MButton variant=&quot;outlined&quot; icon=&quot;delete_sweep&quot; @click=&quot;upload.clear()&quot;>Clear list</MButton>`"
      :script="`const upload = ref()`"
    >
      <div class="mx-auto flex w-full max-w-lg flex-col gap-3">
        <MFileUpload ref="refUpload" multiple />
        <MButton variant="outlined" icon="delete_sweep" class="self-start" @click="refUpload?.clear()">Clear list</MButton>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="fileUploadProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="fileUploadEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="fileUploadSlots" />

    <MCard variant="outlined" class="mb-6 p-4">
      <p class="mb-2 text-title-small font-medium">Exposed (via template ref)</p>
      <pre class="overflow-x-auto rounded-lg bg-surface-container p-3 text-body-small"><code>clear()               — Empties the list (also updates v-model when bound)
files: UploadFile[]   — The current list</code></pre>
    </MCard>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="fileUploadTypes" />

    <ComponentPager current="MFileUpload" />
  </div>
</template>
