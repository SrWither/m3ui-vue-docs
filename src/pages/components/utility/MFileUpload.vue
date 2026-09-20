<script setup lang="ts">
import { MFileUpload } from '@m3ui-vue/m3ui-vue'
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

const fileUploadProps: PropDef[] = [
  { name: 'accept', type: 'string', description: 'Accepted file types (e.g. ".png,.jpg", "image/*")' },
  { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple files' },
  { name: 'maxSize', type: 'number', description: 'Max file size in bytes — oversized files are silently filtered out' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the upload area' },
  { name: 'dropText', type: 'string', description: 'Drop zone main text (defaults to the locale string)' },
  { name: 'selectText', type: 'string', description: 'Drop zone select link text (defaults to the locale string)' },
  { name: 'maxSizePrefix', type: 'string', description: 'Prefix shown before the formatted max size (defaults to the locale string)' },
  { name: 'removeLabel', type: 'string', description: 'Aria label for each file row\'s remove button (defaults to the locale string)' },
]

const fileUploadEvents: EventDef[] = [
  { name: 'select', payload: 'UploadFile[]', description: 'Emitted with the newly accepted files whenever files are added (drop or picker)' },
  { name: 'remove', payload: 'UploadFile', description: 'Emitted when a file is removed from the list' },
]

const fileUploadSlots: SlotDef[] = [
  { name: 'dropzone', description: 'Replaces the default icon + text content of the drop zone' },
]

const fileUploadTypes: TypeDef[] = [
  {
    name: 'UploadFile',
    description: 'Internal entry tracked per selected file, passed to select/remove events.',
    fields: [
      { name: 'file', type: 'File', required: true, description: 'The native File object' },
      { name: 'id', type: 'string', required: true, description: 'Generated unique id (crypto.randomUUID())' },
      { name: 'progress', type: 'number', required: true, description: 'Upload progress 0–100 (the component does not drive this itself)' },
      { name: 'status', type: "'pending' | 'uploading' | 'done' | 'error'", required: true, description: 'Current upload status, shown as a spinner/check/error icon' },
      { name: 'preview', type: 'string', description: 'Object URL for image previews (revoked automatically on removal)' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MFileUpload</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A drag-and-drop file upload zone with image previews, per-file size formatting, and progress/status display.
    </p>

    <ComponentDemo
      title="File Upload"
      description="Drag-and-drop file upload zone with preview and progress tracking."
      :code="`<template>
  <MFileUpload accept=&quot;image/*,.pdf&quot; :multiple=&quot;true&quot; @select=&quot;handleFiles&quot; />
</template>`"
    >
      <div class="w-full max-w-lg">
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
      <div class="w-full max-w-lg">
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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="fileUploadProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="fileUploadEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="fileUploadSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="fileUploadTypes" />

    <ComponentPager current="MFileUpload" />
  </div>
</template>
