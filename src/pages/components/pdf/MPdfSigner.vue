<script setup lang="ts">
import { computed, ref } from 'vue'
import { MPdfSigner } from '@m3ui-vue/m3ui-vue/pdf'
import type { PdfSignField } from '@m3ui-vue/m3ui-vue/pdf'
import { MButton, MSegmentedButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const lease = '/pdf/lease-sign.pdf'

// Where the lease's lines are, as fractions of its pages (as a backend would store them)
const leaseFields = (): PdfSignField[] => [
  { id: 'rules', type: 'checkbox', page: 1, x: 0.117, y: 0.871, width: 0.016, height: 0.0115, label: 'Received the house rules', required: true, signer: 'tenant' },
  { id: 'initials', type: 'initials', page: 1, x: 0.8, y: 0.915, width: 0.09, height: 0.04, label: 'Tenant’s initials', signer: 'tenant' },
  { id: 'landlord', type: 'signature', page: 2, x: 0.114, y: 0.1, width: 0.32, height: 0.052, label: 'Landlord’s signature', signer: 'landlord' },
  { id: 'landlordDate', type: 'date', page: 2, x: 0.161, y: 0.2085, width: 0.2, height: 0.0165, signer: 'landlord', required: true },
  { id: 'tenant', type: 'signature', page: 2, x: 0.548, y: 0.1, width: 0.32, height: 0.052, label: 'Tenant’s signature', signer: 'tenant' },
  { id: 'tenantDate', type: 'date', page: 2, x: 0.595, y: 0.2085, width: 0.2, height: 0.0165, signer: 'tenant', required: true },
]
const fields = ref<PdfSignField[]>(leaseFields())
const signer = ref<'tenant' | 'landlord'>('tenant')
const signerName = computed(() => (signer.value === 'tenant' ? 'Jonah Reyes' : 'Harbourview Properties'))
const signerOptions = [
  { value: 'tenant', label: 'Tenant' },
  { value: 'landlord', label: 'Landlord' },
]
const signerRef = ref<InstanceType<typeof MPdfSigner>>()
const saving = ref(false)
const done = ref('')
async function finish() {
  saving.value = true
  try {
    const bytes = await signerRef.value!.save()
    const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: 'application/pdf' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'lease-signed.pdf'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 10_000)
    done.value = `Saved lease-signed.pdf (${Math.round(bytes.length / 1024)} KB)`
  } finally {
    saving.value = false
  }
}
function restart() {
  fields.value = leaseFields()
  done.value = ''
}

// Preparing: the sender places the fields
const prepared = ref<PdfSignField[]>([])

