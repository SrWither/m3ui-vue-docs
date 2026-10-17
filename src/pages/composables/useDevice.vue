<script setup lang="ts">
import { MCard, MIcon, useDevice } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const useDeviceTypes: TypeDef[] = [
  {
    name: 'UseDeviceReturn',
    description: 'The object returned by useDevice().',
    fields: [
      { name: 'isMobile', type: 'Ref<boolean>', required: true, description: 'true when window.innerWidth is below the 768px breakpoint' },
    ],
  },
]

const { isMobile } = useDevice()
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useDevice</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A composable that reactively tracks whether the viewport is mobile-sized, backed by a single shared
      window resize listener regardless of how many components call it.
    </p>

    <ComponentDemo
      title="Mobile Detection"
      description="Reactive composable that tracks whether the viewport is mobile-sized (< 768px)."
      :code="`<template>
  <p v-if=&quot;isMobile&quot;>You are on a mobile device</p>
  <p v-else>You are on a desktop device</p>
</template>`"
      :script="`import { useDevice } from '@m3ui-vue/m3ui-vue'

const { isMobile } = useDevice()`"
    >
      <div class="w-full">
        <MCard variant="outlined" class="flex items-center gap-3 p-4">
          <MIcon :name="isMobile ? 'phone_android' : 'desktop_windows'" :size="24" />
          <span class="text-body-large">
            Current viewport: <strong>{{ isMobile ? 'Mobile' : 'Desktop' }}</strong>
          </span>
        </MCard>
        <p class="mt-2 text-body-small text-on-surface-variant">
          Resize the browser window to see the value change (breakpoint: 768px).
        </p>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="useDeviceTypes" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Details</p>
      <ul class="list-inside list-disc space-y-1 text-body-medium text-on-surface-variant">
        <li>Breakpoint is fixed at <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">768px</code>, not currently configurable</li>
        <li>The resize listener is shared — only one is ever attached to <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">window</code> regardless of how many components call <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">useDevice()</code>, ref-counted internally</li>
        <li>The listener is automatically removed once the last consumer unmounts, and re-attached (with a fresh read) if a new consumer mounts afterward</li>
      </ul>
    </MCard>

    <ComponentPager current="useDevice" />
  </div>
</template>
