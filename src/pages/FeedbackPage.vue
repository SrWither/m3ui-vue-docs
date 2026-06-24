<script setup lang="ts">
import { ref } from 'vue'
import {
  MAlert, MDialog, MConfirmDialog, MTooltip, MProgressBar,
  MSpinner, MExpansionPanel, MButton, MIconButton, MCard, MSegmentedButton,
  MTextField, MSelect, MSwitch,
  useToast, useNotification,
} from '@m3ui-vue/m3ui-vue'
import type { ToastPosition, NotificationPosition } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const toast = useToast()
const notif = useNotification()

function demoToastLoading(result: 'success' | 'error') {
  const id = toast.loading('Uploading file...')
  setTimeout(() => {
    if (result === 'success') toast.update(id, { message: 'File uploaded!', variant: 'success', loading: false })
    else toast.update(id, { message: 'Upload failed', variant: 'error', loading: false })
  }, 2000)
}

function demoNotifLoading(result: 'success' | 'error') {
  const id = notif.loading('Saving changes...')
  setTimeout(() => {
    if (result === 'success') notif.update(id, { message: 'Changes saved!', variant: 'success', loading: false })
    else notif.update(id, { message: 'Save failed', variant: 'error', loading: false })
  }, 2000)
}

const alertVisible = ref(true)
const dialogOpen = ref(false)
const confirmOpen = ref(false)
const confirmDanger = ref(false)
const confirmLoading = ref(false)
const panel1 = ref(true)
const panel2 = ref(false)
const panel3 = ref(false)

function handleConfirm() {
  confirmLoading.value = true
  setTimeout(() => {
    confirmLoading.value = false
    confirmOpen.value = false
    toast.success('Action confirmed')
  }, 1500)
}

const alertProps: PropDef[] = [
  { name: 'type', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", description: 'Alert variant and color' },
  { name: 'title', type: 'string', description: 'Bold title text' },
  { name: 'closeable', type: 'boolean', default: 'false', description: 'Show close button' },
  { name: 'closeAriaLabel', type: 'string', default: "'Close'", description: 'Aria label for close button' },
]

const dialogProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state' },
  { name: 'title', type: 'string', description: 'Dialog title' },
  { name: 'maxWidth', type: 'string', default: "'max-w-md'", description: 'Tailwind max-width class' },
  { name: 'persistent', type: 'boolean', default: 'false', description: 'Prevent closing by clicking scrim or X' },
  { name: 'fullscreen', type: 'boolean', default: 'false', description: 'Full-screen variant — slides up, covers entire viewport' },
  { name: 'closeLabel', type: 'string', default: "'Close'", description: 'Label for close button' },
]

const fullscreenDialog = ref(false)
const fullscreenFormDialog = ref(false)
const formName = ref('')
const formEmail = ref('')
const formRole = ref('developer')
const formNotifications = ref(true)

const confirmProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state' },
  { name: 'title', type: 'string', description: 'Dialog title' },
  { name: 'message', type: 'string', description: 'Confirmation message body' },
  { name: 'confirmLabel', type: 'string', default: "'Confirm'", description: 'Confirm button label' },
  { name: 'cancelLabel', type: 'string', default: "'Cancel'", description: 'Cancel button label' },
  { name: 'danger', type: 'boolean', default: 'false', description: 'Error color for destructive actions' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show spinner on confirm button' },
]

