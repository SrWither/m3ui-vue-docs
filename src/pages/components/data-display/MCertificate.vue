<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { MCertificate, MButton, MSegmentedButton, MSelect, MSignaturePad, MTextField } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

// Everything on the certificate is editable in the demo
const form = ref({
  title: 'Certificate of completion',
  presentedTo: 'This certifies that',
  recipient: 'Ana Gómez',
  description: 'has successfully completed the course Vue 3 Fundamentals, 24 hours',
  issuer: 'M3 Academy',
  date: new Date().toISOString().slice(0, 10),
  code: 'M3A-2026-00428',
  sign1Name: 'Leo Paz',
  sign1Role: 'Course director',
  sign2Name: 'Mía Ruiz',
  sign2Role: 'Academic lead',
})
const variant = ref<'classic' | 'modern' | 'minimal'>('classic')
const orientation = ref<'landscape' | 'portrait'>('landscape')
const color = ref('primary')
const seal = ref<string>('workspace_premium')
const signature = ref<string | undefined>()
const cert = ref<InstanceType<typeof MCertificate> | null>(null)

const colorOptions = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'tertiary', label: 'Tertiary' },
  { value: 'error', label: 'Error' },
  { value: '#8a6d1d', label: 'Gold (#8a6d1d)' },
  { value: '#1f3a5f', label: 'Navy (#1f3a5f)' },
]
const sealOptions = [
  { value: 'workspace_premium', label: 'Rosette' },
  { value: 'emoji_events', label: 'Trophy' },
  { value: 'school', label: 'Graduation cap' },
  { value: 'verified', label: 'Verified' },
  { value: 'none', label: 'No seal' },
]

const signatures = computed(() =>
  [
    { name: form.value.sign1Name, role: form.value.sign1Role || undefined, image: signature.value },
    { name: form.value.sign2Name, role: form.value.sign2Role || undefined },
  ].filter((s) => s.name.trim()),
)

// The pad's canvas has a fixed size in px: measure its column so it fills it
const padBox = ref<HTMLElement | null>(null)
const padWidth = ref(320)
let ro: ResizeObserver | undefined
onMounted(() => {
  if (!padBox.value) return
  padWidth.value = Math.floor(padBox.value.clientWidth) - 2
  ro = new ResizeObserver(([e]) => {
    const w = Math.floor(e!.contentRect.width) - 2 // the pad's border
    if (w && w !== padWidth.value) padWidth.value = w
  })
  ro.observe(padBox.value)
})
onBeforeUnmount(() => ro?.disconnect())

const props: PropDef[] = [
  { name: 'recipient', type: 'string', description: 'Required. Who receives it' },
  { name: 'title', type: 'string', default: "locale 'Certificate of completion'", description: 'Big title' },
  { name: 'presentedTo', type: 'string', default: "locale 'This certifies that'", description: 'Line before the name' },
  { name: 'description', type: 'string', description: 'What it is for' },
  { name: 'issuer', type: 'string', description: 'Issuing organization, at the top' },
  { name: 'date', type: 'Date | string | number', description: 'Date awarded, shown over a line' },
  { name: 'code', type: 'string', description: 'Certificate number or verification code' },
  { name: 'signatures', type: 'CertificateSignature[]', default: '[]', description: '{ name, role?, image? }; image is a URL or data URL, e.g. from MSignaturePad' },
  { name: 'variant', type: "'classic' | 'modern' | 'minimal'", default: "'classic'", description: 'Double frame and serif, a colored band, or a hairline' },
  { name: 'color', type: 'string', default: "'primary'", description: 'Accent: a role or any CSS color' },
  { name: 'seal', type: 'string | false', default: "'workspace_premium'", description: 'Icon in the seal; false hides it' },
  { name: 'orientation', type: "'landscape' | 'portrait'", default: "'landscape'", description: 'A4 shape' },
]

