<script setup lang="ts">
import { ref } from 'vue'
import { MDialog, MButton, MDatePickerModal, MIcon, MTextField, MSelect, MSwitch, useToast } from '@m3ui-vue/m3ui-vue'
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
const bareDialog = ref(false)
const bookingOpen = ref(false)
const bookingDate = ref<string | null>(null)
const bookingPicker = ref(false)
const bookingConfirm = ref(false)
const bookingDateLabel = () =>
  bookingDate.value
    ? new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'long' }).format(new Date(bookingDate.value + 'T00:00:00'))
    : 'Pick a date'
const tallDialog = ref(false)

// One dialog, opened with different sizes: Tailwind classes or CSS values.
const sizes = [
  { label: "max-w-sm", maxWidth: 'max-w-sm', maxHeight: 'max-h-[90vh]' },
  { label: "'720px'", maxWidth: '720px', maxHeight: 'max-h-[90vh]' },
  { label: "'min(90vw, 40rem)' + '50vh'", maxWidth: 'min(90vw, 40rem)', maxHeight: '50vh' },
  { label: "max-w-lg + '300px'", maxWidth: 'max-w-lg', maxHeight: '300px' },
]
const sized = ref<(typeof sizes)[number] | null>(null)
const sizedOpen = ref(false)
function openSized(s: (typeof sizes)[number]) {
  sized.value = s
  sizedOpen.value = true
}

const formName = ref('')
const formEmail = ref('')
const formRole = ref('developer')
const formNotifications = ref(true)

const dialogProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state (v-model)' },
  { name: 'title', type: 'string', description: 'Dialog title (overridable via the #title slot)' },
  { name: 'maxWidth', type: 'string', default: "'max-w-[560px]'", description: "A Tailwind max-width class (max-w-sm) or a CSS value (420px, min(90vw, 40rem)). Default is M3's AlertDialogDefaults.DialogMaxWidth = 560dp; min-width is fixed at 280px (DialogMinWidth)" },
  { name: 'maxHeight', type: 'string', default: "'max-h-[90vh]'", description: "A Tailwind max-height class (max-h-[60vh]) or a CSS value (480px, calc(100dvh - 4rem)). M3's AlertDialogDefaults has no max-height token at all (only DialogMaxWidth) — this is a library-chosen viewport-relative cap, not a spec value. When content overflows it, the body scrolls and a divider auto-appears above the actions row." },
  { name: 'persistent', type: 'boolean', default: 'false', description: 'Prevent closing by clicking the scrim, pressing Escape, or the X button' },
  { name: 'fullscreen', type: 'boolean', default: 'false', description: 'Full-screen variant — slides up from the bottom, covers the entire viewport' },
  { name: 'closeLabel', type: 'string', description: 'Aria label for the close (X) button — falls back to the locale string when omitted' },
  { name: 'closable', type: 'boolean', default: 'true', description: 'Show the header close (X) button — a library addition, not part of the M3 AlertDialog spec, so it can be turned off' },
  { name: 'bare', type: 'boolean', default: 'false', description: 'Just the box (surface, shape, elevation), scrim, Escape, scroll lock and animation, with the default slot filling it: no title row, padding, close button or actions. title then only names it for assistive technology. The date and time picker dialogs are built on it' },
]

const dialogEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Emitted when the dialog should open/close — powers v-model' },
]

