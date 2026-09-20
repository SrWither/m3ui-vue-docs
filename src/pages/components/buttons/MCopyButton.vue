<script setup lang="ts">
import { ref } from 'vue'
import { MCopyButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const copyButtonProps: PropDef[] = [
  { name: 'value', type: 'string', description: 'Text copied to the clipboard on click' },
  { name: 'icon', type: 'string', default: "'content_copy'", description: 'Icon shown in the idle state' },
  { name: 'copiedIcon', type: 'string', default: "'check'", description: 'Icon shown right after a successful copy' },
  { name: 'label', type: 'string', default: "'Copy'", description: 'aria-label in the idle state' },
  { name: 'copiedLabel', type: 'string', default: "'Copied'", description: 'aria-label right after a successful copy' },
  { name: 'variant', type: "'standard' | 'filled' | 'tonal' | 'outlined'", default: "'standard'", description: 'Visual style (same as MIconButton)' },
  { name: 'shape', type: "'rounded' | 'squared'", default: "'rounded'", description: 'Button shape' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'sm'", description: 'Button size' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button' },
  { name: 'resetDelay', type: 'number', default: '2000', description: 'Milliseconds before the icon reverts to idle after copying' },
]

const copyButtonEvents = [
  { name: 'copied', payload: 'string', description: 'Emitted with the copied value after a successful clipboard write' },
  { name: 'error', payload: 'unknown', description: 'Emitted if the browser refuses the clipboard write' },
]

const copyButtonLog = ref('')
function onCopyButtonCopied(value: string) { copyButtonLog.value = `@copied: "${value}"` }
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MCopyButton</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Wraps MIconButton and swaps to a checkmark for resetDelay ms after a successful copy.
    </p>

    <ComponentDemo
      title="Copy to clipboard"
      description="Emits copied with the copied value, or error if the browser refuses the clipboard write."
      :code="`<MCopyButton value=&quot;npm install @m3ui-vue/m3ui-vue&quot; label=&quot;Copy install command&quot; />
<MCopyButton value=&quot;npm install @m3ui-vue/m3ui-vue&quot; variant=&quot;tonal&quot; @copied=&quot;onCopied&quot; />`"
      :script="`function onCopied(value: string) {
  toast.success('Copied: ' + value)
}`"
    >
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 rounded-lg bg-surface-container-high px-3 py-2">
          <code class="text-body-medium text-on-surface-variant">npm install @m3ui-vue/m3ui-vue</code>
          <MCopyButton value="npm install @m3ui-vue/m3ui-vue" label="Copy install command" />
        </div>
        <MCopyButton value="npm install @m3ui-vue/m3ui-vue" variant="tonal" @copied="onCopyButtonCopied" />
        <span class="text-body-medium text-on-surface-variant">{{ copyButtonLog }}</span>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="copyButtonProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="copyButtonEvents" />

    <ComponentPager current="MCopyButton" />
  </div>
</template>
