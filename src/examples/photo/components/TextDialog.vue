<script setup lang="ts">
/* Edits the selected text layer's words; the canvas updates as you type. */
import { ref, watch } from 'vue'
import { MButton, MDialog, MTextField } from '@m3ui-vue/m3ui-vue'
import { usePhoto } from '../usePhoto'

const p = usePhoto()
const { dialogs, selectedText } = p
const value = ref('')
let before = ''

watch(() => dialogs.editText, (open) => {
  if (open) {
    before = selectedText.value?.text ?? ''
    value.value = before
  }
})
watch(value, (v) => {
  if (dialogs.editText && selectedText.value && v) selectedText.value.text = v
})

function done() {
  const l = selectedText.value
  if (l && l.text !== before) {
    if (!l.sticker) l.name = l.text.split('\n')[0]!.slice(0, 32)
    p.commit('Edit text', 'edit')
  }
  dialogs.editText = false
}
function cancel() {
  if (selectedText.value) selectedText.value.text = before
  dialogs.editText = false
}
</script>

<template>
  <MDialog :model-value="dialogs.editText && !!selectedText" title="Edit text" max-width="440px" @update:model-value="cancel">
    <MTextField v-model="value" label="Text" multiline :rows="3" hint="Enter adds a line; Ctrl+Enter saves" @keydown.ctrl.enter="done" @keydown.meta.enter="done" />
    <template #actions>
      <MButton variant="text" @click="cancel">Cancel</MButton>
      <MButton @click="done">Done</MButton>
    </template>
  </MDialog>
</template>
