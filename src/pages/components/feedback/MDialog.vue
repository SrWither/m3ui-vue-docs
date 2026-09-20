<script setup lang="ts">
import { ref } from 'vue'
import { MDialog, MButton, MIcon, MTextField, MSelect, MSwitch, useToast } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const toast = useToast()

const dialogOpen = ref(false)
const iconDialogOpen = ref(false)
const fullscreenDialog = ref(false)
const fullscreenFormDialog = ref(false)
const shortDialog = ref(false)
const tallDialog = ref(false)

const formName = ref('')
const formEmail = ref('')
const formRole = ref('developer')
const formNotifications = ref(true)

const dialogProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state (v-model)' },
  { name: 'title', type: 'string', description: 'Dialog title (overridable via the #title slot)' },
  { name: 'maxWidth', type: 'string', default: "'max-w-[560px]'", description: "Tailwind max-width class (M3 AlertDialogDefaults.DialogMaxWidth = 560dp); min-width is fixed at 280px (DialogMinWidth)" },
  { name: 'maxHeight', type: 'string', default: "'max-h-[90vh]'", description: "Tailwind max-height class. M3's AlertDialogDefaults has no max-height token at all (only DialogMaxWidth) — this is a library-chosen viewport-relative cap, not a spec value. When content overflows it, the body scrolls and a divider auto-appears above the actions row." },
  { name: 'persistent', type: 'boolean', default: 'false', description: 'Prevent closing by clicking the scrim, pressing Escape, or the X button' },
  { name: 'fullscreen', type: 'boolean', default: 'false', description: 'Full-screen variant — slides up from the bottom, covers the entire viewport' },
  { name: 'closeLabel', type: 'string', description: 'Aria label for the close (X) button — falls back to the locale string when omitted' },
  { name: 'closable', type: 'boolean', default: 'true', description: 'Show the header close (X) button — a library addition, not part of the M3 AlertDialog spec, so it can be turned off' },
]

const dialogEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Emitted when the dialog should open/close — powers v-model' },
]