const props: PropDef[] = [
  { name: 'src', type: 'string | URL | Uint8Array | ArrayBuffer | Blob', description: 'The PDF' },
  { name: 'fields', type: 'PdfSignField[]', default: '[]', description: 'The fields on its pages (v-model:fields): placed, moved and filled' },
  { name: 'mode', type: "'sign' | 'prepare'", default: "'sign'", description: 'sign: fill the fields in order. prepare: place them (add, drag, resize from the corner, arrows to nudge, Delete)' },
  { name: 'signer', type: 'string', description: 'Whose turn it is: only fields with this signer (or none) can be filled; the rest show dimmed' },
  { name: 'signerName', type: 'string', description: 'Fills name fields and starts a typed signature (and initials) with it' },
  { name: 'dateFormat', type: 'Intl.DateTimeFormatOptions', default: "{ dateStyle: 'medium' }", description: 'How date fields write today\'s date' },
  { name: 'types', type: 'PdfSignField[\'type\'][]', default: 'all', description: 'The field types offered in prepare mode' },
  { name: 'workerSrc', type: 'string', description: 'The pdf.js worker URL (MPdfViewer\'s)' },
]
const events: EventDef[] = [
  { name: 'update:fields', payload: 'PdfSignField[]', description: 'The fields changed' },
  { name: 'complete', payload: '—', description: 'Every required field of this signer is filled' },
  { name: 'finish', payload: '—', description: 'Finish was pressed (only when complete): call save() here' },
  { name: 'loaded', payload: 'PdfDocument', description: 'The document loaded' },
]
const types: TypeDef[] = [
  {
    name: 'PdfSignField',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Unique' },
      { name: 'type', type: "'signature' | 'initials' | 'name' | 'date' | 'text' | 'checkbox'", required: true, description: 'Signature and initials are drawn or typed (adopted once, reused); a date fills with today; name with signerName' },
      { name: 'page', type: 'number', required: true, description: '1-based' },
      { name: 'x, y, width, height', type: 'number', required: true, description: 'Fractions (0–1) of the page as shown: left, top, size. Independent of zoom and screen' },
      { name: 'label', type: 'string', description: 'What it asks for' },
      { name: 'required', type: 'boolean', description: 'Must be filled to finish. Default true for signature and initials' },
      { name: 'signer', type: 'string', description: 'Who fills it, for documents several people sign' },
      { name: 'value', type: 'string', description: 'A PNG data URL for signature and initials, text otherwise, "true" for a ticked checkbox' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MPdfSigner</h1>
    <p class="mb-4 text-body-large text-on-surface-variant">
      Sign and fill a PDF: fields on its pages that the signer fills in order, a signature drawn with a finger or
      typed, adopted once and reused, and <code>save()</code> for the PDF with everything written into it. In prepare
      mode the sender places the fields. Built on
      <RouterLink to="/components/pdf/mpdfviewer" class="text-primary underline">MPdfViewer</RouterLink> and
      <RouterLink to="/components/inputs/msignaturepad" class="text-primary underline">MSignaturePad</RouterLink>,
      from the <code>/pdf</code> entry point. Writing the file needs <code>pdf-lib</code> (<code>pnpm add pdf-lib</code>).
    </p>
    <p class="mb-8 rounded-lg bg-surface-container p-4 text-body-medium text-on-surface-variant">
      This is a visual signature, the kind e-signature flows show, print and keep with an audit trail. It is not a
      certificate-based digital signature (PAdES): for that, sign the saved file on your server with your
      certificate. Keep a record of who signed and when (the <code>finish</code> event) on your side.
    </p>

    <ComponentDemo
      title="Sign a lease"
      description="Next field takes you to what's missing. Sign once: the initials and the next signature reuse it. Switch to the landlord to sign their part; Finish downloads the signed PDF."
      flush
      :code="`<MPdfSigner
  ref=&quot;signer&quot;
  v-model:fields=&quot;fields&quot;
  src=&quot;/pdf/lease-sign.pdf&quot;
  signer=&quot;tenant&quot;
  signer-name=&quot;Jonah Reyes&quot;
  class=&quot;h-[640px]&quot;
  @finish=&quot;finish&quot;
/>`"
      :script="`import { MPdfSigner } from '@m3ui-vue/m3ui-vue/pdf'

const fields = ref([
  { id: 'tenant', type: 'signature', page: 2, x: 0.548, y: 0.1, width: 0.32, height: 0.052, signer: 'tenant' },
  { id: 'tenantDate', type: 'date', page: 2, x: 0.595, y: 0.2085, width: 0.2, height: 0.0165, signer: 'tenant', required: true },
  // …
])
async function finish() {
  const bytes = await signer.value.save() // the PDF, signed
  await upload(new Blob([bytes], { type: 'application/pdf' }))
}`"
    >
      <div class="flex flex-col gap-3 p-4">
        <div class="flex flex-wrap items-center gap-3">
          <MSegmentedButton v-model="signer" :options="signerOptions" density="compact" />
          <span class="flex-1 text-body-medium text-on-surface-variant">{{ done || `Signing as ${signerName}` }}</span>
          <MButton variant="text" icon="restart_alt" @click="restart">Start over</MButton>
        </div>
        <MPdfSigner
          ref="signerRef"
          v-model:fields="fields"
          :src="lease"
          :signer="signer"
          :signer-name="signerName"
          class="h-[640px] rounded-xl border border-outline-variant"
          @finish="finish"
        />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Place the fields"
      description="The sender's side: add fields, drag them onto the lines, resize from the corner, mark them required. The JSON below is what you store and send to each signer."
      flush
      :code="`<MPdfSigner v-model:fields=&quot;fields&quot; src=&quot;/pdf/lease-sign.pdf&quot; mode=&quot;prepare&quot; />`"
    >
      <div class="flex flex-col gap-3 p-4">
        <MPdfSigner v-model:fields="prepared" :src="lease" mode="prepare" class="h-[560px] rounded-xl border border-outline-variant" />
        <pre class="max-h-48 overflow-auto rounded-lg bg-surface-container p-3 font-mono text-body-small">{{ JSON.stringify(prepared, (k, v) => (typeof v === 'number' ? Math.round(v * 1000) / 1000 : v), 2) }}</pre>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="types" />
    <p class="mt-4 text-body-medium text-on-surface-variant">
      Also from <code>/pdf</code>: <code>signPdf(bytes, fields)</code> writes filled fields into a PDF without the
      component (once every signer is done, say).
    </p>

    <ComponentPager current="MPdfSigner" />
  </div>
</template>
