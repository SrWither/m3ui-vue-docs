<script setup lang="ts">
import { ref } from 'vue'
import {
  MAlert, MDialog, MConfirmDialog, MTooltip, MProgressBar,
  MSpinner, MExpansionPanel, MButton, MIconButton, MCard, MSegmentedButton, useToast,
} from '@m3ui-vue/m3ui-vue'
import type { ToastPosition } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const toast = useToast()

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
]

const dialogProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state' },
  { name: 'title', type: 'string', description: 'Dialog title' },
  { name: 'maxWidth', type: 'string', default: "'max-w-md'", description: 'Tailwind max-width class' },
  { name: 'persistent', type: 'boolean', default: 'false', description: 'Prevent closing by clicking scrim' },
]

const confirmProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state' },
  { name: 'title', type: 'string', description: 'Dialog title' },
  { name: 'message', type: 'string', description: 'Confirmation message body' },
  { name: 'confirmLabel', type: 'string', default: "'Confirmar'", description: 'Confirm button label' },
  { name: 'cancelLabel', type: 'string', default: "'Cancelar'", description: 'Cancel button label' },
  { name: 'danger', type: 'boolean', default: 'false', description: 'Error color for destructive actions' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show spinner on confirm button' },
]

const tooltipProps: PropDef[] = [
  { name: 'text', type: 'string', description: 'Tooltip text content' },
  { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Tooltip position' },
  { name: 'delay', type: 'number', default: '600', description: 'Show delay in ms' },
]

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
  { name: 'success(msg)', type: 'function', description: 'Show a success toast' },
  { name: 'error(msg)', type: 'function', description: 'Show an error toast' },
  { name: 'warning(msg)', type: 'function', description: 'Show a warning toast' },
  { name: 'info(msg)', type: 'function', description: 'Show an info toast' },
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
    <h2 class="mb-4 mt-14 text-headline-small font-medium">Toasts (useToast)</h2>

    <ComponentDemo
      title="Toast Notifications"
      description="Programmatic toast messages via the useToast() composable."
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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Methods</h3>
    <PropsTable :props="toastProps" />

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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="panelProps" />
  </div>
</template>