const dialogSlots: SlotDef[] = [
  { name: '#default', description: 'Dialog body content — scrolls independently when taller than maxHeight' },
  { name: '#icon', description: "M3 AlertDialog's optional icon (Secondary color, 24dp expected). Its presence also centers the title, per spec." },
  { name: '#title', description: 'Overrides the title prop with custom markup' },
  { name: '#actions', description: 'Row of action buttons — wraps to a new line instead of overflowing when labels are long' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MDialog</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The generic M3 modal shell — Escape, scroll lock, and Teleport are handled internally. Supports a
      centered card, a full-screen variant, and an optional icon that centers the title per spec.
    </p>

    <ComponentDemo
      title="Basic Dialog"
      description="Modal dialog with title, content, and actions."
      :code="`<MButton @click=&quot;open = true&quot;>Open</MButton>
<MDialog v-model=&quot;open&quot; title=&quot;Dialog Title&quot;>
  <p>Dialog content goes here.</p>
  <template #actions>
    <MButton variant=&quot;text&quot; @click=&quot;open = false&quot;>Cancel</MButton>
    <MButton @click=&quot;open = false&quot;>OK</MButton>
  </template>
</MDialog>`"
      :script="`const open = ref(false)`"
    >
      <MButton @click="dialogOpen = true">Open Dialog</MButton>
      <MDialog v-model="dialogOpen" title="Example Dialog">
        <p class="text-body-medium text-on-surface-variant">
          This is a basic dialog. Click outside or press the buttons below to close it.
        </p>
        <template #actions>
          <MButton variant="text" @click="dialogOpen = false">Cancel</MButton>
          <MButton @click="dialogOpen = false">OK</MButton>
        </template>
      </MDialog>
    </ComponentDemo>

    <ComponentDemo
      title="Dialog with Icon"
      description="M3 AlertDialog's optional #icon slot (Secondary color, 24dp) — its presence also centers the title, per spec."
      :code="`<MButton @click=&quot;open = true&quot;>Open</MButton>
<MDialog v-model=&quot;open&quot; title=&quot;Delete file?&quot; max-width=&quot;max-w-sm&quot;>
  <template #icon>
    <MIcon name=&quot;warning&quot; :size=&quot;24&quot; />
  </template>
  <p>This action can't be undone.</p>
  <template #actions>
    <MButton variant=&quot;text&quot; @click=&quot;open = false&quot;>Cancel</MButton>
    <MButton color=&quot;error&quot; @click=&quot;open = false&quot;>Delete</MButton>
  </template>
</MDialog>`"
      :script="`const open = ref(false)`"
    >
      <MButton @click="iconDialogOpen = true">Open Dialog</MButton>
      <MDialog v-model="iconDialogOpen" title="Delete file?" max-width="max-w-sm">
        <template #icon>
          <MIcon name="warning" :size="24" />
        </template>
        <p class="text-body-medium text-on-surface-variant">
          This action can't be undone.
        </p>
        <template #actions>
          <MButton variant="text" @click="iconDialogOpen = false">Cancel</MButton>
          <MButton color="error" @click="iconDialogOpen = false">Delete</MButton>
        </template>
      </MDialog>
    </ComponentDemo>

    <ComponentDemo
      title="maxHeight & the auto scroll divider"
      description="When body content is taller than maxHeight, the body scrolls and a divider automatically appears above the actions row for as long as there's more to scroll to — try shrinking maxHeight to max-w-[280px] with a lot of content."
      :code="`<MDialog
  v-model=&quot;open&quot;
  title=&quot;Terms of Service&quot;
  max-height=&quot;max-h-[240px]&quot;
>
  <p>… a lot of long content …</p>
  <template #actions>
    <MButton variant=&quot;text&quot; @click=&quot;open = false&quot;>Decline</MButton>
    <MButton @click=&quot;open = false&quot;>Accept</MButton>
  </template>
</MDialog>`"
    >
      <MButton @click="tallDialog = true">Open Long-Content Dialog</MButton>
      <MDialog v-model="tallDialog" title="Terms of Service" max-height="max-h-[240px]">
        <p v-for="i in 8" :key="i" class="mb-3 text-body-medium text-on-surface-variant">
          Paragraph {{ i }} — scroll down to see the divider disappear once you reach the bottom of the content, right above the actions row.
        </p>
        <template #actions>
          <MButton variant="text" @click="tallDialog = false">Decline</MButton>
          <MButton @click="tallDialog = false">Accept</MButton>
        </template>
      </MDialog>
    </ComponentDemo>

    <ComponentDemo
      title="Persistent"
      description="With persistent, the scrim, Escape key, and close button all stop closing the dialog — only the actions can."
      :code="`<MDialog v-model=&quot;open&quot; title=&quot;Processing&quot; :persistent=&quot;true&quot;>
  <p>Please wait for the operation to finish.</p>
  <template #actions>
    <MButton @click=&quot;open = false&quot;>Done</MButton>
  </template>
</MDialog>`"
    >
      <MButton @click="shortDialog = true">Open Persistent Dialog</MButton>
      <MDialog v-model="shortDialog" title="Processing" :persistent="true">
        <p class="text-body-medium text-on-surface-variant">
          Clicking outside or pressing Escape won't close this — only the button below will.
        </p>
        <template #actions>
          <MButton @click="shortDialog = false">Done</MButton>
        </template>
      </MDialog>
    </ComponentDemo>

    <ComponentDemo
      title="Full-Screen Dialog"
      description="Covers the entire viewport. Slides up on open, down on close. Actions go in the top bar — M3 typically uses text variant for the action button."
      :code="`<MDialog v-model=&quot;open&quot; title=&quot;Edit Profile&quot; :fullscreen=&quot;true&quot;>
  <p>Content here...</p>
  <template #actions>
    <MButton variant=&quot;text&quot; @click=&quot;open = false&quot;>Save</MButton>
  </template>
</MDialog>`"
    >
      <MButton @click="fullscreenDialog = true">Open Full-Screen</MButton>
      <MDialog v-model="fullscreenDialog" title="Edit Profile" :fullscreen="true">
        <div class="mx-auto flex max-w-lg flex-col gap-6">
          <div class="flex flex-col gap-4">
            <div>
              <p class="text-label-medium text-on-surface-variant">Name</p>
              <p class="text-body-large text-on-surface">Fadel Chafworking</p>
            </div>
            <div>
              <p class="text-label-medium text-on-surface-variant">Email</p>
              <p class="text-body-large text-on-surface">fadel@example.com</p>
            </div>
            <div>
              <p class="text-label-medium text-on-surface-variant">Bio</p>
              <p class="text-body-large text-on-surface">Software engineer building awesome things with Vue and Material Design.</p>
            </div>
          </div>
          <div>
            <p class="mb-2 text-title-medium font-medium text-on-surface">Danger Zone</p>
            <p class="text-body-medium text-on-surface-variant">Deleting your account is permanent and cannot be undone.</p>
          </div>
        </div>
        <template #actions>
          <MButton variant="text" @click="fullscreenDialog = false">Save</MButton>
        </template>
      </MDialog>
    </ComponentDemo>

    <ComponentDemo
      title="Full-Screen with Form"
      description="A common pattern — fullscreen dialog with a complete form. Close discards, Save confirms."
      :code="`<MDialog v-model=&quot;open&quot; title=&quot;New Member&quot; :fullscreen=&quot;true&quot;>
  <MTextField v-model=&quot;name&quot; label=&quot;Name&quot; />
  <MSelect v-model=&quot;role&quot; :options=&quot;roles&quot; label=&quot;Role&quot; />
  <template #actions>
    <MButton variant=&quot;text&quot; @click=&quot;save()&quot;>Save</MButton>
  </template>
</MDialog>`"
    >
      <MButton @click="fullscreenFormDialog = true">Open Form Dialog</MButton>
      <MDialog v-model="fullscreenFormDialog" title="New Member" :fullscreen="true">
        <div class="mx-auto flex max-w-lg flex-col gap-5 pt-2">
          <MTextField v-model="formName" label="Full Name" variant="outlined" leading-icon="person" />
          <MTextField v-model="formEmail" label="Email" variant="outlined" leading-icon="email" />
          <MSelect
            v-model="formRole"
            :options="[
              { label: 'Developer', value: 'developer' },
              { label: 'Designer', value: 'designer' },
              { label: 'Manager', value: 'manager' },
              { label: 'QA Engineer', value: 'qa' },
            ]"
            label="Role"
            variant="outlined"
            leading-icon="work"
          />
          <div class="flex items-center justify-between rounded-lg bg-surface-container-highest px-4 py-3">
            <div>
              <p class="text-body-large text-on-surface">Email notifications</p>
              <p class="text-body-small text-on-surface-variant">Receive updates about assigned tasks</p>
            </div>
            <MSwitch v-model="formNotifications" />
          </div>
        </div>
        <template #actions>
          <MButton variant="text" @click="fullscreenFormDialog = false; toast.success('Member created!')">Save</MButton>
        </template>
      </MDialog>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="dialogProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="dialogEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="dialogSlots" />

    <ComponentPager current="MDialog" />
  </div>
</template>
