<script setup lang="ts">
import { ref } from 'vue'
import { MOverlay, MButton, MCenter, MCard, MText, MSubtitle } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const overlayProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', default: 'true', description: 'Controls visibility (v-model)' },
  { name: 'scrim', type: 'boolean', default: 'true', description: 'Show dark backdrop' },
  { name: 'zIndex', type: 'number', default: '50', description: 'Z-index value' },
]

const overlayEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Emitted with false when the scrim is clicked, for v-model support' },
]

const showOverlay = ref(false)
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MOverlay</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Full-screen overlay with scrim and teleport to body. A generic low-level building block — content is entirely
      up to you via the default slot.
    </p>

    <ComponentDemo
      title="Overlay"
      description="Full-screen overlay with scrim and teleport to body."
      :code="`<template>
  <MButton @click=&quot;show = true&quot;>Show Overlay</MButton>
  <MOverlay v-model=&quot;show&quot;>
    <MCenter class=&quot;h-full&quot;>
      <MCard class=&quot;p-6&quot;>
        <MText variant=&quot;title-medium&quot;>Overlay content</MText>
        <MButton class=&quot;mt-4&quot; @click=&quot;show = false&quot;>Close</MButton>
      </MCard>
    </MCenter>
  </MOverlay>
</template>`"
      :script="`import { ref } from 'vue'
import { MOverlay, MButton, MCenter, MCard, MText } from '@m3ui-vue/m3ui-vue'

const show = ref(false)`"
    >
      <MButton @click="showOverlay = true">Show Overlay</MButton>
      <MOverlay v-model="showOverlay">
        <MCenter class="h-full">
          <MCard class="p-6">
            <MText variant="title-medium" weight="medium">Overlay Content</MText>
            <MSubtitle size="medium" class="mt-1">Click the scrim or button to close.</MSubtitle>
            <MButton class="mt-4" @click="showOverlay = false">Close</MButton>
          </MCard>
        </MCenter>
      </MOverlay>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="overlayProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="overlayEvents" />

    <ComponentPager current="MOverlay" />
  </div>
</template>
