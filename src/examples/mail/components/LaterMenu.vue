<script setup lang="ts">
/* Snooze choices: quick presets, or any date and time picked in a dialog. */
import { ref } from 'vue'
import { MIconButton, MMenu, MMenuDivider, MMenuItem } from '@m3ui-vue/m3ui-vue'
import { formatWhen, laterOptions } from '../useMail'
import DateTimeDialog from './DateTimeDialog.vue'

defineProps<{ icon: string; label: string; title: string; align?: 'left' | 'right' }>()
const emit = defineEmits<{ choose: [at: number] }>()

const options = ref(laterOptions())
const picking = ref(false)
</script>

<template>
  <MMenu :align="align ?? 'right'">
    <template #trigger>
      <MIconButton :icon="icon" :label="label" @click="options = laterOptions()" />
    </template>
    <p class="px-4 pt-2 pb-1 text-label-medium text-on-surface-variant">{{ title }}</p>
    <MMenuItem v-for="o in options" :key="o.label" :icon="o.icon" :shortcut="formatWhen(o.at).replace(/^\w+, /, '')" @click="emit('choose', o.at)">{{ o.label }}</MMenuItem>
    <MMenuDivider />
    <MMenuItem icon="calendar_month" @click="picking = true">Pick date &amp; time</MMenuItem>
  </MMenu>
  <DateTimeDialog v-model="picking" :title="title" @choose="emit('choose', $event)" />
</template>
