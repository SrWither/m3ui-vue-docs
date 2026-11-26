<script setup lang="ts">
import { ref } from 'vue'
import { MCameraCapture, MCard } from '@m3ui-vue/m3ui-vue'
import type { CameraPhoto } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const photo = ref<string | null>(null)
const info = ref('')
function onCapture(p: CameraPhoto) {
  info.value = `${p.width}×${p.height}, ${Math.round(p.blob.size / 1024)} KB ${p.blob.type}`
}

const cameraProps: PropDef[] = [
  { name: 'modelValue', type: 'string | null', default: 'null', description: 'The photo used (v-model), as a data URL.' },
  { name: 'facing', type: "'environment' | 'user'", default: "'environment'", description: 'Which camera to start with: the back one, or the selfie one (previewed mirrored, saved as is).' },
  { name: 'aspect', type: 'string', default: "'4 / 3'", description: 'The preview\'s aspect ratio.' },
  { name: 'type / quality', type: "'image/jpeg' | 'image/png' | 'image/webp' / number", default: "'image/jpeg' / 0.9", description: 'The photo\'s format and quality.' },
  { name: 'resolution', type: 'number', default: '1920', description: 'The resolution asked for (the longer side, ideal).' },
  { name: 'autostart', type: 'boolean', default: 'false', description: 'Start the camera on mount instead of on a button press (the browser asks for permission either way).' },
]
const cameraEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'string | null', description: 'The photo used, or null after Retake.' },
  { name: 'capture', payload: 'CameraPhoto', description: '{ blob, dataUrl, width, height }: upload the blob.' },
  { name: 'error', payload: "'denied' | 'unavailable' | 'unsupported' | 'failed'", description: 'The camera failed; the component already says so.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MCameraCapture</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Takes a photo with the device's camera: a live preview, a shutter, front / back switching, then Retake or Use photo.
      The photo comes out as a Blob to upload and a data URL to show. The camera only starts on a press (or autostart),
      stops once the photo is used and when the component goes away, and a denied permission says so. It needs https
      (or localhost). Try it on a phone.
    </p>

    <ComponentDemo
      title="A profile photo"
      description="Turn the camera on, take the photo, then use it or retake it. On a phone the back camera starts and the switch button appears."
      :code="`<MCameraCapture v-model=&quot;photo&quot; @capture=&quot;upload&quot; />`"
      :script="`import { MCameraCapture } from '@m3ui-vue/m3ui-vue'

const photo = ref(null)
async function upload({ blob }) {
  const body = new FormData()
  body.append('photo', blob, 'photo.jpg')
  await fetch('/api/me/photo', { method: 'POST', body })
}`"
    >
      <MCard variant="outlined" class="flex w-full max-w-md flex-col gap-3 p-4">
        <MCameraCapture v-model="photo" @capture="onCapture" />
        <p class="text-body-small text-on-surface-variant">{{ photo ? `Used: ${info}` : 'No photo yet' }}</p>
      </MCard>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="cameraProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="cameraEvents" />
    <p class="mt-4 text-body-medium text-on-surface-variant">
      A template ref exposes <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">start()</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">stop()</code> and
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">capture()</code>.
    </p>

    <ComponentPager current="MCameraCapture" />
  </div>
</template>