const tooltipProps: PropDef[] = [
  { name: 'text', type: 'string', description: 'Tooltip text (plain) or title (rich)' },
  { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Tooltip position' },
  { name: 'delay', type: 'number', default: '600', description: 'Show delay in ms' },
  { name: 'rich', type: 'boolean', default: 'false', description: 'Rich tooltip with custom content and actions. Stays open when hovering the tooltip itself.' },
]

const progressVal = ref(50)
const progressWavy = ref(50)

const progressProps: PropDef[] = [
  { name: 'value', type: 'number', description: 'Progress 0–100 (omit for indeterminate)' },
  { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Indeterminate animation' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error'", default: "'primary'", description: 'Bar color' },
  { name: 'variant', type: "'linear' | 'wavy'", default: "'linear'", description: 'Bar style' },
  { name: 'label', type: 'string', description: 'Label text above the bar' },
]

const spinnerProps: PropDef[] = [
  { name: 'size', type: 'number', default: '20', description: 'Size in px' },
  { name: 'wavy', type: 'boolean', default: 'false', description: 'Wavy animation style' },
  { name: 'label', type: 'string', default: "'Loading'", description: 'Aria label for spinner' },
]

const panelProps: PropDef[] = [
  { name: 'title', type: 'string', description: 'Panel header text' },
  { name: 'subtitle', type: 'string', description: 'Secondary text in header' },
  { name: 'icon', type: 'string', description: 'Leading Material Symbol icon' },
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables toggling' },
  { name: 'variant', type: "'outlined' | 'filled' | 'elevated'", default: "'outlined'", description: 'Visual style' },
]

const toastProps: PropDef[] = [
  { name: 'success(msg, opts?)', type: 'function', description: 'Show a success toast' },
  { name: 'error(msg, opts?)', type: 'function', description: 'Show an error toast' },
  { name: 'warning(msg, opts?)', type: 'function', description: 'Show a warning toast' },
  { name: 'info(msg, opts?)', type: 'function', description: 'Show an info toast' },
  { name: 'loading(msg, opts?)', type: 'function', description: 'Show a toast with spinner (persists until update/dismiss)' },
  { name: 'update(id, patch)', type: 'function', description: 'Update a toast (message, variant, loading, etc.)' },
  { name: 'position', type: 'Ref<ToastPosition>', default: "'bottom-center'", description: 'Where toasts appear on screen' },
  { name: 'dismiss(id)', type: 'function', description: 'Dismiss a toast by id' },
]

const notificationProps: PropDef[] = [
  { name: 'success(msg, opts?)', type: 'function', description: 'Show a success notification' },
  { name: 'error(msg, opts?)', type: 'function', description: 'Show an error notification' },
  { name: 'warning(msg, opts?)', type: 'function', description: 'Show a warning notification' },
  { name: 'info(msg, opts?)', type: 'function', description: 'Show an info notification' },
  { name: 'loading(msg, opts?)', type: 'function', description: 'Show a notification with spinner (persists until update/dismiss)' },
  { name: 'update(id, patch)', type: 'function', description: 'Update a notification (message, variant, loading, etc.)' },
  { name: 'position', type: 'Ref<NotificationPosition>', default: "'top-right'", description: 'Where notifications appear on screen' },
  { name: 'dismiss(id)', type: 'function', description: 'Dismiss a notification by id' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Feedback</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Components for communicating status, progress, and confirmations to the user.
    </p>

    <!-- ── MAlert ───────────────────────────────────────────────────────── -->
    <h2 id="malert" class="mb-4 text-headline-small font-medium">MAlert</h2>

    <ComponentDemo
      title="Types"
      description="Four alert variants for different contexts."
      :code="`<template>
  <MAlert type=&quot;info&quot; title=&quot;Info&quot;>Informational message.</MAlert>
  <MAlert type=&quot;success&quot; title=&quot;Success&quot;>Operation completed.</MAlert>
  <MAlert type=&quot;warning&quot; title=&quot;Warning&quot;>Check your input.</MAlert>
  <MAlert type=&quot;error&quot; title=&quot;Error&quot;>Something went wrong.</MAlert>
</template>`"
    >
      <div class="w-full space-y-3">
        <MAlert type="info" title="Info">This is an informational message.</MAlert>
        <MAlert type="success" title="Success">Operation completed successfully.</MAlert>
        <MAlert type="warning" title="Warning">Please check your input.</MAlert>
        <MAlert type="error" title="Error">Something went wrong.</MAlert>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Closeable"
      description="Alerts with a dismiss button. Use v-if to toggle visibility and @close to handle dismissal."
      :code="`<MAlert
    v-if=&quot;visible&quot;
    type=&quot;info&quot;
    title=&quot;Heads up&quot;
    :closeable=&quot;true&quot;
    @close=&quot;visible = false&quot;
  >
    You can close this alert.
  </MAlert>
  <MButton v-else @click=&quot;visible = true&quot;>Show alert</MButton>`"
      :script="`const visible = ref(true)`"
    >
      <div class="w-full">
        <MAlert v-if="alertVisible" type="info" title="Heads up" :closeable="true" @close="alertVisible = false">
          Click the X to dismiss this alert, then use the button to bring it back.
        </MAlert>
        <MButton v-else variant="tonal" icon="visibility" @click="alertVisible = true">Show alert again</MButton>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="alertProps" />

    <!-- ── Toasts ───────────────────────────────────────────────────────── -->
    <h2 id="usetoast" class="mb-4 mt-14 text-headline-small font-medium">Toasts (useToast)</h2>

    <MAlert type="info" class="mb-6">
      <strong>Zero setup required.</strong> useToast() auto-mounts its renderer via <code>createApp</code> on first call.
      No need to add <code>&lt;MSnackbar /&gt;</code> or any component to your template — just import and use from script.
    </MAlert>

    <ComponentDemo
      title="Toast Notifications"
      description="Programmatic toast messages via useToast(). Just import and call."
      :code="`<script setup>
import { useToast } from '@m3ui-vue/m3ui-vue'

const toast = useToast()

toast.success('Saved successfully')
toast.error('Failed to save')
toast.warning('Low disk space')
toast.info('New update available')
<\/script>`"
    >
      <div class="flex flex-wrap gap-3">
        <MButton variant="tonal" icon="check_circle" @click="toast.success('Saved successfully')">Success</MButton>
        <MButton variant="tonal" icon="error" color="error" @click="toast.error('Failed to save')">Error</MButton>
        <MButton variant="tonal" icon="warning" @click="toast.warning('Low disk space')">Warning</MButton>
        <MButton variant="tonal" icon="info" @click="toast.info('New update available')">Info</MButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Toast Position"
      description="Control where toasts appear on screen via toast.position."
      :code="`<script setup>
import { useToast } from '@m3ui-vue/m3ui-vue'

const toast = useToast()
toast.position.value = 'top-right'
toast.success('Appears at top right')
<\/script>`"
    >
      <div class="flex w-full flex-col items-center gap-4">
        <MSegmentedButton
          :model-value="toast.position.value"
          :options="[
            { value: 'top-left', label: 'Top Left' },
            { value: 'top-center', label: 'Top Center' },
            { value: 'top-right', label: 'Top Right' },
          ]"
          density="compact"
          @update:model-value="(v: string | number | (string | number)[]) => toast.position.value = v as ToastPosition"
        />
        <MSegmentedButton
          :model-value="toast.position.value"
          :options="[
            { value: 'bottom-left', label: 'Bottom Left' },
            { value: 'bottom-center', label: 'Bottom Center' },
            { value: 'bottom-right', label: 'Bottom Right' },
          ]"
          density="compact"
          @update:model-value="(v: string | number | (string | number)[]) => toast.position.value = v as ToastPosition"
        />
        <MButton variant="tonal" icon="notifications" @click="toast.info(`Toast at ${toast.position.value}`)">
          Show toast
        </MButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Icon & Color"
      description="Override the default variant icon, or pass a custom background color for a fully branded toast."
      :code="`<script setup>
import { useToast } from '@m3ui-vue/m3ui-vue'

const toast = useToast()

// Custom icon with a standard variant
toast.success('Deployed!', { icon: 'rocket_launch' })

// Custom background color (text auto-switches to white)
toast.show('New follower!', 'info', { icon: 'person_add', color: '#6750A4' })
<\/script>`"
    >
      <div class="flex flex-wrap gap-3">
        <MButton variant="tonal" @click="toast.success('Deployed to production', { icon: 'rocket_launch' })">Custom Icon</MButton>
        <MButton variant="tonal" @click="toast.show('New follower!', 'info', { icon: 'person_add', color: '#6750A4' })">Purple</MButton>
        <MButton variant="tonal" @click="toast.show('Message sent', 'info', { icon: 'send', color: '#0891b2' })">Cyan</MButton>
        <MButton variant="tonal" @click="toast.show('Payment received', 'info', { icon: 'payments', color: '#16a34a' })">Green</MButton>
        <MButton variant="tonal" @click="toast.show('File deleted', 'info', { icon: 'delete_forever', color: '#dc2626' })">Red</MButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Loading State"
      description="Show a spinner while an async operation runs. Call loading() to start, then update() to finish with a result."
      :code="`<script setup>
import { useToast } from '@m3ui-vue/m3ui-vue'

const toast = useToast()

const id = toast.loading('Uploading...')
// after async work:
toast.update(id, { message: 'Uploaded!', variant: 'success' })
<\/script>`"
    >
      <div class="flex flex-wrap gap-3">
        <MButton variant="tonal" icon="cloud_upload" @click="demoToastLoading('success')">Loading → Success</MButton>
        <MButton variant="tonal" icon="cloud_off" color="error" @click="demoToastLoading('error')">Loading → Error</MButton>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Methods</h3>
    <PropsTable :props="toastProps" />

    <!-- ── Notifications ──────────────────────────────────────────────────── -->
    <h2 id="usenotification" class="mb-4 mt-14 text-headline-small font-medium">Notifications (useNotification)</h2>

    <MAlert type="info" class="mb-6">
      <strong>Zero setup required.</strong> useNotification() auto-mounts its renderer via <code>createApp</code> on first call.
      No need to add any component to your template — just import and use from script.
    </MAlert>

    <ComponentDemo
      title="Notifications"
      description="Compact, pill-shaped notifications. Shorter duration (3s) and smaller than toasts."
      :code="`<script setup>
import { useNotification } from '@m3ui-vue/m3ui-vue'

const notif = useNotification()

notif.success('File saved')
notif.error('Upload failed')
notif.warning('Disk almost full')
notif.info('2 new messages')
<\/script>`"
    >
      <div class="flex flex-wrap gap-3">
        <MButton variant="tonal" icon="check_circle" @click="notif.success('File saved')">Success</MButton>
        <MButton variant="tonal" icon="error" color="error" @click="notif.error('Upload failed')">Error</MButton>
        <MButton variant="tonal" icon="warning" @click="notif.warning('Disk almost full')">Warning</MButton>
        <MButton variant="tonal" icon="info" @click="notif.info('2 new messages')">Info</MButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Notification Position"
      description="Control where notifications appear. Default is top-right."
      :code="`<script setup>
import { useNotification } from '@m3ui-vue/m3ui-vue'

const notif = useNotification()
notif.position.value = 'top-left'
notif.info('Appears at top left')
<\/script>`"
    >
      <div class="flex w-full flex-col items-center gap-4">
        <MSegmentedButton
          :model-value="notif.position.value"
          :options="[
            { value: 'top-left', label: 'Top Left' },
            { value: 'top-center', label: 'Top Center' },
            { value: 'top-right', label: 'Top Right' },
          ]"
          density="compact"
          @update:model-value="(v: string | number | (string | number)[]) => notif.position.value = v as NotificationPosition"
        />
        <MSegmentedButton
          :model-value="notif.position.value"
          :options="[
            { value: 'bottom-left', label: 'Bottom Left' },
            { value: 'bottom-center', label: 'Bottom Center' },
            { value: 'bottom-right', label: 'Bottom Right' },
          ]"
          density="compact"
          @update:model-value="(v: string | number | (string | number)[]) => notif.position.value = v as NotificationPosition"
        />
        <MButton variant="tonal" icon="notifications" @click="notif.info(`Notification at ${notif.position.value}`)">
          Show notification
        </MButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Loading State"
      description="Same loading pattern as toasts — spinner while working, then update with result."
      :code="`<script setup>
import { useNotification } from '@m3ui-vue/m3ui-vue'

const notif = useNotification()

const id = notif.loading('Saving...')
// after async work:
notif.update(id, { message: 'Saved!', variant: 'success' })
<\/script>`"
    >
      <div class="flex flex-wrap gap-3">
        <MButton variant="tonal" icon="save" @click="demoNotifLoading('success')">Loading → Success</MButton>
        <MButton variant="tonal" icon="error" color="error" @click="demoNotifLoading('error')">Loading → Error</MButton>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Methods</h3>
    <PropsTable :props="notificationProps" />

    <!-- ── MDialog ──────────────────────────────────────────────────────── -->
    <h2 id="mdialog" class="mb-4 mt-14 text-headline-small font-medium">MDialog</h2>

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

    <!-- ── MConfirmDialog ───────────────────────────────────────────────── -->
    <h2 id="mconfirmdialog" class="mb-4 mt-14 text-headline-small font-medium">MConfirmDialog</h2>

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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="confirmProps" />

    <!-- ── MTooltip ─────────────────────────────────────────────────────── -->
    <h2 id="mtooltip" class="mb-4 mt-14 text-headline-small font-medium">MTooltip</h2>

    <ComponentDemo
      title="Placements"
      description="Tooltips can appear on any side of the trigger."
      :code="`<template>
  <MTooltip text=&quot;Top tooltip&quot; placement=&quot;top&quot;>
    <MButton variant=&quot;outlined&quot;>Top</MButton>
  </MTooltip>
</template>`"
    >
      <MTooltip text="Top tooltip" placement="top">
        <MButton variant="outlined">Top</MButton>
      </MTooltip>
      <MTooltip text="Bottom tooltip" placement="bottom">
        <MButton variant="outlined">Bottom</MButton>
      </MTooltip>
      <MTooltip text="Left tooltip" placement="left">
        <MButton variant="outlined">Left</MButton>
      </MTooltip>
      <MTooltip text="Right tooltip" placement="right">
        <MButton variant="outlined">Right</MButton>
      </MTooltip>
    </ComponentDemo>

    <ComponentDemo
      title="Rich Tooltip"
      description="Rich tooltips support custom content, a title, and action buttons. The tooltip stays open when you hover over it."
      :code="`<MTooltip text=&quot;Learn more&quot; rich>
  <template #default>
    <MButton variant=&quot;outlined&quot;>Hover me</MButton>
  </template>
  <template #content>
    Rich tooltips can contain detailed descriptions
    and even interactive elements.
  </template>
  <template #actions>
    <MButton variant=&quot;text&quot;>Action</MButton>
  </template>
</MTooltip>`"
    >
      <div class="flex flex-wrap gap-4">
        <MTooltip text="File details" rich placement="top">
          <MButton variant="outlined">Top</MButton>
          <template #content>
            This file was last modified on June 23, 2026. It contains 3 pages and weighs 2.4 MB.
          </template>
          <template #actions>
            <MButton variant="text">Open</MButton>
            <MButton variant="text">Share</MButton>
          </template>
        </MTooltip>

        <MTooltip text="Storage info" rich placement="bottom">
          <MButton variant="outlined">Bottom</MButton>
          <template #content>
            You are using 14.2 GB of 15 GB. Consider upgrading your plan for more storage.
          </template>
          <template #actions>
            <MButton variant="text">Upgrade</MButton>
          </template>
        </MTooltip>

        <MTooltip text="User profile" rich placement="left">
          <MButton variant="outlined">Left</MButton>
          <template #content>
            Fadel — Software Engineer. Last active 2 minutes ago.
          </template>
          <template #actions>
            <MButton variant="text">View profile</MButton>
          </template>
        </MTooltip>

        <MTooltip text="Notifications" rich placement="right">
          <MButton variant="outlined">Right</MButton>
          <template #content>
            You have 3 unread notifications and 1 pending invitation.
          </template>
          <template #actions>
            <MButton variant="text">View all</MButton>
            <MButton variant="text">Dismiss</MButton>
          </template>
        </MTooltip>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Rich Tooltip — Content only"
      description="Rich tooltip without title or actions — just detailed info the user can read at their own pace."
      :code="`<MTooltip rich>
  <MIconButton icon=&quot;help&quot; label=&quot;Help&quot; />
  <template #content>
    Click to open the help center with guides and FAQs.
  </template>
</MTooltip>`"
    >
      <div class="flex flex-wrap gap-4">
        <MTooltip rich placement="top">
          <MIconButton icon="help" label="Help" />
          <template #content>
            Click to open the help center with guides and FAQs.
          </template>
        </MTooltip>

        <MTooltip rich placement="bottom">
          <MIconButton icon="settings" label="Settings" />
          <template #content>
            Configure your account preferences, theme, and notification settings.
          </template>
        </MTooltip>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="tooltipProps" />

    <!-- ── MProgressBar ─────────────────────────────────────────────────── -->
    <h2 id="mprogressbar" class="mb-4 mt-14 text-headline-small font-medium">MProgressBar</h2>

    <ComponentDemo
      title="Progress Bars"
      description="Determinate, indeterminate, and wavy variants."
      :code="`<template>
  <MProgressBar :value=&quot;65&quot; label=&quot;Uploading...&quot; />
  <MProgressBar :indeterminate=&quot;true&quot; color=&quot;tertiary&quot; />
  <MProgressBar :value=&quot;80&quot; variant=&quot;wavy&quot; color=&quot;secondary&quot; />
</template>`"
    >
      <div class="w-full space-y-6">
        <MProgressBar :value="65" label="Uploading... 65%" />
        <MProgressBar :indeterminate="true" color="tertiary" label="Loading..." />
        <MProgressBar :value="80" variant="wavy" color="secondary" label="Processing..." />
        <div class="flex gap-4">
          <MProgressBar :value="30" color="error" />
          <MProgressBar :value="60" color="primary" />
          <MProgressBar :value="90" color="tertiary" />
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Interactive Progress"
      description="Use the buttons to increase or decrease the progress value."
      :code="`<MProgressBar :value=&quot;progress&quot; :label=&quot;\`\${progress}%\`&quot; />
<MButton @click=&quot;progress = Math.max(0, progress - 10)&quot;>- 10</MButton>
<MButton @click=&quot;progress = Math.min(100, progress + 10)&quot;>+ 10</MButton>`"
      :script="`import { MProgressBar, MButton } from '@m3ui-vue/m3ui-vue'

const progress = ref(50)`"
    >
      <div class="w-full space-y-6">
        <div>
          <p class="mb-2 text-label-large font-medium">Default</p>
          <MProgressBar :value="progressVal" :label="`${progressVal}%`" />
          <div class="mt-3 flex items-center gap-3">
            <MButton variant="tonal" icon="remove" @click="progressVal = Math.max(0, progressVal - 10)">- 10</MButton>
            <span class="w-12 text-center text-title-medium font-medium">{{ progressVal }}%</span>
            <MButton variant="tonal" icon="add" @click="progressVal = Math.min(100, progressVal + 10)">+ 10</MButton>
            <MButton variant="text" @click="progressVal = 0">Reset</MButton>
          </div>
        </div>
        <div>
          <p class="mb-2 text-label-large font-medium">Wavy</p>
          <MProgressBar :value="progressWavy" variant="wavy" color="secondary" :label="`${progressWavy}%`" />
          <div class="mt-3 flex items-center gap-3">
            <MButton variant="tonal" icon="remove" @click="progressWavy = Math.max(0, progressWavy - 10)">- 10</MButton>
            <span class="w-12 text-center text-title-medium font-medium">{{ progressWavy }}%</span>
            <MButton variant="tonal" icon="add" @click="progressWavy = Math.min(100, progressWavy + 10)">+ 10</MButton>
            <MButton variant="text" @click="progressWavy = 0">Reset</MButton>
          </div>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="progressProps" />

    <!-- ── MSpinner ─────────────────────────────────────────────────────── -->
    <h2 id="mspinner" class="mb-4 mt-14 text-headline-small font-medium">MSpinner</h2>

    <ComponentDemo
      title="Spinners"
      description="Standard and wavy loading spinners in different sizes."
      :code="`<template>
  <MSpinner :size=&quot;20&quot; />
  <MSpinner :size=&quot;32&quot; />
  <MSpinner :size=&quot;32&quot; :wavy=&quot;true&quot; />
</template>`"
      :script="`import { MSpinner } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-center gap-2">
          <MSpinner :size="20" />
          <span class="text-label-small text-on-surface-variant">20px</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MSpinner :size="32" />
          <span class="text-label-small text-on-surface-variant">32px</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MSpinner :size="48" />
          <span class="text-label-small text-on-surface-variant">48px</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MSpinner :size="32" :wavy="true" />
          <span class="text-label-small text-on-surface-variant">wavy</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MSpinner :size="48" :wavy="true" />
          <span class="text-label-small text-on-surface-variant">wavy 48</span>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="spinnerProps" />

    <!-- ── MExpansionPanel ──────────────────────────────────────────────── -->
    <h2 id="mexpansionpanel" class="mb-4 mt-14 text-headline-small font-medium">MExpansionPanel</h2>

    <ComponentDemo
      title="Expansion Panel"
      description="Collapsible sections with smooth animation."
      :code="`<MExpansionPanel v-model=&quot;open&quot; title=&quot;Section Title&quot; icon=&quot;settings&quot;>
    Content goes here.
  </MExpansionPanel>`"
      :script="`const open = ref(true)`"
    >
      <div class="w-full space-y-2">
        <MExpansionPanel v-model="panel1" title="General Settings" icon="settings" subtitle="App preferences">
          Configure your application preferences and default behavior here.
        </MExpansionPanel>
        <MExpansionPanel v-model="panel2" title="Notifications" icon="notifications">
          Manage which notifications you receive and how they are delivered.
        </MExpansionPanel>
        <MExpansionPanel v-model="panel3" title="Privacy" icon="lock">
          Control your privacy settings and data sharing preferences.
        </MExpansionPanel>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Variants"
      description="Outlined, filled, and elevated styles."
      :code="`<template>
  <MExpansionPanel title=&quot;Outlined&quot; variant=&quot;outlined&quot; />
  <MExpansionPanel title=&quot;Filled&quot; variant=&quot;filled&quot; />
  <MExpansionPanel title=&quot;Elevated&quot; variant=&quot;elevated&quot; />
</template>`"
    >
      <div class="w-full space-y-2">
        <MExpansionPanel title="Outlined" variant="outlined">Outlined content.</MExpansionPanel>
        <MExpansionPanel title="Filled" variant="filled">Filled content.</MExpansionPanel>
        <MExpansionPanel title="Elevated" variant="elevated">Elevated content.</MExpansionPanel>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Rich Content"
      description="Expansion panels can hold any complex content — forms, lists, cards, nested panels."
      :code="`<MExpansionPanel title=&quot;Account Details&quot; icon=&quot;person&quot;>
  <!-- any content here -->
</MExpansionPanel>`"
    >
      <div class="w-full space-y-2">
        <MExpansionPanel title="Account Details" icon="person" subtitle="Personal information and preferences" variant="outlined">
          <div class="flex flex-col gap-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-label-small text-on-surface-variant">Name</p>
                <p class="text-body-large text-on-surface">Fadel Chafworking</p>
              </div>
              <div>
                <p class="text-label-small text-on-surface-variant">Email</p>
                <p class="text-body-large text-on-surface">fadel@example.com</p>
              </div>
              <div>
                <p class="text-label-small text-on-surface-variant">Role</p>
                <p class="text-body-large text-on-surface">Administrator</p>
              </div>
              <div>
                <p class="text-label-small text-on-surface-variant">Joined</p>
                <p class="text-body-large text-on-surface">June 2024</p>
              </div>
            </div>
            <div class="flex gap-2">
              <MButton variant="tonal" icon="edit">Edit profile</MButton>
              <MButton variant="text" icon="logout" color="error">Sign out</MButton>
            </div>
          </div>
        </MExpansionPanel>

        <MExpansionPanel title="Billing History" icon="receipt_long" subtitle="Recent transactions" variant="filled">
          <div class="flex flex-col divide-y divide-outline-variant">
            <div v-for="(item, i) in [
              { date: 'Jun 15, 2026', desc: 'Pro Plan — Monthly', amount: '$12.00' },
              { date: 'May 15, 2026', desc: 'Pro Plan — Monthly', amount: '$12.00' },
              { date: 'Apr 15, 2026', desc: 'Pro Plan — Monthly', amount: '$12.00' },
              { date: 'Mar 10, 2026', desc: 'Storage Add-on', amount: '$4.00' },
            ]" :key="i" class="flex items-center justify-between py-3">
              <div>
                <p class="text-body-medium text-on-surface">{{ item.desc }}</p>
                <p class="text-body-small text-on-surface-variant">{{ item.date }}</p>
              </div>
              <p class="text-body-medium font-medium text-on-surface">{{ item.amount }}</p>
            </div>
          </div>
        </MExpansionPanel>

        <MExpansionPanel title="Danger Zone" icon="warning" subtitle="Irreversible actions" variant="elevated">
          <div class="flex flex-col gap-3">
            <p class="text-body-medium text-on-surface-variant">
              These actions are permanent and cannot be undone. Please proceed with caution.
            </p>
            <div class="flex gap-2">
              <MButton variant="tonal" color="error" icon="delete">Delete account</MButton>
              <MButton variant="text" color="error" icon="download">Export data</MButton>
            </div>
          </div>
        </MExpansionPanel>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="panelProps" />
  </div>
</template>
