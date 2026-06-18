<script setup lang="ts">
export interface PropDef {
  name: string
  type: string
  default?: string
  description: string
}

defineProps<{
  props: PropDef[]
}>()
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-outline-variant">
    <table class="w-full text-body-medium">
      <thead>
        <tr class="border-b border-outline-variant bg-surface-container">
          <th class="px-4 py-3 text-left text-label-large font-medium">Prop</th>
          <th class="px-4 py-3 text-left text-label-large font-medium">Type</th>
          <th class="px-4 py-3 text-left text-label-large font-medium">Default</th>
          <th class="px-4 py-3 text-left text-label-large font-medium">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="prop in props"
          :key="prop.name"
          class="border-b border-outline-variant last:border-b-0"
        >
          <td class="px-4 py-3">
            <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">{{ prop.name }}</code>
          </td>
          <td class="px-4 py-3 text-on-surface-variant">
            <code class="text-body-small">{{ prop.type }}</code>
          </td>
          <td class="px-4 py-3 text-on-surface-variant">
            <code v-if="prop.default" class="text-body-small">{{ prop.default }}</code>
            <span v-else class="text-outline">—</span>
          </td>
          <td class="px-4 py-3 text-on-surface-variant">{{ prop.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
