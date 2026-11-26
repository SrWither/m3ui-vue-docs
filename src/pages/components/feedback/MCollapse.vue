<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MCollapse } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const more = ref(false)
const log = ref<string[]>([])

const collapseProps: PropDef[] = [
  { name: 'open', type: 'boolean', description: 'Shown or not. Required.' },
  { name: 'unmountOnClose', type: 'boolean', default: 'false', description: 'Unmount the content once closed (and mount it again on open); by default it stays, keeping its state.' },
  { name: 'duration', type: 'number', default: '300', description: 'The animation\'s length in ms (M3\'s emphasized curve). With reduced motion it switches at once.' },
]
const collapseEvents: EventDef[] = [
  { name: 'after-open', payload: '—', description: 'The open animation finished.' },
  { name: 'after-close', payload: '—', description: 'The close animation finished (after it the content unmounts with unmountOnClose).' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MCollapse</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Shows and hides its content with a height animation to the content's exact size, nothing to measure. While closed
      the content is inert: no Tab stop inside it, hidden from screen readers. It's what
      <RouterLink to="/components/feedback/mexpansionpanel" class="text-primary underline">MExpansionPanel</RouterLink>
      opens with; use it for any "show more" of your own.
    </p>

    <ComponentDemo
      title="Show more"
      description="A button of your own toggles it; the log shows after-open and after-close as each animation ends."
      :code="`<MButton variant=&quot;text&quot; :icon=&quot;more ? 'expand_less' : 'expand_more'&quot; @click=&quot;more = !more&quot;>{{ more ? 'Less' : 'More' }}</MButton>
<MCollapse :open=&quot;more&quot; @after-open=&quot;…&quot; @after-close=&quot;…&quot;>
  <p>…</p>
</MCollapse>`"
      :script="`import { MCollapse } from '@m3ui-vue/m3ui-vue'

const more = ref(false)`"
    >
      <div class="flex w-full max-w-lg flex-col gap-2">
        <p class="text-body-medium">Concrete slab poured on Monday; curing for seven days before the next floor.</p>
        <MCollapse :open="more" @after-open="log.unshift('after-open')" @after-close="log.unshift('after-close')">
          <div class="flex flex-col gap-2 pb-2 text-body-medium text-on-surface-variant">
            <p>Formwork comes off on day seven. The pump truck is booked for the 4th; the scaffolding check is on the 2nd.</p>
            <p>Windows arrive the week after. <a href="#" class="text-primary underline" @click.prevent>The order</a> is linked here (no Tab stop while closed).</p>
          </div>
        </MCollapse>
        <MButton variant="text" :icon="more ? 'expand_less' : 'expand_more'" class="self-start" @click="more = !more">{{ more ? 'Less' : 'More' }}</MButton>
        <p class="font-mono text-body-small text-on-surface-variant">{{ log.slice(0, 3).join(' · ') || 'events show here' }}</p>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="collapseProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="collapseEvents" />

    <ComponentPager current="MCollapse" />
  </div>
</template>
