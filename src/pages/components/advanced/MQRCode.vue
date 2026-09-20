<script setup lang="ts">
import { MQRCode } from '@m3ui-vue/m3ui-vue/qrcode'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const qrCodeProps: PropDef[] = [
  { name: 'value', type: 'string', description: 'Data to encode. Required — there is no default.' },
  { name: 'size', type: 'number', default: '200', description: 'Width/height in pixels (square)' },
  { name: 'margin', type: 'number', default: '4', description: 'Quiet zone around the code, in modules' },
  { name: 'errorCorrectionLevel', type: "'L' | 'M' | 'Q' | 'H'", default: "'M'", description: 'Higher levels tolerate more damage/obstruction at the cost of a denser code' },
  { name: 'color', type: 'string', default: "'#000000'", description: 'Dark module color' },
  { name: 'background', type: 'string', default: "'#ffffff'", description: 'Light module / background color' },
  { name: 'rounded', type: 'boolean', default: 'true', description: 'Rounds the outer container corners' },
  { name: 'moduleStyle', type: "'square' | 'dots'", default: "'square'", description: 'Classic scannable pixel grid, or rounded ("dots") modules for a softer look — still fully scannable' },
  { name: 'label', type: 'string', description: 'aria-label for the svg. Defaults to value' },
]

const qrCodeSlots: SlotDef[] = [
  { name: 'error', description: 'Shown instead of the SVG when value is too large to encode at the given errorCorrectionLevel' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MQRCode</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Renders a QR code as inline SVG — crisp at any size, no canvas or image assets. Available from the
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">/qrcode</code> entry point
      with <code class="text-body-small">qrcode-generator</code> as an optional peer dependency, so it never
      adds weight to the main bundle.
    </p>

    <ComponentDemo
      title="QR code generator"
      description="Basic usage: a value, a size, and either an accessible label or the value itself is used as the fallback aria-label."
      :code="`<MQRCode value=&quot;https://example.com/table/5&quot; :size=&quot;160&quot; label=&quot;Table 5 menu&quot; />
<MQRCode value=&quot;https://example.com&quot; :size=&quot;160&quot; error-correction-level=&quot;H&quot; color=&quot;#6750a4&quot; />`"
      :script="`import { MQRCode } from '@m3ui-vue/m3ui-vue/qrcode'`"
    >
      <div class="flex flex-wrap items-center gap-6">
        <MQRCode value="https://example.com/table/5" :size="160" label="Table 5 menu" />
        <MQRCode value="https://example.com" :size="160" error-correction-level="H" color="#6750a4" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Module style"
      description="moduleStyle controls the modules themselves, independently of rounded (which only affects the container). 'square' (default) is the classic scannable grid; 'dots' rounds each module — corners only round where a module isn't touching a neighbor, so connected blocks like the finder-pattern squares stay solid. Both scan identically."
      :code="`<MQRCode value=&quot;https://example.com&quot; :size=&quot;160&quot; module-style=&quot;square&quot; />
<MQRCode value=&quot;https://example.com&quot; :size=&quot;160&quot; module-style=&quot;dots&quot; />`"
    >
      <div class="flex flex-wrap items-center gap-6">
        <div class="flex flex-col items-center gap-2">
          <MQRCode value="https://example.com" :size="160" module-style="square" />
          <span class="text-body-small text-on-surface-variant">square (default)</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MQRCode value="https://example.com" :size="160" module-style="dots" />
          <span class="text-body-small text-on-surface-variant">dots</span>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Sizes"
      description="size sets the width/height in pixels — the code is redrawn from scratch (not scaled), so modules stay crisp at any size, in both module styles."
      :code="`<MQRCode value=&quot;https://example.com&quot; :size=&quot;64&quot; module-style=&quot;square&quot; />
<MQRCode value=&quot;https://example.com&quot; :size=&quot;96&quot; module-style=&quot;square&quot; />
<MQRCode value=&quot;https://example.com&quot; :size=&quot;128&quot; module-style=&quot;square&quot; />
<MQRCode value=&quot;https://example.com&quot; :size=&quot;200&quot; module-style=&quot;square&quot; />
<MQRCode value=&quot;https://example.com&quot; :size=&quot;280&quot; module-style=&quot;square&quot; />

<MQRCode value=&quot;https://example.com&quot; :size=&quot;64&quot; module-style=&quot;dots&quot; />
<MQRCode value=&quot;https://example.com&quot; :size=&quot;96&quot; module-style=&quot;dots&quot; />
<MQRCode value=&quot;https://example.com&quot; :size=&quot;128&quot; module-style=&quot;dots&quot; />
<MQRCode value=&quot;https://example.com&quot; :size=&quot;200&quot; module-style=&quot;dots&quot; />
<MQRCode value=&quot;https://example.com&quot; :size=&quot;280&quot; module-style=&quot;dots&quot; />`"
    >
      <div class="flex w-full flex-col gap-6">
        <div class="flex flex-wrap items-end gap-6">
          <MQRCode value="https://example.com" :size="64" module-style="square" />
          <MQRCode value="https://example.com" :size="96" module-style="square" />
          <MQRCode value="https://example.com" :size="128" module-style="square" />
          <MQRCode value="https://example.com" :size="200" module-style="square" />
          <MQRCode value="https://example.com" :size="280" module-style="square" />
        </div>
        <div class="flex flex-wrap items-end gap-6">
          <MQRCode value="https://example.com" :size="64" module-style="dots" />
          <MQRCode value="https://example.com" :size="96" module-style="dots" />
          <MQRCode value="https://example.com" :size="128" module-style="dots" />
          <MQRCode value="https://example.com" :size="200" module-style="dots" />
          <MQRCode value="https://example.com" :size="280" module-style="dots" />
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Colors, margin & rounding"
      description="color/background recolor the modules and backdrop, margin controls the quiet zone (in modules), and rounded toggles the container's own corner radius."
      :code="`<MQRCode value=&quot;https://example.com&quot; :size=&quot;140&quot; color=&quot;#1b6c3b&quot; background=&quot;#e8f5e9&quot; :margin=&quot;2&quot; />
<MQRCode value=&quot;https://example.com&quot; :size=&quot;140&quot; color=&quot;#ffffff&quot; background=&quot;#1a1a2e&quot; :rounded=&quot;false&quot; />`"
    >
      <div class="flex flex-wrap items-center gap-6">
        <MQRCode value="https://example.com" :size="140" color="#1b6c3b" background="#e8f5e9" :margin="2" />
        <MQRCode value="https://example.com" :size="140" color="#ffffff" background="#1a1a2e" :rounded="false" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="qrCodeProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="qrCodeSlots" />

    <ComponentPager current="MQRCode" />
  </div>
</template>
