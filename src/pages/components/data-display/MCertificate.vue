<script setup lang="ts">
import { ref } from 'vue'
import { MCertificate, MButton, MSegmentedButton, MSignaturePad, MTextField } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const variant = ref<'classic' | 'modern' | 'minimal'>('classic')
const name = ref('Ana Gómez')
const signature = ref<string | undefined>()
const cert = ref<InstanceType<typeof MCertificate> | null>(null)

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
      title="Course certificate"
      description="Type a name, sign in the pad, and print. Switch the look between classic, modern and minimal."
      :code="`<MCertificate
  ref=&quot;cert&quot;
  :recipient=&quot;name&quot;
  :variant=&quot;variant&quot;
  issuer=&quot;M3 Academy&quot;
  description=&quot;has successfully completed the course Vue 3 Fundamentals, 24 hours&quot;
  :date=&quot;new Date()&quot;
  code=&quot;M3A-2026-00428&quot;
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
          <MButton icon="print" variant="tonal" class="ms-auto" @click="cert?.print()">Print</MButton>
        </div>
        <MCertificate
          ref="cert"
          :recipient="name || '—'"
          :variant="variant"
          issuer="M3 Academy"
          description="has successfully completed the course Vue 3 Fundamentals, 24 hours"
          :date="new Date()"
          code="M3A-2026-00428"
          :signatures="[{ name: 'Leo Paz', role: 'Course director', image: signature }, { name: 'Mía Ruiz', role: 'Academic lead' }]"
        />
        <div class="grid gap-4 sm:grid-cols-2">
          <MTextField v-model="name" label="Recipient" />
          <div class="flex flex-col gap-1">
            <span class="text-label-large text-on-surface-variant">Director's signature</span>
            <MSignaturePad :width="320" :height="120" background="#fffdf8" @end="(png) => (signature = png)" />
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
