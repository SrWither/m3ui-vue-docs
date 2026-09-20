<script setup lang="ts">
import { ref } from 'vue'
import { MPagination } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const paginationProps: PropDef[] = [
  { name: 'page', type: 'number', description: 'Current page (1-based)' },
  { name: 'perPage', type: 'number', description: 'Items per page' },
  { name: 'total', type: 'number', description: 'Total number of items' },
]

const paginationEvents = [
  { name: 'update:page', payload: 'number', description: 'Emitted when the previous/next button is clicked — drive page with it for v-model-style two-way binding' },
]

const page = ref(1)
const smallPage = ref(1)
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MPagination</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Simple previous/next page navigation with an automatically computed page range label.
    </p>

    <ComponentDemo
      title="Pagination"
      description="Page navigation with automatic page range calculation."
      :code="`<MPagination :page=&quot;page&quot; :per-page=&quot;10&quot; :total=&quot;87&quot; @update:page=&quot;page = $event&quot; />`"
      :script="`const page = ref(1)`"
    >
      <div class="flex w-full flex-col items-center gap-4">
        <MPagination :page="page" :per-page="10" :total="87" @update:page="page = $event" />
        <span class="text-body-medium text-on-surface-variant">
          Page {{ page }} of {{ Math.ceil(87 / 10) }} — showing items {{ (page - 1) * 10 + 1 }}–{{ Math.min(page * 10, 87) }} of 87
        </span>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Small Total"
      description="With a total smaller than perPage, there's only one page and both buttons stay disabled."
      :code="`<MPagination :page=&quot;page&quot; :per-page=&quot;10&quot; :total=&quot;4&quot; @update:page=&quot;page = $event&quot; />`"
    >
      <MPagination :page="smallPage" :per-page="10" :total="4" @update:page="smallPage = $event" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="paginationProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="paginationEvents" />

    <ComponentPager current="MPagination" />
  </div>
</template>
