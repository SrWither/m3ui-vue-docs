<script setup lang="ts">
import { ref } from 'vue'
import { MLoadingOverlay, MButton, MCard } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const loadingOverlayProps: PropDef[] = [
  { name: 'visible', type: 'boolean', description: 'Show/hide the overlay' },
  { name: 'text', type: 'string', description: 'Loading text message shown below the spinner' },
  { name: 'fullscreen', type: 'boolean', default: 'false', description: 'Cover the entire viewport via Teleport, instead of overlaying just the #content slot' },
  { name: 'opaque', type: 'boolean', default: 'false', description: 'Solid surface background instead of a translucent, blurred one' },
  { name: 'spinnerSize', type: 'number', default: '40', description: 'Spinner size in px' },
]

const loadingOverlaySlots: SlotDef[] = [
  { name: 'content', description: 'The content the overlay is layered on top of (only used when fullscreen is false)' },
  { name: 'default', description: 'Extra content shown below the spinner/text, in either mode' },
]

const loadingInline = ref(false)
const loadingSizes = ref(false)
const loadingText = ref(false)
const loadingFullscreen = ref(false)
const loadingOpaque = ref(false)
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MLoadingOverlay</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A spinner-and-text overlay, either layered on top of a piece of content via the
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">#content</code> slot, or
      covering the whole viewport with <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">fullscreen</code>.
    </p>

    <ComponentDemo
      title="Inline Overlay on a Card"
      description="Wrap content in the #content slot to overlay a loading state on top of it."
      :code="`<script setup>
const loading = ref(false)
<\/script>

<template>
  <MButton @click=&quot;loading = !loading&quot;>Toggle Loading</MButton>
  <MLoadingOverlay :visible=&quot;loading&quot; text=&quot;Loading...&quot;>
    <template #content>
      <MCard class=&quot;p-6&quot;>
        <p>Content underneath the overlay.</p>
      </MCard>
    </template>
  </MLoadingOverlay>
</template>`"
    >
      <div class="w-full space-y-4">
        <MButton variant="tonal" @click="loadingInline = !loadingInline">
          {{ loadingInline ? 'Stop Loading' : 'Start Loading' }}
        </MButton>
        <MLoadingOverlay :visible="loadingInline" text="Loading...">
          <template #content>
            <MCard class="p-6">
              <p class="text-body-medium text-on-surface-variant">
                This card has an inline loading overlay. Toggle the button above to see it in action.
              </p>
            </MCard>
          </template>
        </MLoadingOverlay>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Spinner Sizes"
      description="Use spinnerSize to control the loading indicator size."
      :code="`<template>
  <MLoadingOverlay :visible=&quot;true&quot; :spinner-size=&quot;24&quot;>
    <template #content>
      <MCard class=&quot;p-6&quot;>Small spinner</MCard>
    </template>
  </MLoadingOverlay>
  <MLoadingOverlay :visible=&quot;true&quot; :spinner-size=&quot;60&quot;>
    <template #content>
      <MCard class=&quot;p-6&quot;>Large spinner</MCard>
    </template>
  </MLoadingOverlay>
</template>`"
    >
      <div class="flex w-full gap-4">
        <div class="flex-1">
          <MButton variant="tonal" class="mb-3" @click="loadingSizes = !loadingSizes">
            {{ loadingSizes ? 'Hide' : 'Show' }} Spinners
          </MButton>
        </div>
      </div>
      <div class="flex w-full gap-4">
        <MLoadingOverlay :visible="loadingSizes" :spinner-size="24">
          <template #content>
            <MCard class="flex-1 p-6">
              <p class="text-body-medium text-on-surface-variant">Small spinner (24px)</p>
            </MCard>
          </template>
        </MLoadingOverlay>
        <MLoadingOverlay :visible="loadingSizes" :spinner-size="60">
          <template #content>
            <MCard class="flex-1 p-6">
              <p class="text-body-medium text-on-surface-variant">Large spinner (60px)</p>
            </MCard>
          </template>
        </MLoadingOverlay>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="With Text"
      description="Display a message below the spinner to inform the user."
      :code="`<script setup>
const loading = ref(false)
<\/script>

<template>
  <MLoadingOverlay :visible=&quot;loading&quot; text=&quot;Saving your changes...&quot;>
    <template #content>
      <MCard class=&quot;p-6&quot;>
        <p>Card content here.</p>
      </MCard>
    </template>
  </MLoadingOverlay>
</template>`"
    >
      <div class="w-full space-y-4">
        <MButton variant="tonal" @click="loadingText = !loadingText">
          {{ loadingText ? 'Stop' : 'Start' }} Loading
        </MButton>
        <MLoadingOverlay :visible="loadingText" text="Saving your changes...">
          <template #content>
            <MCard class="p-6">
              <p class="text-body-medium text-on-surface-variant">
                This card shows a loading overlay with a descriptive text message.
              </p>
            </MCard>
          </template>
        </MLoadingOverlay>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Opaque Background"
      description="By default the overlay is a translucent, blurred surface. Set opaque to use a solid background instead."
      :code="`<MLoadingOverlay :visible=&quot;true&quot; :opaque=&quot;true&quot; text=&quot;Loading...&quot;>
  <template #content>
    <MCard class=&quot;p-6&quot;>Content stays fully hidden underneath.</MCard>
  </template>
</MLoadingOverlay>`"
    >
      <div class="w-full space-y-4">
        <MButton variant="tonal" @click="loadingOpaque = !loadingOpaque">
          {{ loadingOpaque ? 'Stop' : 'Start' }} Loading (opaque)
        </MButton>
        <MLoadingOverlay :visible="loadingOpaque" text="Loading..." :opaque="true">
          <template #content>
            <MCard class="p-6">
              <p class="text-body-medium text-on-surface-variant">
                With opaque, the overlay is a solid bg-surface instead of a translucent blur —
                content underneath is fully hidden, not just dimmed.
              </p>
            </MCard>
          </template>
        </MLoadingOverlay>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Fullscreen"
      description="With fullscreen, the overlay Teleports to <body> and covers the entire viewport instead of just the #content slot — useful for a global app-level loading state."
      :code="`<script setup>
const loading = ref(false)
<\/script>

<template>
  <MButton @click=&quot;loading = true&quot;>Show Fullscreen Loader</MButton>
  <MLoadingOverlay :visible=&quot;loading&quot; :fullscreen=&quot;true&quot; text=&quot;Loading application...&quot; />
</template>`"
    >
      <MButton variant="tonal" @click="loadingFullscreen = true">Show Fullscreen Loader (2s)</MButton>
      <MLoadingOverlay :visible="loadingFullscreen" :fullscreen="true" text="Loading application...">
        <MButton
          variant="text"
          class="mt-2"
          @click.stop="loadingFullscreen = false"
        >
          Dismiss
        </MButton>
      </MLoadingOverlay>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="loadingOverlayProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="loadingOverlaySlots" />

    <ComponentPager current="MLoadingOverlay" />
  </div>
</template>
