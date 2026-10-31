<script setup lang="ts">
/* The selected person: contact details, who they report to and who reports to them (each opens on the chart). */
import { computed } from 'vue'
import { MAvatar, MDivider, MIcon, MIconButton, MList, MListItem } from '@m3ui-vue/m3ui-vue'
import { deptOf, emailOf, type Person } from '../people'
import { useOrg } from '../useOrg'

const props = defineProps<{ person: Person }>()
const emit = defineEmits<{ open: [id: string]; close: [] }>()
const org = useOrg()
const manager = computed(() => (props.person.managerId ? org.byId.value.get(props.person.managerId) : undefined))
const reports = computed(() => org.reports.value.get(props.person.id) ?? [])
const teamSize = computed(() => org.team(props.person.id).length)
const dept = computed(() => deptOf(props.person.dept))
</script>

<template>
  <div class="flex h-full flex-col overflow-y-auto">
    <div class="flex justify-end p-2"><MIconButton icon="close" label="Close" @click="emit('close')" /></div>
    <div class="flex flex-col items-center gap-2 px-6 pb-4 text-center">
      <MAvatar :name="person.name" :size="72" />
      <div class="text-headline-small text-on-surface">{{ person.name }}</div>
      <div class="text-body-medium text-on-surface-variant">{{ person.role }}</div>
      <span class="inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-label-medium" :class="dept.tone">
        <MIcon :name="dept.icon" :size="16" />{{ person.dept }}
      </span>
    </div>
    <MList>
      <MListItem icon="mail" :title="emailOf(person)" subtitle="Email" />
      <MListItem icon="location_on" :title="person.location" subtitle="Office" />
      <MListItem icon="event" :title="`Since ${person.since}`" subtitle="Joined" />
      <MListItem v-if="teamSize" icon="groups" :title="`${teamSize} ${teamSize === 1 ? 'person' : 'people'}`" subtitle="Team, everyone below" />
    </MList>
    <template v-if="manager">
      <MDivider />
      <div class="px-4 pt-3 text-label-large text-on-surface-variant">Reports to</div>
      <MList>
        <MListItem :title="manager.name" :subtitle="manager.role" clickable @click="emit('open', manager.id)">
          <template #leading><MAvatar :name="manager.name" :size="40" /></template>
        </MListItem>
      </MList>
    </template>
    <template v-if="reports.length">
      <MDivider />
      <div class="px-4 pt-3 text-label-large text-on-surface-variant">Direct reports ({{ reports.length }})</div>
      <MList>
        <MListItem v-for="r in reports" :key="r.id" :title="r.name" :subtitle="r.role" clickable @click="emit('open', r.id)">
          <template #leading><MAvatar :name="r.name" :size="40" /></template>
        </MListItem>
      </MList>
    </template>
  </div>
</template>
