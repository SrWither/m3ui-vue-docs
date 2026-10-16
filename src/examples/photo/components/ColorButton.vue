<script setup lang="ts">
/* A color swatch that opens a menu of presets, with "Custom…" for the full color picker. */
import { ref } from 'vue'
import { MColorPickerModal, MIcon, MMenu, MMenuDivider, MMenuItem, MTooltip } from '@m3ui-vue/m3ui-vue'

const props = defineProps<{ modelValue: string; label?: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const swatches = [
  '#ffffff', '#d0d0d0', '#777777', '#000000', '#ef476f', '#ff7b00',
  '#ffd166', '#06d6a0', '#118ab2', '#4361ee', '#9b5de5', '#f15bb5',
]
const custom = ref(false)
const customValue = ref(props.modelValue)
function openCustom() {
  customValue.value = props.modelValue
  custom.value = true
}
</script>

<template>
  <MMenu align="left">
    <template #trigger>
      <MTooltip :text="label ?? 'Color'" placement="top">
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full outline-none transition-colors hover:bg-on-surface/8 focus-visible:ring-2 focus-visible:ring-secondary"
          :aria-label="label ?? 'Color'"
        >
          <span class="h-6 w-6 rounded-full border-2 border-outline" :style="{ background: modelValue }" />
        </button>
      </MTooltip>
    </template>
    <template #default="{ close }">
      <div class="grid grid-cols-6 gap-1.5 px-3 py-2">
        <button
          v-for="c in swatches"
          :key="c"
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-secondary"
          :style="{ background: c }"
          :aria-label="c"
          @click="emit('update:modelValue', c); close()"
        >
          <MIcon v-if="c === modelValue" name="check" :size="18" :class="['#ffffff', '#d0d0d0', '#ffd166', '#06d6a0'].includes(c) ? 'text-black' : 'text-white'" />
        </button>
      </div>
      <MMenuDivider />
      <MMenuItem icon="palette" @click="openCustom">Custom…</MMenuItem>
    </template>
  </MMenu>
  <MColorPickerModal
    v-model="customValue"
    v-model:show="custom"
    :presets="swatches"
    :title="label ?? 'Color'"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
