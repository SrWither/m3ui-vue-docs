<script setup lang="ts">
/* Naming something: a new folder, or a rename (the name is selected without its extension, as Drive does). */
import { nextTick, ref, watch } from 'vue'
import { MButton, MDialog, MTextField } from '@m3ui-vue/m3ui-vue'

const open = defineModel<boolean>({ required: true })
const props = defineProps<{ title: string; action: string; initial: string }>()
const emit = defineEmits<{ submit: [string] }>()

const name = ref('')
const field = ref<HTMLElement>()
watch(open, async (o) => {
  if (!o) return
  name.value = props.initial
  await nextTick()
  const input = field.value?.querySelector('input')
  if (!input) return
  input.focus()
  const dot = props.initial.lastIndexOf('.')
  input.setSelectionRange(0, dot > 0 ? dot : props.initial.length)
})
function submit() {
  if (!name.value.trim()) return
  emit('submit', name.value)
  open.value = false
}
</script>

<template>
  <MDialog v-model="open" :title="title" max-width="max-w-[400px]">
    <form ref="field" @submit.prevent="submit">
      <MTextField v-model="name" label="Name" variant="outlined" class="w-full" />
    </form>
    <template #actions>
      <MButton variant="text" @click="open = false">Cancel</MButton>
      <MButton variant="text" :disabled="!name.trim()" @click="submit">{{ action }}</MButton>
    </template>
  </MDialog>
</template>
