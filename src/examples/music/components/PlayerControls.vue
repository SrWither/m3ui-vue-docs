<script setup lang="ts">
/* Shuffle, previous, play/pause, next and repeat. */
import { computed } from 'vue'
import { MIcon, MIconButton, MTooltip } from '@m3ui-vue/m3ui-vue'
import { useMusic } from '../useMusic'

const props = defineProps<{ large?: boolean }>()
const { playing, shuffle, repeat, toggle, next, prev, cycleRepeat } = useMusic()

const repeatLabel = computed(() => ({ off: 'Repeat', all: 'Repeat one', one: 'Turn off repeat' })[repeat.value])
const size = computed(() => (props.large ? 'md' : 'sm'))
</script>

<template>
  <div class="flex items-center justify-center" :class="large ? 'gap-3' : 'gap-1'">
    <MTooltip :text="shuffle ? 'Turn off shuffle' : 'Shuffle'">
      <span class="relative inline-flex">
        <MIconButton icon="shuffle" :label="shuffle ? 'Turn off shuffle' : 'Shuffle'" :size="size" :color="shuffle ? 'primary' : undefined" :aria-pressed="shuffle" @click="shuffle = !shuffle" />
        <span v-if="shuffle" class="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
      </span>
    </MTooltip>
    <MTooltip text="Previous">
      <MIconButton icon="skip_previous" label="Previous" :size="size" icon-filled @click="prev" />
    </MTooltip>
    <button
      type="button"
      :aria-label="playing ? 'Pause' : 'Play'"
      class="flex shrink-0 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
      :class="large ? 'h-16 w-16 bg-primary text-on-primary' : 'h-9 w-9 bg-on-surface text-surface'"
      @click="toggle"
    >
      <MIcon :name="playing ? 'pause' : 'play_arrow'" :size="large ? 36 : 24" filled />
    </button>
    <MTooltip text="Next">
      <MIconButton icon="skip_next" label="Next" :size="size" icon-filled @click="next()" />
    </MTooltip>
    <MTooltip :text="repeatLabel">
      <span class="relative inline-flex">
        <MIconButton :icon="repeat === 'one' ? 'repeat_one' : 'repeat'" :label="repeatLabel" :size="size" :color="repeat !== 'off' ? 'primary' : undefined" @click="cycleRepeat" />
        <span v-if="repeat !== 'off'" class="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
      </span>
    </MTooltip>
  </div>
</template>
