<script setup lang="ts">
/* A person on the chart: avatar, name, role, department; a button under the card asks to fold or unfold their team. */
import { computed } from 'vue'
import { MAvatar, MIcon } from '@m3ui-vue/m3ui-vue'
import { deptOf, type Person } from '../people'
import { useOrg } from '../useOrg'

const props = defineProps<{ person: Person; selected: boolean; dragging: boolean; dropTarget: boolean }>()
const emit = defineEmits<{ toggle: [] }>()
const org = useOrg()
const teamSize = computed(() => org.team(props.person.id).length)
const directs = computed(() => org.reports.value.get(props.person.id)?.length ?? 0)
const folded = computed(() => org.collapsed.value.has(props.person.id))
const dimmed = computed(() => !!org.filter.value && org.filter.value !== props.person.dept)
const dept = computed(() => deptOf(props.person.dept))
</script>

<template>
  <div class="relative w-60 pb-3 transition-opacity duration-300" :class="dimmed && 'opacity-35'">
    <div
      class="flex flex-col gap-2 rounded-lg border bg-surface p-3 transition-[box-shadow,border-color] duration-200"
      :class="[
        dropTarget ? 'border-primary ring-2 ring-primary' : selected ? 'border-primary ring-1 ring-primary' : 'border-outline-variant',
        org.focusId.value === person.id && !selected && 'ring-2 ring-tertiary',
        dragging ? 'shadow-elevation-4' : 'shadow-elevation-1 hover:shadow-elevation-2',
      ]"
    >
      <div class="flex items-center gap-3">
        <MAvatar :name="person.name" :size="40" />
        <div class="min-w-0 flex-1">
          <div class="truncate text-title-small text-on-surface">{{ person.name }}</div>
          <div class="truncate text-body-small text-on-surface-variant">{{ person.role }}</div>
        </div>
      </div>
      <div class="flex items-center gap-2 text-label-small">
        <span class="inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5" :class="dept.tone">
          <MIcon :name="dept.icon" :size="14" />{{ person.dept }}
        </span>
        <span class="truncate text-on-surface-variant">{{ person.location }}</span>
      </div>
      <div v-if="dropTarget" class="text-label-medium text-primary">Drop to report to {{ person.name.split(' ')[0] }}</div>
    </div>
    <button
      v-if="directs"
      type="button"
      class="absolute bottom-0 left-1/2 flex h-6 -translate-x-1/2 cursor-pointer items-center gap-0.5 rounded-full border border-outline-variant bg-surface-container-high px-2 text-label-small text-on-surface-variant transition-colors outline-none hover:bg-secondary-container hover:text-on-secondary-container focus-visible:ring-2 focus-visible:ring-secondary"
      :aria-label="folded ? `Show ${person.name}'s team (${teamSize})` : `Hide ${person.name}'s team`"
      :aria-expanded="!folded"
      @click="emit('toggle')"
    >
      {{ folded ? teamSize : directs }}
      <MIcon :name="folded ? 'expand_more' : 'expand_less'" :size="16" />
    </button>
  </div>
</template>
