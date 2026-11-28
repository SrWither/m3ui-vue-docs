<script setup lang="ts">
import { computed, ref } from 'vue'
import { MSpreadsheet, MSwitch, cellName } from '@m3ui-vue/m3ui-vue'
import type { SpreadsheetCell, SpreadsheetChange, SpreadsheetValue } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

// ── An order: totals by formula, money formatted
const order = ref<SpreadsheetCell[][]>([
  ['Item', 'Qty', 'Price', 'Total'],
  ['Empanadas (dozen)', 3, 9600, '=B2*C2'],
  ['Milanesa napolitana', 2, 12500, '=B3*C3'],
  ['Provoleta', 1, 7800, '=B4*C4'],
  ['Flan with dulce de leche', 4, 4200, '=B5*C5'],
  ['Malbec (bottle)', 2, 15000, '=B6*C6'],
  [],
  ['Subtotal', '=SUM(B2:B6)', null, '=SUM(D2:D6)'],
  ['Tip 10%', null, null, '=D8*10%'],
  ['Total', null, null, '=ROUND(D8+D9,0)'],
])
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
function formatOrder(v: SpreadsheetValue, { row, col }: { row: number; col: number }) {
  if (typeof v === 'number' && row > 0 && (col === 2 || col === 3)) return money.format(v)
  return v == null ? '' : String(v)
}

// ── Ten thousand rows, first row and column frozen
const big = ref<SpreadsheetCell[][]>([
  ['Day', 'Orders', 'Delivered', 'Revenue', 'Avg ticket', 'Delivery %'],
  ...Array.from({ length: 10_000 }, (_, i): SpreadsheetCell[] => {
    const d = new Date(2026, 0, 1 + i)
    const orders = 40 + Math.round(30 * Math.sin(i / 7) + ((i * 37) % 23))
    const n = i + 2
    return [d.toISOString().slice(0, 10), orders, Math.round(orders * (0.3 + ((i * 7) % 40) / 100)), orders * (8000 + ((i * 53) % 4000)), `=ROUND(D${n}/B${n},0)`, `=ROUND(C${n}/B${n}*100,1)`]
  }),
])
const bigWidths = ref([110, 90, 100, 120, 110, 110])

// ── Your own functions
const readonly = ref(false)
const taxes = ref<SpreadsheetCell[][]>([
  ['Net', 'VAT', 'Gross', 'In words'],
  [1000, '=VAT(A2)', '=A2+B2', '=IF(C2>1000,"over a thousand","up to a thousand")'],
  [250, '=VAT(A3)', '=A3+B3', '=IF(C3>1000,"over a thousand","up to a thousand")'],
  [5400, '=VAT(A4)', '=A4+B4', '=IF(C4>1000,"over a thousand","up to a thousand")'],
])
const functions = { VAT: ([net]: unknown[]) => Math.round(Number(net) * 0.21 * 100) / 100 }
const changes = ref<string[]>([])
function log(list: SpreadsheetChange[]) {
  changes.value.push(list.map((x) => `${cellName(x.row, x.col)}: ${x.oldValue ?? '∅'} → ${x.value ?? '∅'}`).join(', '))
}
const lastChange = computed(() => changes.value.at(-1) ?? 'Edit a net amount: VAT and gross follow')

