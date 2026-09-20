<script setup lang="ts">
export interface EventDef {
  name: string
  payload?: string
  description: string
}

defineProps<{ events: EventDef[] }>()
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-outline-variant">
    <table class="w-full text-body-medium">
      <thead>
        <tr class="border-b border-outline-variant bg-surface-container">
          <th class="px-4 py-3 text-left text-label-large font-medium">Event</th>
          <th class="px-4 py-3 text-left text-label-large font-medium">Payload</th>
          <th class="px-4 py-3 text-left text-label-large font-medium">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="event in events"
          :key="event.name"
          class="border-b border-outline-variant last:border-b-0"
        >
          <td class="px-4 py-3">
            <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">{{ event.name }}</code>
          </td>
          <td class="px-4 py-3 text-on-surface-variant">
            <code v-if="event.payload" class="text-body-small">{{ event.payload }}</code>
            <span v-else class="text-outline">—</span>
          </td>
          <td class="px-4 py-3 text-on-surface-variant">{{ event.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
