<script setup lang="ts">
export interface SlotDef {
  name: string
  description: string
  scope?: string  // optional: slot props exposed to the consumer
}

defineProps<{ slots: SlotDef[] }>()
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-outline-variant">
    <table class="w-full text-body-medium">
      <thead>
        <tr class="border-b border-outline-variant bg-surface-container">
          <th class="px-4 py-3 text-left text-label-large font-medium">Slot</th>
          <th class="px-4 py-3 text-left text-label-large font-medium">Scope</th>
          <th class="px-4 py-3 text-left text-label-large font-medium">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="slot in slots"
          :key="slot.name"
          class="border-b border-outline-variant last:border-b-0"
        >
          <td class="px-4 py-3">
            <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">{{ slot.name }}</code>
          </td>
          <td class="px-4 py-3 text-on-surface-variant">
            <code v-if="slot.scope" class="text-body-small">{{ slot.scope }}</code>
            <span v-else class="text-outline">—</span>
          </td>
          <td class="px-4 py-3 text-on-surface-variant">{{ slot.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
