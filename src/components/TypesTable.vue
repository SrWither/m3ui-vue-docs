<script setup lang="ts">
export interface TypeFieldDef {
  name: string
  type: string
  required?: boolean
  description: string
}

export interface TypeDef {
  name: string
  description?: string
  fields: TypeFieldDef[]
}

defineProps<{ types: TypeDef[] }>()
</script>

<template>
  <div v-for="t in types" :key="t.name" class="mb-4 last:mb-0">
    <p class="mb-2">
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">{{ t.name }}</code>
      <span v-if="t.description" class="ml-2 text-body-small text-on-surface-variant">{{ t.description }}</span>
    </p>
    <div class="overflow-x-auto rounded-xl border border-outline-variant">
      <table class="w-full text-body-medium">
        <thead>
          <tr class="border-b border-outline-variant bg-surface-container">
            <th class="px-4 py-3 text-left text-label-large font-medium">Field</th>
            <th class="px-4 py-3 text-left text-label-large font-medium">Type</th>
            <th class="px-4 py-3 text-left text-label-large font-medium">Required</th>
            <th class="px-4 py-3 text-left text-label-large font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="field in t.fields"
            :key="field.name"
            class="border-b border-outline-variant last:border-b-0"
          >
            <td class="px-4 py-3">
              <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">{{ field.name }}</code>
            </td>
            <td class="px-4 py-3 text-on-surface-variant">
              <code class="text-body-small">{{ field.type }}</code>
            </td>
            <td class="px-4 py-3 text-on-surface-variant">
              <span v-if="field.required" class="text-body-small">Yes</span>
              <span v-else class="text-outline">—</span>
            </td>
            <td class="px-4 py-3 text-on-surface-variant">{{ field.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
