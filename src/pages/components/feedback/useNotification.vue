<script setup lang="ts">
import { MAlert, MButton, MSegmentedButton, useNotification } from '@m3ui-vue/m3ui-vue'
import type { NotificationPosition } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const notif = useNotification()

function demoNotifLoading(result: 'success' | 'error') {
  const id = notif.loading('Saving changes...')
  setTimeout(() => {
    if (result === 'success') notif.update(id, { message: 'Changes saved!', variant: 'success', loading: false })
    else notif.update(id, { message: 'Save failed', variant: 'error', loading: false })
  }, 2000)
}

const notificationApiTypes: TypeDef[] = [
  {
    name: 'useNotification()',
    description: 'Returned object — a module-level singleton, so every call site shares the same notification queue and position',
    fields: [
      { name: 'success', type: '(message: string, options?: NotificationOptions) => number', description: "Show a success notification, returns the notification's id" },
      { name: 'error', type: '(message: string, options?: NotificationOptions) => number', description: 'Show an error notification' },
      { name: 'warning', type: '(message: string, options?: NotificationOptions) => number', description: 'Show a warning notification' },
      { name: 'info', type: '(message: string, options?: NotificationOptions) => number', description: 'Show an info notification' },
      { name: 'show', type: "(message: string, variant?: NotificationVariant, options?: NotificationOptions) => number", description: 'The primitive every variant helper calls — lets you pass a custom icon/action directly' },
      { name: 'loading', type: '(message: string, options?: Omit<NotificationOptions, "loading">) => number', description: 'Show a persistent notification with a spinner (closable: false by default, unlike toasts)' },
      { name: 'update', type: '(id: number, patch: Partial<Omit<Notification, "id">>) => void', description: 'Patch an existing notification in place — e.g. flip loading off and swap the variant/message once an async action resolves' },
      { name: 'dismiss', type: '(id: number) => void', description: 'Dismiss a notification immediately' },
      { name: 'position', type: 'Ref<NotificationPosition>', description: "Where notifications stack — assign directly, e.g. notif.position.value = 'top-left'" },
      { name: 'notifications', type: 'Ref<Notification[]>', description: 'The live queue backing the auto-mounted renderer — read-only in practice' },
    ],
  },
  {
    name: 'NotificationOptions',
    fields: [
      { name: 'duration', type: 'number', default: '3000', description: 'Auto-dismiss delay in ms (0 = persistent)' },
      { name: 'loading', type: 'boolean', description: 'Shows a spinner instead of the variant icon; set via loading() normally' },
      { name: 'icon', type: 'string | null', description: 'Override the variant icon; null suppresses the icon entirely' },
      { name: 'closable', type: 'boolean', default: 'true', description: 'Shows the header close button (false hides it — loading() defaults this to false)' },
      { name: 'action', type: '{ label: string; onClick: () => void }', description: 'An inline action button' },
    ],
  },
  {
    name: 'NotificationPosition',
    description: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
    fields: [],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useNotification</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Programmatic, imperative notifications — compact, squared-corner messages distinct from useToast's
      pill-shaped snackbars, call it from anywhere in script, no component to mount.
    </p>

    <MAlert type="info" class="mb-6">
      <strong>Zero setup required.</strong> useNotification() auto-mounts its renderer via <code>createApp</code> on first call.
      No need to add any component to your template — just import and use from script.
    </MAlert>

    <ComponentDemo
      title="Notifications"
      description="Compact notifications with squared corners. Supports actions, close button, and auto-dismiss."
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

    <ComponentDemo
      title="With Actions"
      description="Add an action button to the notification. The close button is shown by default (closable: true) and can be hidden."
      :code="`<script setup>
import { useNotification } from '@m3ui-vue/m3ui-vue'

const notif = useNotification()

notif.info('File deleted', {
  action: { label: 'Undo', onClick: () => restore() },
})

// No close button
notif.warning('Update available', {
  closable: false,
  action: { label: 'Install', onClick: () => install() },
})
<\/script>`"
    >
      <div class="flex flex-wrap gap-3">
        <MButton variant="tonal" icon="delete" @click="notif.info('File deleted', { action: { label: 'Undo', onClick: () => notif.success('Restored!') }, duration: 5000 })">With Undo</MButton>
        <MButton variant="tonal" icon="system_update" @click="notif.warning('Update available', { closable: false, action: { label: 'Install', onClick: () => notif.success('Installing...') }, duration: 6000 })">No close button</MButton>
        <MButton variant="tonal" icon="wifi_off" color="error" @click="notif.error('Connection lost', { action: { label: 'Retry', onClick: () => notif.info('Reconnecting...') }, duration: 0 })">Persistent + action</MButton>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="notificationApiTypes" />

    <ComponentPager current="useNotification" />
  </div>
</template>
