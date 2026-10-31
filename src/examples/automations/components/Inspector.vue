<script setup lang="ts">
/* The selected step's settings: its name and its kind's fields; duplicate and delete. */
import { computed } from 'vue'
import { MButton, MIcon, MIconButton, MSelect, MTextField } from '@m3ui-vue/m3ui-vue'
import type { FlowNode } from '@m3ui-vue/m3ui-vue/flow'
import { categories, kindById } from '../catalog'
import type { StepData } from '../useWorkflow'

const props = defineProps<{ node: FlowNode<StepData> }>()
const emit = defineEmits<{ update: [data: StepData]; duplicate: []; delete: []; close: [] }>()

const kind = computed(() => kindById.get(props.node.data!.kind)!)
const category = computed(() => categories.find((c) => c.id === kind.value.category)!)
const set = (patch: Partial<StepData>) => emit('update', { ...props.node.data!, ...patch })
const setField = (key: string, value: unknown) => set({ config: { ...props.node.data!.config, [key]: String(value ?? '') } })
</script>

<template>
  <div class="flex h-full flex-col">
    <header class="flex items-center gap-3 px-4 pt-4 pb-2">
      <MIcon :name="kind.icon" :size="24" class="text-primary" />
      <div class="min-w-0 flex-1">
        <div class="text-title-medium">{{ kind.label }}</div>
        <div class="text-body-small text-on-surface-variant">{{ category.label.slice(0, -1) }} · {{ kind.description }}</div>
      </div>
      <MIconButton icon="close" label="Close" @click="emit('close')" />
    </header>
    <div class="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-3">
      <MTextField :model-value="node.data!.label" label="Name" variant="outlined" :debounce="300" @update:model-value="set({ label: String($event) })" />
      <template v-for="f in kind.fields" :key="`${node.id}-${f.key}`">
        <MSelect
          v-if="f.type === 'select'"
          :model-value="node.data!.config[f.key]"
          :options="f.options!.map((o) => ({ value: o, label: o }))"
          :label="f.label"
          variant="outlined"
          @update:model-value="setField(f.key, $event)"
        />
        <MTextField
          v-else
          :model-value="node.data!.config[f.key] ?? ''"
          :label="f.label"
          variant="outlined"
          :multiline="f.type === 'textarea'"
          :rows="3"
          :required="f.required"
          :error="f.required && !node.data!.config[f.key]?.trim()"
          :error-label="f.required ? `${f.label} is required` : undefined"
          :hint="f.placeholder ? `e.g. ${f.placeholder}` : undefined"
          :debounce="300"
          @update:model-value="setField(f.key, $event)"
        />
      </template>
    </div>
    <footer class="flex gap-2 border-t border-outline-variant px-4 py-3">
      <MButton variant="text" icon="content_copy" @click="emit('duplicate')">Duplicate</MButton>
      <span class="flex-1" />
      <MButton variant="text" icon="delete" class="text-error!" @click="emit('delete')">Delete</MButton>
    </footer>
  </div>
</template>
