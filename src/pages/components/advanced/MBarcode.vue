<script setup lang="ts">
import { MBarcode } from '@m3ui-vue/m3ui-vue/barcode'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const barcodeProps: PropDef[] = [
  { name: 'value', type: 'string', description: 'Data to encode. Required — there is no default.' },
  { name: 'format', type: 'string', default: "'CODE128'", description: "Symbology: 'CODE128', 'EAN13', 'EAN8', 'UPC', 'CODE39', 'ITF14', 'MSI', 'pharmacode', 'codabar', and others supported by jsbarcode" },
  { name: 'width', type: 'number', default: '2', description: 'Width of the narrowest bar, in px' },
  { name: 'height', type: 'number', default: '80', description: 'Bar height in px' },
  { name: 'displayValue', type: 'boolean', default: 'true', description: 'Show the encoded text below the bars' },
  { name: 'color', type: 'string', default: "'#000000'", description: 'Bar color' },
  { name: 'background', type: 'string', default: "'#ffffff'", description: 'Background color' },
  { name: 'margin', type: 'number', default: '10', description: 'Quiet zone around the barcode, in px' },
  { name: 'fontSize', type: 'number', default: '20', description: 'Font size for the displayed value' },
  { name: 'label', type: 'string', description: 'aria-label for the svg. Defaults to value' },
]

const barcodeSlots: SlotDef[] = [
  { name: 'error', description: 'Shown instead of the SVG when value is invalid for the given format (e.g. a non-numeric EAN13)' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MBarcode</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Renders a barcode as inline SVG via jsbarcode. Available from the
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">/barcode</code> entry point,
      with <code class="text-body-small">jsbarcode</code> as an optional peer dependency.
    </p>

    <ComponentDemo
      title="Barcode generator"
      description="Renders as inline SVG via jsbarcode (optional peer dependency), available from the /barcode entry point. Supports CODE128, EAN13, EAN8, UPC, CODE39, ITF14, MSI, pharmacode, codabar and more."
      :code="`<MBarcode value=&quot;123456789012&quot; format=&quot;CODE128&quot; />
<MBarcode value=&quot;5901234123457&quot; format=&quot;EAN13&quot; />
<MBarcode value=&quot;ORDER-4821&quot; format=&quot;CODE39&quot; :height=&quot;60&quot; color=&quot;#6750a4&quot; />`"
      :script="`import { MBarcode } from '@m3ui-vue/m3ui-vue/barcode'`"
    >
      <div class="flex flex-wrap items-end gap-6">
        <MBarcode value="123456789012" format="CODE128" />
        <MBarcode value="5901234123457" format="EAN13" />
        <MBarcode value="ORDER-4821" format="CODE39" :height="60" color="#6750a4" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Display Options"
      description="displayValue hides the human-readable text entirely; margin controls the quiet zone in px, and fontSize scales the displayed text when it is shown."
      :code="`<MBarcode value=&quot;987654321098&quot; format=&quot;CODE128&quot; :display-value=&quot;false&quot; :height=&quot;50&quot; />
<MBarcode value=&quot;987654321098&quot; format=&quot;CODE128&quot; :margin=&quot;24&quot; :font-size=&quot;28&quot; />`"
    >
      <div class="flex flex-wrap items-end gap-6">
        <div class="flex flex-col items-center gap-2">
          <MBarcode value="987654321098" format="CODE128" :display-value="false" :height="50" />
          <span class="text-body-small text-on-surface-variant">displayValue: false</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MBarcode value="987654321098" format="CODE128" :margin="24" :font-size="28" />
          <span class="text-body-small text-on-surface-variant">margin: 24, fontSize: 28</span>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="barcodeProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="barcodeSlots" />

    <ComponentPager current="MBarcode" />
  </div>
</template>
