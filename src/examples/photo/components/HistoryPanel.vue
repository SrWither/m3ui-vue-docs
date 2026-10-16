<script setup lang="ts">
/* Every step since the photo was opened; click one to go back to it (later steps stay, dimmed, until you change something). */
import { nextTick, ref, watch } from 'vue'
import { MList, MListItem } from '@m3ui-vue/m3ui-vue'
import { usePhoto } from '../usePhoto'

defineProps<{ compact?: boolean }>()
const { history, index, jumpTo } = usePhoto()
const listEl = ref<HTMLElement>()
watch(index, async () => {
  await nextTick()
  listEl.value?.querySelector('[data-current]')?.scrollIntoView({ block: 'nearest' })
})
</script>

<template>
  <div ref="listEl" :class="compact ? 'py-2' : 'p-2'">
    <MList dense>
      <MListItem
        v-for="(e, i) in history"
        :key="i"
        :title="e.label"
        :icon="e.icon"
        :active="i === index"
        :data-current="i === index || undefined"
        :trailing-text="i === 0 ? 'Start' : undefined"
        clickable
        :class="i > index ? 'opacity-45' : ''"
        @click="jumpTo(i)"
      />
    </MList>
  </div>
</template>
