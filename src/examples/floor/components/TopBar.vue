<script setup lang="ts">
/* Logo, the room, service or layout, the night's numbers, theme, docs and source. */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { MIcon, MIconButton, MMenu, MMenuItem, MSegmentedButton, MTooltip, useTheme } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { useFloor } from '../useFloor'

defineProps<{ wide: boolean }>()
const editing = defineModel<boolean>('editing', { required: true })
const f = useFloor()
const router = useRouter()
const { theme, cycle } = useTheme()
const themeIcon = computed(() => ({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' })[theme.value])
const openSource = () => window.open(exampleSource('floor'), '_blank', 'noopener')
</script>

<template>
  <header class="flex min-h-16 shrink-0 flex-wrap items-center gap-x-2 gap-y-2 px-2 py-2 sm:px-4">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary"><MIcon name="table_restaurant" :size="22" /></span>
    <span v-if="wide" class="mr-2 text-title-large font-medium">Seated</span>
    <MSegmentedButton v-model="f.roomId.value" :options="f.rooms.value.map((r) => ({ value: r.id, label: r.name }))" density="compact" />
    <span class="flex-1" />
    <span v-if="wide && !editing" class="flex items-center gap-1 text-label-large text-on-surface-variant">
      <MIcon name="groups" :size="18" /> {{ f.covers.value }} covers · {{ f.counts.value.free }} free
    </span>
    <MSegmentedButton
      :model-value="editing ? 'layout' : 'service'"
      :options="[{ value: 'service', label: 'Service', icon: 'room_service' }, { value: 'layout', label: 'Layout', icon: 'edit' }]"
      @update:model-value="editing = $event === 'layout'"
      density="compact"
    />
    <MMenu align="right">
      <template #trigger>
        <MTooltip text="More" placement="bottom"><MIconButton icon="more_vert" label="More" /></MTooltip>
      </template>
      <MMenuItem icon="restart_alt" @click="f.reset()">Start the sample night again</MMenuItem>
      <MMenuItem :icon="themeIcon" @click="cycle">Theme: {{ theme }}</MMenuItem>
      <MMenuItem icon="menu_book" @click="router.push('/examples')">Back to the docs</MMenuItem>
      <MMenuItem icon="code" @click="openSource">View source on GitHub</MMenuItem>
    </MMenu>
  </header>
</template>