const slots: SlotDef[] = [
  { name: 'logo', description: "The issuer's logo" },
  { name: 'seal', description: 'Replaces the seal' },
  { name: 'default', description: 'Extra content under the description (grade, hours, a QR to verify)' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MCertificate</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A printable certificate or diploma for a course, an award or a training. It keeps an A4 shape at any width and
      scales its type with it (container query units), so the same component works as a thumbnail, on screen and on
      paper. <code>print()</code> prints just the certificate on an A4 page. Signatures can carry an image, for
      example one drawn in an <code>MSignaturePad</code>.
    </p>

    <ComponentDemo
      title="Build your own"
      description="Every text, the look, the color, the seal and the orientation can be changed here. Sign in the pad to put the signature over the first line, then print."
      :code="`<MCertificate
  ref=&quot;cert&quot;
  :title=&quot;title&quot;
  :presented-to=&quot;presentedTo&quot;
  :recipient=&quot;recipient&quot;
  :description=&quot;description&quot;
  :issuer=&quot;issuer&quot;
  :date=&quot;date&quot;
  :code=&quot;code&quot;
  :variant=&quot;variant&quot;
  :orientation=&quot;orientation&quot;
  :color=&quot;color&quot;
  :seal=&quot;seal&quot;
  :signatures=&quot;[{ name: 'Leo Paz', role: 'Course director', image: signature }, { name: 'Mía Ruiz', role: 'Academic lead' }]&quot;
/>
<MSignaturePad @end=&quot;(png) => (signature = png)&quot; />
<MButton icon=&quot;print&quot; @click=&quot;cert.print()&quot;>Print</MButton>`"
    >
      <div class="flex w-full flex-col gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <MSegmentedButton
            v-model="variant"
            density="compact"
            :options="[{ value: 'classic', label: 'Classic' }, { value: 'modern', label: 'Modern' }, { value: 'minimal', label: 'Minimal' }]"
          />
          <MSegmentedButton
            v-model="orientation"
            density="compact"
            :options="[{ value: 'landscape', label: 'Landscape' }, { value: 'portrait', label: 'Portrait' }]"
          />
          <MButton icon="print" variant="tonal" class="ms-auto" @click="cert?.print()">Print</MButton>
        </div>

        <div class="flex justify-center">
          <MCertificate
            ref="cert"
            :class="orientation === 'portrait' ? 'max-w-md' : ''"
            :title="form.title || undefined"
            :presented-to="form.presentedTo || undefined"
            :recipient="form.recipient || '—'"
            :description="form.description || undefined"
            :issuer="form.issuer || undefined"
            :date="form.date ? new Date(form.date + 'T12:00') : undefined"
            :code="form.code || undefined"
            :variant="variant"
            :orientation="orientation"
            :color="color"
            :seal="seal === 'none' ? false : seal"
            :signatures="signatures"
          />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <MTextField v-model="form.title" label="Title" />
          <MTextField v-model="form.presentedTo" label="Line before the name" />
          <MTextField v-model="form.recipient" label="Recipient" />
          <MTextField v-model="form.issuer" label="Issuer" />
          <MTextField v-model="form.description" label="Description" multiline :rows="2" class="sm:col-span-2" />
          <MTextField v-model="form.date" label="Date" type="date" />
          <MTextField v-model="form.code" label="Certificate ID" />
          <MSelect v-model="color" :options="colorOptions" label="Accent color" />
          <MSelect v-model="seal" :options="sealOptions" label="Seal" />
          <MTextField v-model="form.sign1Name" label="First signer" />
          <MTextField v-model="form.sign1Role" label="First signer's role" />
          <MTextField v-model="form.sign2Name" label="Second signer (empty to remove)" />
          <MTextField v-model="form.sign2Role" label="Second signer's role" />
          <div ref="padBox" class="flex flex-col gap-1 sm:col-span-2">
            <span class="text-label-large text-on-surface-variant">First signer's signature</span>
            <MSignaturePad :key="padWidth" :width="padWidth" :height="140" background="#fffdf8" @end="(png) => (signature = png)" />
          </div>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Award, portrait, with a custom seal color"
      description="orientation=&quot;portrait&quot; and color=&quot;tertiary&quot;; a thumbnail keeps the same proportions."
      :code="`<MCertificate recipient=&quot;Night shift team&quot; title=&quot;Employee of the month&quot; presented-to=&quot;Awarded to&quot; orientation=&quot;portrait&quot; color=&quot;tertiary&quot; seal=&quot;emoji_events&quot; variant=&quot;modern&quot; />`"
    >
      <div class="flex w-full flex-wrap items-end justify-center gap-6">
        <MCertificate
          class="max-w-xs"
          recipient="Night shift team"
          title="Employee of the month"
          presented-to="Awarded to"
          description="for keeping every order on time through the busiest week of the year"
          orientation="portrait"
          color="tertiary"
          seal="emoji_events"
          variant="modern"
          :date="new Date()"
        />
        <MCertificate class="max-w-40" recipient="Thumbnail" orientation="portrait" color="tertiary" seal="emoji_events" variant="modern" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <ComponentPager current="MCertificate" />
  </div>
</template>
