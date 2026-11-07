<script setup lang="ts">
/* The open circuit's truth table (truthTable.ts), worked out when the dialog opens; copied as CSV from its button. */
import { computed, ref, watch } from 'vue'
import { MButton, MDialog, useToast } from '@m3ui-vue/m3ui-vue'
import { truthCSV, truthTable, type TruthTable } from '../truthTable'
import { useCircuit } from '../useCircuit'

const open = defineModel<boolean>({ required: true })
const c = useCircuit()
const toast = useToast()
const table = ref<TruthTable | null>(null)
watch(open, (o) => {
  if (o) table.value = truthTable(c.nodes.value, c.edges.value)
})
/** A 1 in an output stands out */
const isOne = (v: string) => v !== '0' && v !== 'X' && v !== 'Z' && v !== '–' && !/^0+$/.test(v)
const bin = (v: number, bits: number) => (bits === 1 ? String(v) : v.toString(2).padStart(bits, '0'))
const ones = computed(() => table.value?.rows.filter((r) => r.outs.some(isOne)).length ?? 0)
async function copy() {
  if (!table.value) return
  try {
    await navigator.clipboard.writeText(truthCSV(table.value))
    toast.success('Truth table copied as CSV')
  } catch {
    toast.error("Couldn't copy to the clipboard")
  }
}
</script>

<template>
  <MDialog v-model="open" title="Truth table" max-width="640px">
    <template v-if="table">
      <p v-if="table.error" class="text-body-medium text-on-surface-variant">{{ table.error }}</p>
      <template v-else>
        <p class="mb-3 text-body-small text-on-surface-variant">
          {{ table.rows.length }} rows, every combination of the inputs (the first one is the most significant bit);
          {{ ones }} light up an output.
          <span v-if="table.note" class="mt-1 block text-tertiary">{{ table.note }}</span>
        </p>
        <div class="max-h-[60vh] overflow-auto rounded-lg border border-outline-variant">
          <table class="w-full border-collapse font-mono text-body-medium">
            <thead class="sticky top-0 bg-surface-container-high">
              <tr>
                <th v-for="col in table.inputs" :key="col.id" class="px-3 py-2 text-left font-sans text-label-large">{{ col.name }}</th>
                <th v-for="(col, i) in table.outputs" :key="col.id" class="px-3 py-2 text-left font-sans text-label-large text-primary" :class="i === 0 && 'border-l-2 border-outline-variant'">{{ col.name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, r) in table.rows" :key="r" class="odd:bg-surface-container-low">
                <td v-for="(v, i) in row.ins" :key="`i${i}`" class="px-3 py-1 text-on-surface-variant">{{ bin(v, table.inputs[i]!.bits) }}</td>
                <td v-for="(v, i) in row.outs" :key="`o${i}`" class="px-3 py-1" :class="[i === 0 && 'border-l-2 border-outline-variant', isOne(v) ? 'font-bold text-primary' : 'text-on-surface']">{{ v }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </template>
    <template #actions>
      <MButton v-if="table && !table.error" variant="text" icon="content_copy" @click="copy">Copy as CSV</MButton>
      <MButton @click="open = false">Close</MButton>
    </template>
  </MDialog>
</template>
