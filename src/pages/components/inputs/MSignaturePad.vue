<script setup lang="ts">
import { ref } from 'vue'
import { MSignaturePad, MButton, MCard } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const signaturePad = ref<InstanceType<typeof MSignaturePad>>()
const signatureLog = ref('')
function onSignatureEnd() { signatureLog.value = '@end fired — signature captured' }

const signaturePadProps: PropDef[] = [
  { name: 'width', type: 'number', default: '400', description: 'Canvas width in px' },
  { name: 'height', type: 'number', default: '200', description: 'Canvas height in px' },
  { name: 'lineWidth', type: 'number', default: '2.5', description: 'Stroke width' },
  { name: 'color', type: 'string', default: "'#000000'", description: 'Stroke color' },
  { name: 'background', type: 'string', default: "'#ffffff'", description: 'Canvas background color' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'outlined'", description: 'Container border style' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables drawing' },
]

const signaturePadEvents: EventDef[] = [
  { name: 'begin', description: 'Fires on the first pointerdown of a new stroke' },
  { name: 'end', payload: 'string', description: 'Fires after a stroke ends, with a PNG data: URL of the canvas' },
  { name: 'change', payload: 'string', description: 'Fires alongside end, and also after undo() — same data: URL payload' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSignaturePad</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A bordered canvas that captures pointer strokes for signature capture. There's no v-model, since a signature
      isn't a simple value — read it out via events or the exposed methods.
    </p>

    <ComponentDemo
      title="Signature capture"
      description="clear(), undo(), isEmpty() and toDataURL() are exposed via a template ref — built for 2FA/verification and consent flows."
      :code="`<MSignaturePad ref=&quot;pad&quot; @end=&quot;onSignatureEnd&quot; />
<MButton @click=&quot;pad.clear()&quot;>Clear</MButton>
<MButton @click=&quot;pad.undo()&quot;>Undo</MButton>`"
      :script="`const pad = ref()

function onSignatureEnd(dataUrl: string) {
  // Called after each stroke — dataUrl is a PNG data: URL
}`"
    >
      <div class="flex flex-col items-start gap-3">
        <MSignaturePad ref="signaturePad" @end="onSignatureEnd" />
        <div class="flex items-center gap-2">
          <MButton variant="outlined" size="sm" icon="undo" @click="signaturePad?.undo()">Undo</MButton>
          <MButton variant="outlined" size="sm" icon="delete" @click="signaturePad?.clear()">Clear</MButton>
          <span class="text-body-medium text-on-surface-variant">{{ signatureLog }}</span>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="signaturePadProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="signaturePadEvents" />

    <MCard class="mt-4 border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Exposed (via template ref)</p>
      <pre class="overflow-x-auto rounded-lg bg-surface-container p-3 text-body-small"><code>clear()                          — Erases every stroke
undo()                           — Removes only the last stroke
isEmpty(): boolean               — True if no strokes have been drawn
toDataURL(type?, quality?): string — Same signature as HTMLCanvasElement.toDataURL()</code></pre>
    </MCard>

    <ComponentPager current="MSignaturePad" />
  </div>
</template>
