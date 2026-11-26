<script setup lang="ts">
import { ref } from 'vue'
import { MAudioRecorder, MCard } from '@m3ui-vue/m3ui-vue'
import type { AudioRecording } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const note = ref<AudioRecording | null>(null)
const sent = ref<AudioRecording[]>([])
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

const recProps: PropDef[] = [
  { name: 'modelValue', type: 'AudioRecording | null', default: 'null', description: 'The recording used (v-model): { blob, url, duration, mimeType, peaks }. Shown with play and its waveform while idle.' },
  { name: 'maxDuration', type: 'number', default: '0', description: 'Stop by itself after this many seconds (0: no limit).' },
  { name: 'bars', type: 'number', default: '40', description: 'How many bars the waveform has (also the length of peaks).' },
  { name: 'instant', type: 'boolean', default: 'false', description: 'Skip the review: a stopped recording is used right away (a chat\'s send-on-release).' },
  { name: 'mimeType', type: 'string', description: 'The format to ask for when the browser can record it; by default WebM/Opus, else MP4 (Safari).' },
]
const recEvents: EventDef[] = [
  { name: 'record', payload: 'AudioRecording', description: 'The recording used: upload the blob.' },
  { name: 'update:modelValue', payload: 'AudioRecording | null', description: 'The recording used, or null after Discard.' },
  { name: 'error', payload: "'denied' | 'unavailable' | 'unsupported' | 'failed'", description: 'The microphone failed; the component already says so.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MAudioRecorder</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Records a voice note: a live waveform and timer while recording (pause, resume, stop, discard), then the recording
      to play back over its own waveform and send or discard. Out comes a Blob with its duration and waveform peaks.
      The microphone is only on while recording. Needs https (or localhost): try it on a phone too.
    </p>

    <ComponentDemo
      title="Voice notes, as in a chat"
      description="Record, listen over its waveform, then send: sent notes are listed above, played from their blob URL. Limited to a minute."
      :code="`<MAudioRecorder v-model=&quot;note&quot; :max-duration=&quot;60&quot; @record=&quot;send&quot; />`"
      :script="`import { MAudioRecorder } from '@m3ui-vue/m3ui-vue'

async function send({ blob, duration, peaks }) {
  const body = new FormData()
  body.append('audio', blob)
  body.append('peaks', JSON.stringify(peaks))
  await fetch('/api/messages/voice', { method: 'POST', body })
}`"
    >
      <MCard variant="outlined" class="flex w-full max-w-md flex-col gap-3 p-4">
        <div v-for="(n, i) in sent" :key="i" class="flex items-center gap-2 self-end rounded-2xl rounded-br-sm bg-primary-container px-3 py-2 text-on-primary-container">
          <audio :src="n.url" controls class="h-8 w-48" />
          <span class="font-mono text-label-small">{{ fmt(n.duration) }}</span>
        </div>
        <MAudioRecorder v-model="note" :max-duration="60" @record="(r: AudioRecording) => { sent.push(r); note = null }" />
      </MCard>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="recProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="recEvents" />
    <p class="mt-4 text-body-medium text-on-surface-variant">
      A template ref exposes <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">start()</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">pause()</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">resume()</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">stop()</code> and
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">discard()</code>.
    </p>

    <ComponentPager current="MAudioRecorder" />
  </div>
</template>
