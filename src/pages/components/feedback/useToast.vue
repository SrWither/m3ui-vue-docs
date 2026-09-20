<script setup lang="ts">
import { MAlert, MButton, MSegmentedButton, useToast } from '@m3ui-vue/m3ui-vue'
import type { ToastPosition } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const toast = useToast()

function demoToastLoading(result: 'success' | 'error') {
  const id = toast.loading('Uploading file...')
  setTimeout(() => {
    if (result === 'success') toast.update(id, { message: 'File uploaded!', variant: 'success', loading: false })
    else toast.update(id, { message: 'Upload failed', variant: 'error', loading: false })
  }, 2000)
}

const toastApiTypes: TypeDef[] = [
  {
    name: 'useToast()',
    description: 'Returned object — a module-level singleton, so every call site shares the same toast queue and position',
    fields: [
      { name: 'success', type: '(message: string, options?: ToastOptions) => number', description: "Show a success toast, returns the toast's id" },
      { name: 'error', type: '(message: string, options?: ToastOptions) => number', description: 'Show an error toast (6s default duration instead of 4s)' },
      { name: 'warning', type: '(message: string, options?: ToastOptions) => number', description: 'Show a warning toast' },
      { name: 'info', type: '(message: string, options?: ToastOptions) => number', description: 'Show an info toast' },
      { name: 'show', type: "(message: string, variant?: ToastVariant, options?: number | ToastOptions) => number", description: "The primitive every variant helper calls — lets you pass a custom color/icon. A number for options is shorthand for { duration }" },
      { name: 'loading', type: '(message: string, options?: Omit<ToastOptions, "loading">) => number', description: 'Show a persistent toast with a spinner (duration ignored until updated)' },
      { name: 'update', type: '(id: number, patch: Partial<Omit<Toast, "id">>) => void', description: 'Patch an existing toast in place — e.g. flip loading off and swap the variant/message once an async action resolves' },
      { name: 'dismiss', type: '(id: number) => void', description: 'Dismiss a toast immediately' },
      { name: 'position', type: 'Ref<ToastPosition>', description: "Where toasts stack — assign directly, e.g. toast.position.value = 'top-right'" },
      { name: 'toasts', type: 'Ref<Toast[]>', description: 'The live queue backing the auto-mounted renderer — read-only in practice' },
    ],
  },
  {
    name: 'ToastOptions',
    fields: [
      { name: 'duration', type: 'number', description: 'Auto-dismiss delay in ms (default 4000, 6000 for error, 0 = persistent)' },
      { name: 'loading', type: 'boolean', description: 'Shows a spinner instead of the variant icon; set via loading() normally' },
      { name: 'action', type: '{ label: string; onClick: () => void }', description: 'An inline action button' },
      { name: 'icon', type: 'string | null', description: 'Override the variant icon; null suppresses the icon entirely' },
      { name: 'color', type: 'string', description: 'Custom background color (any CSS color) — text switches to white automatically' },
    ],
  },
  {
    name: 'ToastPosition',
    description: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
    fields: [],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useToast</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Programmatic, imperative toast messages — call it from anywhere in script, no component to mount.
    </p>

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

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="toastApiTypes" />

    <ComponentPager current="useToast" />
  </div>
</template>
