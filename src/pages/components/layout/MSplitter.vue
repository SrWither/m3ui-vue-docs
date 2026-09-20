<script setup lang="ts">
import { MSplitter } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const splitterProps: PropDef[] = [
  { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Split direction' },
  { name: 'initialSplit', type: 'number', default: '50', description: 'Initial split percentage' },
  { name: 'min', type: 'number', default: '10', description: 'Minimum panel percentage' },
  { name: 'max', type: 'number', default: '90', description: 'Maximum panel percentage' },
]

const splitterSlots: SlotDef[] = [
  { name: '#first', description: 'Content for the first (left/top) panel' },
  { name: '#second', description: 'Content for the second (right/bottom) panel' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSplitter</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Two resizable panels divided by a draggable handle.
    </p>

    <ComponentDemo
      title="Horizontal Splitter"
      description="Drag the handle to resize two panels side by side."
      :code="`<template>
  <MSplitter :initial-split=&quot;40&quot;>
    <template #first>
      <div class=&quot;h-full bg-primary-container/20 p-4&quot;>Left panel</div>
    </template>
    <template #second>
      <div class=&quot;h-full bg-secondary-container/20 p-4&quot;>Right panel</div>
    </template>
  </MSplitter>
</template>`"
    >
      <div class="h-64 w-full overflow-hidden rounded-xl border border-outline-variant">
        <MSplitter :initial-split="40">
          <template #first>
            <div class="flex h-full items-center justify-center bg-primary-container/20 p-4 text-body-medium text-on-primary-container">
              Left panel
            </div>
          </template>
          <template #second>
            <div class="flex h-full items-center justify-center bg-secondary-container/20 p-4 text-body-medium text-on-secondary-container">
              Right panel
            </div>
          </template>
        </MSplitter>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Vertical Splitter"
      description="Top and bottom panels with vertical dragging."
      :code="`<template>
  <MSplitter direction=&quot;vertical&quot; :initial-split=&quot;60&quot;>
    <template #first>
      <div class=&quot;h-full bg-tertiary-container/20 p-4&quot;>Top panel</div>
    </template>
    <template #second>
      <div class=&quot;h-full bg-primary-container/20 p-4&quot;>Bottom panel</div>
    </template>
  </MSplitter>
</template>`"
    >
      <div class="h-64 w-full overflow-hidden rounded-xl border border-outline-variant">
        <MSplitter direction="vertical" :initial-split="60">
          <template #first>
            <div class="flex h-full items-center justify-center bg-tertiary-container/20 p-4 text-body-medium">
              Top panel
            </div>
          </template>
          <template #second>
            <div class="flex h-full items-center justify-center bg-primary-container/20 p-4 text-body-medium">
              Bottom panel
            </div>
          </template>
        </MSplitter>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="splitterProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="splitterSlots" />

    <ComponentPager current="MSplitter" />
  </div>
</template>
