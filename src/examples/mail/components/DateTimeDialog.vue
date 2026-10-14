<script setup lang="ts">
/* Pick any future date and time (MDatePicker + MTimePicker). Used by snooze and schedule send. */
import { computed, ref, watch } from 'vue'
import { MButton, MDatePicker, MDialog, MTimePicker } from '@m3ui-vue/m3ui-vue'
import { formatWhen } from '../useMail'

const open = defineModel<boolean>({ required: true })
defineProps<{ title: string }>()
const emit = defineEmits<{ choose: [at: number] }>()

const pad = (n: number) => String(n).padStart(2, '0')
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const date = ref<string | null>(null)
const time = ref<string | null>('08:00')
watch(open, (o) => {
  if (!o) return
  date.value = iso(new Date(Date.now() + 86_400_000))
  time.value = '08:00'
})

const today = iso(new Date())
const chosen = computed(() => (date.value && time.value ? new Date(`${date.value}T${time.value}`).getTime() : NaN))
const valid = computed(() => !Number.isNaN(chosen.value) && chosen.value > Date.now())

function confirm() {
  if (!valid.value) return
  open.value = false
  emit('choose', chosen.value)
}
</script>

<template>
  <MDialog v-model="open" :title="title" max-width="max-w-sm">
    <div class="flex flex-col gap-4 pt-1">
      <MDatePicker v-model="date" label="Date" :min="today" />
      <MTimePicker v-model="time" label="Time" :use24h="false" :minute-step="15" />
      <p class="text-body-medium" :class="valid ? 'text-on-surface-variant' : 'text-error'">
        {{ valid ? formatWhen(chosen) : 'Pick a time in the future' }}
      </p>
    </div>
    <template #actions>
      <MButton variant="text" @click="open = false">Cancel</MButton>
      <MButton :disabled="!valid" @click="confirm">Save</MButton>
    </template>
  </MDialog>
</template>
