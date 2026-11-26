<script setup lang="ts">
import { ref } from 'vue'
import { MCard, MQRScanner } from '@m3ui-vue/m3ui-vue'
import type { ScanResult } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const reads = ref<ScanResult[]>([])
const onDetect = (r: ScanResult) => reads.value.unshift(r)
const isUrl = (s: string) => /^https?:\/\//.test(s)

const scannerProps: PropDef[] = [
  { name: 'modelValue', type: 'string | null', default: 'null', description: 'The last code read (v-model).' },
  { name: 'formats', type: 'string[]', default: "['qr_code']", description: "What BarcodeDetector looks for: 'qr_code', 'ean_13', 'code_128', 'data_matrix'…" },
  { name: 'detector', type: 'ScanDetector', description: 'Your reader for browsers without BarcodeDetector (Firefox, desktop Safari): (frame: ImageData) => { rawValue, format } | null, e.g. jsQR(frame.data, frame.width, frame.height).' },
  { name: 'once', type: 'boolean', default: 'false', description: 'Stop the camera after the first code.' },
  { name: 'interval', type: 'number', default: '250', description: 'How often to look, in ms.' },
  { name: 'facing', type: "'environment' | 'user'", default: "'environment'", description: 'Which camera.' },
  { name: 'autostart', type: 'boolean', default: 'false', description: 'Start on mount instead of on a button press.' },
  { name: 'aspect', type: 'string', default: "'1 / 1'", description: 'The preview\'s aspect ratio.' },
]
const scannerEvents: EventDef[] = [
  { name: 'detect', payload: 'ScanResult', description: '{ rawValue, format }: a code was read (the same one isn\'t repeated for 2 s).' },
  { name: 'update:modelValue', payload: 'string', description: 'A code was read (its text).' },
  { name: 'error', payload: "'denied' | 'unavailable' | 'unsupported' | 'failed'", description: 'The camera failed; the component already says so.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MQRScanner</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Reads QR codes and barcodes with the camera, through an M3 viewfinder that flashes on each read. It uses the
      browser's BarcodeDetector (Chrome and Edge, on Android and desktop); in browsers without it (Firefox, desktop
      Safari), pass a detector of yours, such as jsQR, or it says the browser can't. Needs https (or localhost): try it
      on a phone with any QR code.
    </p>

    <ComponentDemo
      title="Scan, and list what's read"
      description="Turn the camera on and point it at a QR code: each read is listed (links open). The same code isn't repeated for two seconds."
      :code="`<MQRScanner @detect=&quot;(r) => reads.unshift(r)&quot; />`"
      :script="`import { MQRScanner } from '@m3ui-vue/m3ui-vue'
// Where BarcodeDetector is missing:
// import jsQR from 'jsqr'
// const detector = (f) => { const c = jsQR(f.data, f.width, f.height); return c && { rawValue: c.data, format: 'qr_code' } }
// <MQRScanner :detector=&quot;detector&quot; />`"
    >
      <MCard variant="outlined" class="flex w-full max-w-sm flex-col gap-3 p-4">
        <MQRScanner @detect="onDetect" />
        <ul class="flex max-h-40 flex-col gap-1 overflow-y-auto text-body-medium">
          <li v-if="!reads.length" class="text-on-surface-variant">Nothing read yet</li>
          <li v-for="(r, i) in reads" :key="i" class="truncate">
            <span class="text-label-small text-on-surface-variant">{{ r.format }}</span>
            <a v-if="isUrl(r.rawValue)" :href="r.rawValue" target="_blank" rel="noopener" class="ml-2 text-primary underline">{{ r.rawValue }}</a>
            <span v-else class="ml-2">{{ r.rawValue }}</span>
          </li>
        </ul>
      </MCard>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="scannerProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="scannerEvents" />

    <ComponentPager current="MQRScanner" />
  </div>
</template>
