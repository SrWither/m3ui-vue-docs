<script setup lang="ts">
import { ref } from 'vue'
import { MAvatar, MButton, MFileUpload, MImageCropper, type CropRect } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const photo = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80'

// ── Basic ───────────────────────────────────────────────────────────────────────────────────────────────
const crop = ref<CropRect | null>(null)
const aspect = ref<number | null>(null)
const rotation = ref<0 | 90 | 180 | 270>(0)
const cropper = ref<InstanceType<typeof MImageCropper>>()
const result = ref<string | null>(null)
async function apply() {
  const blob = await cropper.value?.toBlob({ maxSize: 800 })
  if (!blob) return
  if (result.value) URL.revokeObjectURL(result.value)
  result.value = URL.createObjectURL(blob)
}

// ── Avatar ──────────────────────────────────────────────────────────────────────────────────────────────
const file = ref<File | string>('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&q=80')
const avatarCropper = ref<InstanceType<typeof MImageCropper>>()
const avatar = ref<string | undefined>()
function pick(files: File[]) {
  if (files[0]) file.value = files[0]
}
async function save() {
  const blob = await avatarCropper.value?.toBlob({ width: 256, height: 256 })
  if (!blob) return
  if (avatar.value) URL.revokeObjectURL(avatar.value)
  avatar.value = URL.createObjectURL(blob)
}

