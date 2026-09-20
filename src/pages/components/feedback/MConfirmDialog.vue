<script setup lang="ts">
import { ref } from 'vue'
import { MConfirmDialog, MButton, useToast } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const toast = useToast()

const confirmOpen = ref(false)
const confirmDanger = ref(false)
const confirmLoading = ref(false)

const noCloseOpen = ref(false)

function handleConfirm() {
  confirmLoading.value = true
  setTimeout(() => {
    confirmLoading.value = false
    confirmOpen.value = false
    toast.success('Action confirmed')
  }, 1500)
}

const confirmProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state (v-model)' },
  { name: 'title', type: 'string', description: 'Dialog title' },
  { name: 'message', type: 'string', description: 'Confirmation message body' },
  { name: 'confirmLabel', type: 'string', description: "Confirm button label — falls back to the locale string when omitted" },
  { name: 'cancelLabel', type: 'string', description: "Cancel button label — falls back to the locale string when omitted" },
  { name: 'danger', type: 'boolean', default: 'false', description: "Error color on the confirm button, for destructive actions" },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a spinner on the confirm button and disables cancel' },
  { name: 'closable', type: 'boolean', default: 'true', description: "Passed straight through to MDialog's closable — show/hide the header close (X) button" },
]

const confirmEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Emitted when the dialog should open/close — powers v-model' },
  { name: 'confirm', description: 'Emitted when the confirm button is clicked — the dialog stays open until the caller sets modelValue to false (or clears loading)' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MConfirmDialog</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A pre-built confirmation dialog on top of MDialog — title, message, cancel/confirm buttons, a danger
      color mode, and a loading state, so you don't have to hand-roll one for every "are you sure?" prompt.
    </p>

    <ComponentDemo
      title="Confirm Dialog"
      description="Pre-built confirmation dialog with loading state and danger mode."
      :code="`<MConfirmDialog
  v-model=&quot;open&quot;
  title=&quot;Delete item?&quot;
  message=&quot;This action cannot be undone.&quot;
  :danger=&quot;true&quot;
  confirm-label=&quot;Delete&quot;
  @confirm=&quot;handleDelete&quot;
/>`"
      :script="`const open = ref(false)

function handleDelete() {
  // your logic
  open.value = false
}`"
    >
      <div class="flex gap-3">
        <MButton variant="tonal" @click="confirmDanger = false; confirmOpen = true">Confirm</MButton>
        <MButton variant="tonal" color="error" @click="confirmDanger = true; confirmOpen = true">Danger</MButton>
      </div>
      <MConfirmDialog
        v-model="confirmOpen"
        :title="confirmDanger ? 'Delete item?' : 'Save changes?'"
        :message="confirmDanger ? 'This action cannot be undone.' : 'Your changes will be saved permanently.'"
        :danger="confirmDanger"
        :loading="confirmLoading"
        :confirm-label="confirmDanger ? 'Delete' : 'Save'"
        cancel-label="Cancel"
        @confirm="handleConfirm"
      />
    </ComponentDemo>

    <ComponentDemo
      title="Without the close button"
      description="Set closable to false to hide the header X and force the user through Cancel/Confirm."
      :code="`<MConfirmDialog
  v-model=&quot;open&quot;
  title=&quot;Sign out?&quot;
  message=&quot;You'll need to sign in again to access your account.&quot;
  :closable=&quot;false&quot;
  @confirm=&quot;signOut&quot;
/>`"
    >
      <MButton variant="tonal" @click="noCloseOpen = true">Sign Out</MButton>
      <MConfirmDialog
        v-model="noCloseOpen"
        title="Sign out?"
        message="You'll need to sign in again to access your account."
        :closable="false"
        @confirm="noCloseOpen = false; toast.info('Signed out')"
      />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="confirmProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="confirmEvents" />

    <ComponentPager current="MConfirmDialog" />
  </div>
</template>
