<script setup lang="ts">
/* Check or uncheck labels on one or more conversations. */
import { MIconButton, MMenu, MMenuItem } from '@m3ui-vue/m3ui-vue'
import { labels } from '../data'
import { useMail } from '../useMail'

const props = defineProps<{ ids: string[] }>()
const { thread, setLabel } = useMail()

const all = (l: string) => props.ids.length > 0 && props.ids.every((id) => thread(id).labels.includes(l))
const some = (l: string) => props.ids.some((id) => thread(id).labels.includes(l))
</script>

<template>
  <MMenu align="right">
    <template #trigger>
      <MIconButton icon="label" label="Labels" />
    </template>
    <p class="px-4 pt-2 pb-1 text-label-medium text-on-surface-variant">Label as</p>
    <MMenuItem
      v-for="l in labels"
      :key="l.id"
      :icon="all(l.id) ? 'check_box' : some(l.id) ? 'indeterminate_check_box' : 'check_box_outline_blank'"
      keep-open
      @click="setLabel(ids, l.id, !all(l.id))"
    >
      {{ l.name }}
    </MMenuItem>
  </MMenu>
</template>