const props: PropDef[] = [
  { name: 'src', type: 'string | File | Blob', description: 'The picture: a URL, or a file (e.g. from MFileUpload). One from another origin must allow CORS to be exported' },
  { name: 'crop', type: 'CropRect', description: 'The frame, { x, y, width, height } in the rotated picture\'s own pixels (v-model:crop); default the whole picture, or the largest frame of the aspect' },
  { name: 'aspect', type: 'number | null', default: 'null', description: 'Width over height (1, 4 / 3, 16 / 9…); null is free (v-model:aspect)' },
  { name: 'aspects', type: 'CropAspect[]', description: 'Aspects offered as chips in the toolbar: { label, value } (label \'\' shows "Free")' },
  { name: 'rotation', type: '0 | 90 | 180 | 270', default: '0', description: 'Quarter turns clockwise (v-model:rotation)' },
  { name: 'flipped', type: 'boolean', default: 'false', description: 'Mirrored left to right before it turns (v-model:flipped)' },
  { name: 'shape', type: "'rect' | 'circle'", default: "'rect'", description: 'circle shows a round frame (for avatars) and exports round, transparent outside' },
  { name: 'minSize', type: 'number', default: '24', description: "The frame's smallest side, in the picture's px" },
  { name: 'guides', type: "'drag' | 'always' | 'never'", default: "'drag'", description: 'The rule-of-thirds grid' },
  { name: 'controls', type: 'boolean', default: 'true', description: 'Rotate, flip, reset and the aspect chips under the picture' },
  { name: 'alt', type: 'string', description: "The picture's accessible name" },
]
const events: EventDef[] = [
  { name: 'update:crop / aspect / rotation / flipped', payload: '…', description: 'v-model updates' },
  { name: 'change', payload: 'CropRect', description: 'A drag or a key finished changing the frame' },
  { name: 'load', payload: '{ width, height }', description: 'The picture loaded (its natural size)' },
  { name: 'error', payload: 'Event', description: "The picture didn't load" },
]
const slots: SlotDef[] = [
  { name: 'controls', scope: '{ rotate, flip, reset, aspect, setAspect }', description: 'Instead of the toolbar' },
]
const methods: PropDef[] = [
  { name: 'toCanvas(options?)', type: 'HTMLCanvasElement | null', description: 'The cropped picture: { width, height, maxSize, circle }; one size alone keeps the proportions' },
  { name: 'toBlob(options?)', type: 'Promise<Blob | null>', description: 'The same as a file: also { type, quality } (default JPEG, PNG when round)' },
  { name: 'rotate(1 | -1) / flip() / reset() / setAspect(a)', type: 'function', description: 'What the toolbar does' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MImageCropper</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Crop a picture: drag the frame to move it, its corners and edges to resize it (a rule-of-thirds grid shows
      while you do), at a fixed aspect or free, square or round. Rotate a quarter turn at a time and flip; the frame
      turns with the picture. The template ref exports the result as a canvas or a file. Arrow keys move the frame,
      Shift + arrows resize it. Not an M3 spec component.
    </p>

    <ComponentDemo
      title="Basic"
      description="Pick an aspect, drag the frame, then Crop to get the result as a Blob."
      flush
      :code="`<MImageCropper
  ref=&quot;cropper&quot;
  v-model:crop=&quot;crop&quot;
  v-model:aspect=&quot;aspect&quot;
  v-model:rotation=&quot;rotation&quot;
  :src=&quot;photo&quot;
  :aspects=&quot;[{ label: '', value: null }, { label: '1:1', value: 1 }, { label: '4:3', value: 4 / 3 }, { label: '16:9', value: 16 / 9 }]&quot;
  class=&quot;h-[420px]&quot;
/>
<MButton @click=&quot;apply&quot;>Crop</MButton>`"
      :script="`const cropper = ref<InstanceType<typeof MImageCropper>>()
async function apply() {
  const blob = await cropper.value?.toBlob({ maxSize: 800 })
  result.value = URL.createObjectURL(blob)
}`"
    >
      <div class="grid gap-4 p-4 sm:p-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <MImageCropper
          ref="cropper"
          v-model:crop="crop"
          v-model:aspect="aspect"
          v-model:rotation="rotation"
          :src="photo"
          alt="Mountains at sunrise"
          :aspects="[{ label: '', value: null }, { label: '1:1', value: 1 }, { label: '4:3', value: 4 / 3 }, { label: '16:9', value: 16 / 9 }]"
          class="h-[420px]"
        />
        <div class="flex flex-col gap-3">
          <MButton icon="crop" class="self-start" @click="apply">Crop</MButton>
          <code v-if="crop" class="text-body-small text-on-surface-variant">{{ crop }} · {{ rotation }}°</code>
          <img v-if="result" :src="result" alt="The cropped picture" class="max-h-72 self-start rounded-md object-contain" />
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Avatar"
      description="A round frame at 1:1 over a file you pick; Save exports a 256 × 256 PNG, transparent outside the circle."
      flush
      :code="`<MFileUpload accept=&quot;image/*&quot; @select=&quot;pick&quot; />
<MImageCropper ref=&quot;cropper&quot; :src=&quot;file&quot; :aspect=&quot;1&quot; shape=&quot;circle&quot; guides=&quot;never&quot; class=&quot;h-80&quot; />
<MButton @click=&quot;save&quot;>Save</MButton>`"
      :script="`function pick(files: File[]) { file.value = files[0] }
async function save() {
  const blob = await cropper.value?.toBlob({ width: 256, height: 256 }) // PNG, round
  avatar.value = URL.createObjectURL(blob)
}`"
    >
      <div class="grid gap-4 p-4 sm:p-6 md:grid-cols-2">
        <div class="flex flex-col gap-3">
          <MImageCropper ref="avatarCropper" :src="file" :aspect="1" shape="circle" guides="never" alt="Your picture" class="h-80" />
          <MFileUpload accept="image/*" @select="pick" />
        </div>
        <div class="flex flex-col items-center gap-4">
          <img v-if="avatar" :src="avatar" alt="Your new avatar" class="size-32 rounded-full bg-surface-container-highest" />
          <MAvatar v-else name="You" :size="128" />
          <MButton icon="save" @click="save">Save</MButton>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mt-6 mb-3 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />
    <h3 class="mt-6 mb-3 text-title-large font-medium">Template ref</h3>
    <PropsTable :props="methods" />

    <ComponentPager current="MImageCropper" />
  </div>
</template>