const dialogSlots: SlotDef[] = [
  { name: '#default', description: 'Dialog body content — scrolls independently when taller than maxHeight. With bare, the whole dialog' },
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
      description="When body content is taller than maxHeight, the body scrolls and a divider automatically appears above the actions row for as long as there's more to scroll to — try shrinking maxHeight to max-h-[280px] with a lot of content."
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
      title="Sizing: a Tailwind class or a CSS value"
      description="maxWidth and maxHeight take either a Tailwind class or any CSS value: a length, a percentage or a CSS function. Mix them freely."
      :code="`<MDialog v-model=&quot;open&quot; title=&quot;Class&quot; max-width=&quot;max-w-sm&quot; />
<MDialog v-model=&quot;open&quot; title=&quot;Length&quot; max-width=&quot;720px&quot; />
<MDialog v-model=&quot;open&quot; title=&quot;CSS functions&quot; max-width=&quot;min(90vw, 40rem)&quot; max-height=&quot;50vh&quot; />
<MDialog v-model=&quot;open&quot; title=&quot;Mixed&quot; max-width=&quot;max-w-lg&quot; max-height=&quot;300px&quot; />`"
    >
      <div class="flex flex-wrap gap-2">
        <MButton v-for="s in sizes" :key="s.label" variant="tonal" @click="openSized(s)">{{ s.label }}</MButton>
      </div>
      <MDialog v-if="sized" v-model="sizedOpen" :title="sized.label" :max-width="sized.maxWidth" :max-height="sized.maxHeight">
        <p class="mb-3 text-body-medium text-on-surface-variant">
          max-width: <code class="text-primary">{{ sized.maxWidth }}</code> · max-height: <code class="text-primary">{{ sized.maxHeight }}</code>
        </p>
        <p v-for="i in 6" :key="i" class="mb-3 text-body-medium text-on-surface-variant">
          Paragraph {{ i }}: enough text to show how the width wraps it and, with a small max-height, how the body starts scrolling.
        </p>
        <template #actions>
          <MButton @click="sizedOpen = false">Close</MButton>
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

    <ComponentDemo
      title="Bare: draw the whole dialog"
      description="With bare, MDialog keeps the dialog's box, scrim, Escape, scroll lock and animation, and your content fills it edge to edge: here a full-bleed header. The title prop still names the dialog for screen readers. Stacked dialogs share one scroll lock, so closing an inner one never lets the page scroll under an outer one."
      :code="`<MDialog v-model=&quot;open&quot; bare max-width=&quot;360px&quot; title=&quot;New album&quot;>
  <div class=&quot;h-36 bg-linear-to-br from-primary to-tertiary&quot; />
  <div class=&quot;p-6&quot;>
    <h2 class=&quot;text-headline-small&quot;>New album</h2>
    <p class=&quot;mt-2 text-on-surface-variant&quot;>12 photos from your trip are ready to share.</p>
    <div class=&quot;mt-6 flex justify-end gap-2&quot;>
      <MButton variant=&quot;text&quot; @click=&quot;open = false&quot;>Later</MButton>
      <MButton @click=&quot;open = false&quot;>View album</MButton>
    </div>
  </div>
</MDialog>`"
      :script="`const open = ref(false)`"
    >
      <MButton variant="tonal" @click="bareDialog = true">Open Bare Dialog</MButton>
      <MDialog v-model="bareDialog" bare max-width="360px" title="New album">
        <div class="flex h-36 items-end bg-linear-to-br from-primary to-tertiary p-4">
          <MIcon name="photo_library" :size="40" class="text-on-primary" />
        </div>
        <div class="p-6">
          <h2 class="text-headline-small text-on-surface">New album</h2>
          <p class="mt-2 text-body-medium text-on-surface-variant">12 photos from your trip are ready to share.</p>
          <div class="mt-6 flex justify-end gap-2">
            <MButton variant="text" @click="bareDialog = false">Later</MButton>
            <MButton @click="bareDialog = false">View album</MButton>
          </div>
        </div>
      </MDialog>
    </ComponentDemo>

    <ComponentDemo
      title="Stacked dialogs"
      description="A dialog that opens others on top of it: a date picker (MDatePickerModal, itself an MDialog) and a confirmation. Each stacks over the last with its own scrim and Escape closes the top one. They share one scroll lock: closing the ones on top keeps the page locked until the last dialog closes."
      :code="`<MDialog v-model=&quot;open&quot; title=&quot;Book a table&quot;>
  <MButton variant=&quot;outlined&quot; icon=&quot;event&quot; @click=&quot;picking = true&quot;>{{ dateLabel }}</MButton>
  <template #actions>
    <MButton variant=&quot;text&quot; @click=&quot;confirming = true&quot;>Discard</MButton>
    <MButton :disabled=&quot;!date&quot; @click=&quot;open = false&quot;>Book</MButton>
  </template>
</MDialog>

<!-- On top of it -->
<MDatePickerModal v-model=&quot;date&quot; v-model:show=&quot;picking&quot; />
<MDialog v-model=&quot;confirming&quot; title=&quot;Discard this booking?&quot; max-width=&quot;320px&quot; :closable=&quot;false&quot;>
  Your date won't be saved.
  <template #actions>
    <MButton variant=&quot;text&quot; @click=&quot;confirming = false&quot;>Keep editing</MButton>
    <MButton variant=&quot;text&quot; @click=&quot;confirming = false; open = false; date = null&quot;>Discard</MButton>
  </template>
</MDialog>`"
      :script="`const open = ref(false)
const date = ref(null)
const picking = ref(false)
const confirming = ref(false)`"
    >
      <MButton variant="tonal" @click="bookingOpen = true">Book a Table</MButton>
      <MDialog v-model="bookingOpen" title="Book a table" max-width="400px">
        <p class="mb-4">Choose a day for your reservation.</p>
        <MButton variant="outlined" icon="event" @click="bookingPicker = true">{{ bookingDateLabel() }}</MButton>
        <template #actions>
          <MButton variant="text" @click="bookingConfirm = true">Discard</MButton>
          <MButton :disabled="!bookingDate" @click="bookingOpen = false; toast.success('Table booked!')">Book</MButton>
        </template>
      </MDialog>
      <MDatePickerModal v-model="bookingDate" v-model:show="bookingPicker" />
      <MDialog v-model="bookingConfirm" title="Discard this booking?" max-width="320px" :closable="false">
        Your date won't be saved.
        <template #actions>
          <MButton variant="text" @click="bookingConfirm = false">Keep editing</MButton>
          <MButton variant="text" @click="bookingConfirm = false; bookingOpen = false; bookingDate = null">Discard</MButton>
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
