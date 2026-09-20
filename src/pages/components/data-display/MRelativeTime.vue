<script setup lang="ts">
import { ref } from 'vue'
import { MRelativeTime } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const relativeTimeProps: PropDef[] = [
  { name: 'value', type: 'string | number | Date', description: 'The timestamp to format (ISO string, epoch ms, or a Date) — required' },
  { name: 'locale', type: 'string', description: "BCP-47 locale tag (e.g. 'es-ES'). Defaults to the app's locale (from createM3UI/useLocale), then the browser's locale" },
]

const relTimePast = ref(new Date(Date.now() - 5 * 60_000))
const relTimeFuture = ref(new Date(Date.now() + 2 * 3_600_000))
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MRelativeTime</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Renders a timestamp as human-readable relative text ("5 minutes ago", "in 2 hours") that keeps
      itself up to date, formatted with the native Intl.RelativeTimeFormat.
    </p>

    <ComponentDemo
      title="Auto-updating relative time"
      description="Renders as a semantic <time> element. Formatting comes from the native Intl.RelativeTimeFormat — fully localized with no locale-file changes needed — and it re-renders itself at a cadence that matches how recent the value is (every second near 'now', backing off to hourly once it's days old)."
      :code="`<MRelativeTime :value=&quot;comment.createdAt&quot; />
<MRelativeTime :value=&quot;event.startsAt&quot; locale=&quot;es-ES&quot; />`"
      :script="`const comment = { createdAt: new Date(Date.now() - 5 * 60_000) } // 5 minutes ago
const event = { startsAt: new Date(Date.now() + 2 * 3_600_000) } // in 2 hours`"
    >
      <div class="flex flex-wrap items-center gap-6 text-body-medium">
        <span>Posted <MRelativeTime :value="relTimePast" class="font-medium text-primary" /></span>
        <span>Starts <MRelativeTime :value="relTimeFuture" class="font-medium text-primary" /></span>
        <span>En español: <MRelativeTime :value="relTimePast" locale="es-ES" class="font-medium text-primary" /></span>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="relativeTimeProps" />

    <ComponentPager current="MRelativeTime" />
  </div>
</template>
