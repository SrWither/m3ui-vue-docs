<script setup lang="ts">
import { ref } from 'vue'
import { MReceipt, MButton, MIcon } from '@m3ui-vue/m3ui-vue'
import type { ReceiptItem, ReceiptAdjustment } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const items: ReceiptItem[] = [
  { name: 'Flat white', quantity: 2, price: 3.8 },
  { name: 'Almond croissant', price: 4.25, note: 'Warmed' },
  { name: 'Avocado toast', price: 9.5 },
  { name: 'Orange juice', quantity: 3, price: 2.9 },
]
const adjustments: ReceiptAdjustment[] = [
  { label: 'Loyalty card', percent: -10 },
  { label: 'VAT incl.', percent: 21, included: true },
  { label: 'Tip', amount: 3 },
]
const receipt = ref<InstanceType<typeof MReceipt> | null>(null)

const shop: ReceiptItem[] = [
  { name: 'USB-C cable 2 m', price: 12.99 },
  { name: 'Phone case', price: 19.9, note: 'SKU 4471-BLK' },
  { name: 'Screen protector', quantity: 2, price: 7.5 },
]

const props: PropDef[] = [
  { name: 'items', type: 'ReceiptItem[]', description: 'Required. { name, price, quantity?, note? }; price is per unit' },
  { name: 'adjustments', type: 'ReceiptAdjustment[]', default: '[]', description: '{ label, amount? | percent?, included? } after the subtotal, in order: negative for discounts; a percent applies to the running total; included marks a tax already in the prices (shows the tax part, adds nothing)' },
  { name: 'payments', type: 'ReceiptPayment[]', default: '[]', description: '{ method, amount }; paying more than the total shows the change' },
  { name: 'currency', type: 'string', description: 'ISO 4217 code; without one, plain numbers with 2 decimals' },
  { name: 'number', type: 'string | number', description: 'Receipt number under the header' },
  { name: 'date', type: 'Date | string | number', description: 'Date of the sale' },
  { name: 'paper', type: "'58mm' | '80mm' | 'auto'", default: "'80mm'", description: 'Paper width, also used by print()' },
  { name: 'edge', type: "'zigzag' | 'straight'", default: "'zigzag'", description: 'Torn edges at the top and bottom' },
  { name: 'footer', type: 'string', description: 'Text at the bottom when the footer slot is not used' },
]

const slots: SlotDef[] = [
  { name: 'header', description: "The store's logo, name, address, tax id" },
  { name: 'footer', description: 'A thank-you line, a QR, the return policy' },
  { name: 'item', description: 'Replaces a line', scope: '{ item, amount }' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MReceipt</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A sales receipt in the look of a thermal printer ticket, 58 or 80 mm wide: lines with quantities, subtotal,
      discounts and taxes, total, payments and change. All the math runs in cents, so <code>3 × 0.10</code> is
      <code>0.30</code>, not <code>0.30000000000000004</code>. The exposed <code>print()</code> prints only the receipt,
      sized to the paper, and <code>totals</code> gives the computed amounts.
    </p>

    <ComponentDemo
      title="Café receipt"
      description="A percent discount, a tip, VAT already included in the prices, and cash with change. Print opens the browser's print dialog with just the ticket."
      :code="`<MReceipt
  ref=&quot;receipt&quot;
  :items=&quot;items&quot;
  :adjustments=&quot;[
    { label: 'Loyalty card', percent: -10 },
    { label: 'VAT incl.', percent: 21, included: true },
    { label: 'Tip', amount: 3 },
  ]&quot;
  :payments=&quot;[{ method: 'Cash', amount: 40 }]&quot;
  currency=&quot;EUR&quot;
  number=&quot;A-0042&quot;
  :date=&quot;new Date()&quot;
  footer=&quot;Thanks for coming!&quot;
>
  <template #header>
    <div class=&quot;text-title-large font-bold&quot;>CAFÉ SOL</div>
    <div class=&quot;text-body-small&quot;>Calle Mayor 12 · Madrid</div>
  </template>
</MReceipt>
<MButton icon=&quot;print&quot; @click=&quot;receipt.print()&quot;>Print</MButton>`"
    >
      <div class="flex w-full flex-col items-center gap-4">
        <MReceipt
          ref="receipt"
          :items="items"
          :adjustments="adjustments"
          :payments="[{ method: 'Cash', amount: 40 }]"
          currency="EUR"
          number="A-0042"
          :date="new Date()"
          footer="Thanks for coming!"
        >
          <template #header>
            <MIcon name="local_cafe" :size="32" />
            <div class="text-title-large font-bold">CAFÉ SOL</div>
            <div class="text-body-small">Calle Mayor 12 · Madrid</div>
          </template>
        </MReceipt>
        <MButton icon="print" variant="tonal" @click="receipt?.print()">Print</MButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="58 mm, straight edges, card payment"
      description="paper=&quot;58mm&quot; is the narrow roll of small card terminals. A payment equal to the total shows no change."
      :code="`<MReceipt :items=&quot;items&quot; paper=&quot;58mm&quot; edge=&quot;straight&quot; currency=&quot;USD&quot; :payments=&quot;[{ method: 'Visa •••• 4242', amount: 47.89 }]&quot;>
  <template #footer>Returns within 30 days with this receipt</template>
</MReceipt>`"
    >
      <div class="flex w-full justify-center">
        <MReceipt
          :items="shop"
          paper="58mm"
          edge="straight"
          currency="USD"
          :payments="[{ method: 'Visa •••• 4242', amount: 47.89 }]"
        >
          <template #header><div class="text-title-medium font-bold">GADGET CORNER</div></template>
          <template #footer>Returns within 30 days with this receipt</template>
        </MReceipt>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <ComponentPager current="MReceipt" />
  </div>
</template>