const props: PropDef[] = [
  { name: 'modelValue', type: 'SpreadsheetCell[][]', default: '[]', description: 'The cells, row by row, as typed: numbers, text, booleans, null for empty, formulas as "=…" strings (v-model). The values formulas work out to are shown, not stored' },
  { name: 'rows', type: 'number', default: '100', description: 'Rows the grid shows at least (more when the data has more)' },
  { name: 'cols', type: 'number', default: '26', description: 'Columns the grid shows at least' },
  { name: 'columnWidths', type: 'number[]', description: 'Each column\'s width in px (v-model:columnWidths, updated when the user drags a header\'s edge)' },
  { name: 'defaultColumnWidth', type: 'number', default: '100', description: 'Width of the columns without one' },
  { name: 'rowHeight', type: 'number', default: '32', description: 'Row height in px' },
  { name: 'frozenRows', type: 'number', default: '0', description: 'Rows kept at the top while scrolling' },
  { name: 'frozenColumns', type: 'number', default: '0', description: 'Columns kept at the left while scrolling' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Cells can be selected and copied, not changed' },
  { name: 'headers', type: 'boolean', default: 'true', description: 'Show the column letters and row numbers' },
  { name: 'columnLabels', type: 'string[]', description: 'Column header text instead of A, B, C…' },
  { name: 'formulaBar', type: 'boolean', default: 'true', description: 'The selected cell\'s name and its contents, editable' },
  { name: 'formulas', type: 'boolean', default: 'true', description: 'Work formulas out. Off: "=…" is shown as typed' },
  { name: 'functions', type: 'Record<string, SpreadsheetFunction>', description: 'More functions for formulas, by upper-case name: { TAX: ([amount]) => amount * 0.21 }' },
  { name: 'format', type: '(value, { row, col, raw }) => string', description: 'How a cell shows its value (currencies, dates…)' },
  { name: 'overscan', type: 'number', default: '6', description: 'Extra rows rendered above and below the ones in view' },
  { name: 'label', type: 'string', description: 'The grid\'s accessible name' },
]
const events: EventDef[] = [
  { name: 'update:modelValue', payload: 'SpreadsheetCell[][]', description: 'A new array of cells (rows that changed are new arrays, the rest are the same ones)' },
  { name: 'change', payload: 'SpreadsheetChange[]', description: 'Cells written by typing, a paste, the fill handle, a clear, undo or redo: { row, col, value, oldValue }' },
  { name: 'selection-change', payload: 'SpreadsheetRange', description: 'The selection moved: { start, end }' },
  { name: 'update:columnWidths', payload: 'number[]', description: 'A column was resized' },
]
const types: TypeDef[] = [
  { name: 'SpreadsheetCell', fields: [{ name: '(type)', type: 'string | number | boolean | null', description: 'A cell as typed. A string starting with = is a formula' }] },
  { name: 'SpreadsheetChange', fields: [
    { name: 'row, col', type: 'number', required: true, description: '0-based' },
    { name: 'value', type: 'SpreadsheetCell', required: true, description: 'What it holds now' },
    { name: 'oldValue', type: 'SpreadsheetCell', required: true, description: 'What it held' },
  ] },
  { name: 'SpreadsheetRange', fields: [{ name: 'start, end', type: '{ row, col }', required: true, description: 'Top-left and bottom-right corners' }] },
]

const keys = [
  ['Type', 'Replaces the cell; Enter or Tab stores it and moves on, Esc cancels'],
  ['Enter, F2, double-click', 'Edits the cell keeping its contents'],
  ['Arrows, Shift+arrows', 'Move; extend the selection'],
  ['Ctrl+arrows, Home, End, Page Up/Down', 'Jump to the data\'s edge, the row\'s ends, a page'],
  ['Ctrl+C, Ctrl+X, Ctrl+V', 'Copy, cut and paste tab-separated text: to and from Excel, Google Sheets, LibreOffice'],
  ['Delete, Backspace', 'Clear the selection'],
  ['Ctrl+Z, Ctrl+Shift+Z / Ctrl+Y', 'Undo, redo'],
  ['Ctrl+A', 'Select everything'],
]
const fns = 'SUM, AVERAGE, MIN, MAX, PRODUCT, COUNT, COUNTA, COUNTBLANK, SUMIF, COUNTIF, ROUND, ABS, SQRT, POWER, MOD, INT, IF, IFERROR, AND, OR, NOT, CONCAT, CONCATENATE, LEN, UPPER, LOWER, TRIM, LEFT, RIGHT'
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSpreadsheet</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      An editable grid of cells, like a small Excel or Google Sheets: type into cells, select ranges, copy and paste
      to and from Excel, drag the fill handle, formulas with relative and <code>$</code>-locked references, undo,
      frozen rows and columns, resizable columns. Only the rows in view are rendered. Not an M3 spec component: for
      showing rows rather than editing cells, use
      <RouterLink to="/components/tables/mdatatable" class="text-primary underline">MDataTable</RouterLink>.
    </p>

    <ComponentDemo
      title="An order"
      description="Change a quantity or a price: the totals follow. Select D2 and drag its corner down, or copy a block and paste it into Excel."
      :code="`<MSpreadsheet v-model=&quot;cells&quot; :rows=&quot;12&quot; :cols=&quot;5&quot; :frozen-rows=&quot;1&quot; :column-widths=&quot;[200, 70, 110, 120]&quot; :format=&quot;format&quot; />`"
      :script="`const cells = ref([
  ['Item', 'Qty', 'Price', 'Total'],
  ['Empanadas (dozen)', 3, 9600, '=B2*C2'],
  // …
  ['Subtotal', '=SUM(B2:B6)', null, '=SUM(D2:D6)'],
  ['Tip 10%', null, null, '=D8*10%'],
  ['Total', null, null, '=ROUND(D8+D9,0)'],
])
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
const format = (v, { row, col }) => (typeof v === 'number' && row > 0 && col >= 2 ? money.format(v) : v ?? '')`"
    >
      <MSpreadsheet v-model="order" :rows="12" :cols="5" :frozen-rows="1" :column-widths="[200, 70, 110, 120]" :format="formatOrder" class="h-[26rem] w-full" />
    </ComponentDemo>

    <ComponentDemo
      title="Ten thousand rows"
      description="The header row and the day column stay put; only the rows in view are in the page. Drag a header's edge to resize it."
      :code="`<MSpreadsheet v-model=&quot;cells&quot; v-model:column-widths=&quot;widths&quot; :frozen-rows=&quot;1&quot; :frozen-columns=&quot;1&quot; :cols=&quot;6&quot; />`"
    >
      <MSpreadsheet v-model="big" v-model:column-widths="bigWidths" :frozen-rows="1" :frozen-columns="1" :cols="6" class="h-[28rem] w-full" />
    </ComponentDemo>

    <ComponentDemo
      title="Your own functions"
      description="VAT() comes from the page. The change event reports each cell written."
      :code="`<MSpreadsheet v-model=&quot;cells&quot; :functions=&quot;{ VAT: ([net]) => net * 0.21 }&quot; :readonly=&quot;readonly&quot; :rows=&quot;6&quot; :cols=&quot;4&quot; @change=&quot;log&quot; />`"
    >
      <div class="flex w-full flex-col gap-3">
        <MSpreadsheet
          v-model="taxes"
          :functions="functions"
          :readonly="readonly"
          :rows="6"
          :cols="4"
          :column-widths="[100, 100, 100, 200]"
          :formula-bar="true"
          class="h-64 w-full"
          @change="log"
        />
        <div class="flex items-center justify-between gap-4 text-body-medium text-on-surface-variant">
          <span>{{ lastChange }}</span>
          <label class="flex items-center gap-2"><MSwitch v-model="readonly" /> Read-only</label>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Keyboard</h3>
    <div class="overflow-hidden rounded-lg border border-outline-variant">
      <table class="w-full text-body-medium">
        <tbody>
          <tr v-for="[k, what] in keys" :key="k" class="border-b border-outline-variant last:border-0">
            <td class="w-72 px-4 py-2 font-mono text-label-large">{{ k }}</td>
            <td class="px-4 py-2 text-on-surface-variant">{{ what }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Formulas</h3>
    <p class="mb-2 text-body-medium text-on-surface-variant">
      <code>+ - * / ^ &amp;</code>, comparisons (<code>= &lt;&gt; &lt; &gt; &lt;= &gt;=</code>), <code>%</code>, references
      (<code>B3</code>, <code>$B$3</code>), ranges (<code>A1:C10</code>), text in double quotes, <code>TRUE</code>/<code>FALSE</code>.
      While typing a formula, clicking a cell inserts its reference. Errors show as <code>#DIV/0!</code>, <code>#REF!</code>,
      <code>#NAME?</code>, <code>#VALUE!</code>, <code>#CIRC!</code> (a circular reference).
    </p>
    <p class="mb-2 text-body-medium text-on-surface-variant">Functions: {{ fns }}.</p>
    <p class="text-body-medium text-on-surface-variant">
      The engine is exported too, to work out a saved sheet without the grid (on a server, in a report):
      <code>createSheetEvaluator(cells).value(row, col)</code>, plus <code>evaluateFormula</code>, <code>shiftFormula</code>,
      <code>cellName</code>/<code>parseCellName</code> and <code>spreadsheetFunctions</code>.
    </p>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="events" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="types" />

    <ComponentPager current="MSpreadsheet" />
  </div>
</template>
