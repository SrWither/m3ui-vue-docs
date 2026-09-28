<script setup lang="ts">
import { computed, ref } from 'vue'
import { MAvatar, MButton, MCard, MSwitch, MTextField, useToast } from '@m3ui-vue/m3ui-vue'

const toast = useToast()

const name = ref('')
const email = ref('')
const newsletter = ref(true)
const saving = ref(false)

const emailInvalid = computed(() => email.value !== '' && !/^\S+@\S+\.\S+$/.test(email.value))
const canSave = computed(() => name.value.trim() !== '' && email.value !== '' && !emailInvalid.value)

async function save() {
  saving.value = true
  await new Promise(resolve => setTimeout(resolve, 800)) // your API call here
  saving.value = false
  toast.success(`Saved, ${name.value.trim().split(' ')[0]}!`)
}

function reset() {
  name.value = ''
  email.value = ''
  newsletter.value = true
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-surface p-4">
    <MCard variant="outlined" class="w-full max-w-md">
      <template #header>
        <div class="flex items-center gap-4">
          <MAvatar :name="name" fallback="?" :size="48" />
          <div>
            <h3 class="text-title-large text-on-surface">{{ name || 'Your profile' }}</h3>
            <p class="text-body-medium text-on-surface-variant">Tell us a bit about yourself</p>
          </div>
        </div>
      </template>

      <div class="flex flex-col gap-4 px-4 pt-2">
        <MTextField v-model="name" label="Name" leading-icon="person" required />
        <MTextField
          v-model="email"
          label="Email"
          type="email"
          leading-icon="mail"
          :error="emailInvalid"
          error-label="Enter a valid email"
          hint="We'll never share it"
        />
        <MSwitch v-model="newsletter" label="Send me product updates" />
      </div>

      <template #actions>
        <MButton variant="text" @click="reset">Reset</MButton>
        <MButton icon="save" :disabled="!canSave" :loading="saving" @click="save">Save</MButton>
      </template>
    </MCard>
  </div>
</template>
