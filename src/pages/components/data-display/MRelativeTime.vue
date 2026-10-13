<script setup lang="ts">
import { ref } from 'vue'
import { MRelativeTime, MButton, MAvatar, MCard } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const relativeTimeProps: PropDef[] = [
  { name: 'value', type: 'string | number | Date', description: 'Required. The timestamp to format: an ISO string, epoch milliseconds, or a Date' },
  { name: 'locale', type: 'string', description: "BCP-47 locale tag (e.g. 'es-ES'). Defaults to the app's locale (from createM3UI/useLocale), then the browser's locale" },
]

const MIN = 60_000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

const relTimePast = ref(new Date(Date.now() - 5 * MIN))
const relTimeFuture = ref(new Date(Date.now() + 2 * HOUR))

// Live feed
const authors = ['Ana Torres', 'Luis Gómez', 'Marta Ruiz', 'Diego Pérez']
const messages = ['Shipped the new build 🚀', 'Can someone review my PR?', 'Lunch at 1?', 'Docs are updated', 'Fixed the flaky test']
let postSeq = 0
const feed = ref([
  { id: -1, author: 'Sofía Lima', text: 'Morning everyone!', at: new Date(Date.now() - 3 * HOUR) },
  { id: -2, author: 'Pablo Ortiz', text: 'Standup notes are in the doc', at: new Date(Date.now() - DAY - 2 * HOUR) },
])
function post() {
  const i = postSeq++
  feed.value = [
    { id: i, author: authors[i % authors.length]!, text: messages[i % messages.length]!, at: new Date() },
    ...feed.value,
  ]
}

// Countdown crossing "now"
const launchAt = ref(new Date(Date.now() + 15_000))
function restartCountdown() {
  launchAt.value = new Date(Date.now() + 15_000)
}

// Unit scale. Future offsets get an extra hour so they don't slip under the unit
// boundary as "now" advances (+24h would soon read "in 24 hours" instead of "tomorrow").
const scale = [
  { label: '-2 years', offset: -2 * 365 * DAY },
  { label: '-3 months', offset: -91 * DAY },
  { label: '-1 week', offset: -7 * DAY },
  { label: '-1 day', offset: -DAY },
  { label: '-3 hours', offset: -3 * HOUR },
  { label: '-10 minutes', offset: -10 * MIN },
  { label: '-20 seconds', offset: -20_000 },
  { label: '+1 day', offset: DAY + HOUR },
  { label: '+1 week', offset: 7 * DAY + HOUR },
  { label: '+1 month', offset: 31 * DAY },
  { label: '+1 year', offset: 366 * DAY },
].map((s) => ({ ...s, value: new Date(Date.now() + s.offset) }))

// Locales
const locales = [
  { tag: 'en-US', name: 'English' },
  { tag: 'es-ES', name: 'Español' },
  { tag: 'fr-FR', name: 'Français' },
  { tag: 'de-DE', name: 'Deutsch' },
  { tag: 'pt-BR', name: 'Português' },
  { tag: 'ja-JP', name: '日本語' },
  { tag: 'ko-KR', name: '한국어' },
  { tag: 'ar-EG', name: 'العربية' },
]
const localeSamples = [new Date(Date.now() - 5 * MIN), new Date(Date.now() - DAY), new Date(Date.now() + 3 * DAY + HOUR)]

// Input formats
const isoValue = new Date(Date.now() - 2 * HOUR).toISOString()
const epochValue = Date.now() - 45 * MIN
const dateValue = new Date(Date.now() - 4 * DAY)
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MRelativeTime</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Renders a timestamp as human-readable relative text ("5 minutes ago", "in 2 hours") that keeps
      itself up to date, formatted with the native Intl.RelativeTimeFormat. It renders a semantic
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">&lt;time&gt;</code> element,
      and hovering it shows the full absolute date.
    </p>

    <ComponentDemo
      title="Auto-updating relative time"
      description="Formatting comes from the native Intl.RelativeTimeFormat, so every language works with no locale files. It re-renders at a pace that matches how recent the value is: every second near 'now', backing off to hourly once it's days old."
      :code="`<MRelativeTime :value=&quot;comment.createdAt&quot; />
<MRelativeTime :value=&quot;event.startsAt&quot; locale=&quot;es-ES&quot; />`"
      :script="`const comment = { createdAt: new Date(Date.now() - 5 * 60_000) } // 5 minutes ago
const event = { startsAt: new Date(Date.now() + 2 * 3_600_000) } // in 2 hours`"
    >
      <div class="flex flex-wrap items-center gap-6 text-body-medium">
        <span>Posted <MRelativeTime :value="relTimePast" class="font-medium text-primary" /></span>
        <span>Starts <MRelativeTime :value="relTimeFuture" class="font-medium text-primary" /></span>
        <span>In Spanish: <MRelativeTime :value="relTimePast" locale="es-ES" class="font-medium text-primary" /></span>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Live feed"
      description="Post a few messages and leave them there: each timestamp starts at 'now' and keeps counting up by itself, with no timer in your code. Hover a time to see the exact date."
      :code="`<li v-for=&quot;msg in feed&quot; :key=&quot;msg.id&quot; class=&quot;flex gap-3&quot;>
  <MAvatar :name=&quot;msg.author&quot; :size=&quot;36&quot; />
  <div>
    <span class=&quot;text-title-small&quot;>{{ msg.author }}</span>
    <MRelativeTime :value=&quot;msg.at&quot; class=&quot;text-body-small text-on-surface-variant&quot; />
    <p class=&quot;text-body-medium&quot;>{{ msg.text }}</p>
  </div>
</li>`"
      :script="`function post(text) {
  feed.value.unshift({ id: crypto.randomUUID(), author: me, text, at: new Date() })
}`"
    >
      <div class="flex w-full max-w-md flex-col gap-3">
        <MButton variant="tonal" icon="send" class="self-start" @click="post">Post a message</MButton>
        <MCard variant="outlined" class="overflow-hidden">
          <TransitionGroup tag="ul" name="feed" class="divide-y divide-outline-variant">
            <li v-for="msg in feed" :key="msg.id" class="flex gap-3 px-4 py-3">
              <MAvatar :name="msg.author" :size="36" />
              <div class="min-w-0 flex-1">
                <div class="flex items-baseline gap-2">
                  <span class="text-title-small text-on-surface">{{ msg.author }}</span>
                  <MRelativeTime :value="msg.at" class="text-body-small text-on-surface-variant" />
                </div>
                <p class="text-body-medium text-on-surface">{{ msg.text }}</p>
              </div>
            </li>
          </TransitionGroup>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Countdown across now"
      description="A future value counts down second by second ('in 15 seconds'), passes 'now', and then keeps going as a past value ('5 seconds ago'), all on its own."
      :code="`<span>Launch <MRelativeTime :value=&quot;launchAt&quot; /></span>`"
      :script="`const launchAt = ref(new Date(Date.now() + 15_000))`"
    >
      <div class="flex flex-wrap items-center gap-4">
        <span class="text-title-large text-on-surface">
          Launch <MRelativeTime :value="launchAt" class="font-medium text-tertiary" />
        </span>
        <MButton variant="text" icon="restart_alt" @click="restartCountdown">Restart</MButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Every unit"
      description="The unit is picked from the distance to now, from seconds up to years. Close values use natural words where the language has them: 'yesterday', 'tomorrow', 'last week', 'next month'."
      :code="`<MRelativeTime :value=&quot;Date.now() - 86_400_000&quot; />  <!-- yesterday -->
<MRelativeTime :value=&quot;Date.now() + 7 * 86_400_000&quot; /> <!-- next week -->`"
    >
      <div class="grid w-full max-w-md grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-body-medium">
        <template v-for="s in scale" :key="s.label">
          <span class="font-mono text-on-surface-variant">{{ s.label }}</span>
          <MRelativeTime :value="s.value" class="text-on-surface" />
        </template>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Any language"
      description="Pass locale per instance, or let it follow the app's locale from createM3UI. Right-to-left languages like Arabic work too."
      :code="`<MRelativeTime :value=&quot;value&quot; locale=&quot;fr-FR&quot; />
<MRelativeTime :value=&quot;value&quot; locale=&quot;ja-JP&quot; />
<MRelativeTime :value=&quot;value&quot; locale=&quot;ar-EG&quot; />`"
    >
      <div class="w-full overflow-x-auto">
        <table class="w-full text-left text-body-medium">
          <thead>
            <tr class="text-label-large text-on-surface-variant">
              <th class="py-2 pr-6 font-medium">Locale</th>
              <th class="py-2 pr-6 font-medium">5 min ago</th>
              <th class="py-2 pr-6 font-medium">1 day ago</th>
              <th class="py-2 font-medium">In 3 days</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant">
            <tr v-for="l in locales" :key="l.tag">
              <td class="py-2 pr-6 text-on-surface-variant">
                {{ l.name }} <span class="font-mono text-body-small">{{ l.tag }}</span>
              </td>
              <td v-for="(v, i) in localeSamples" :key="i" class="py-2 pr-6 text-on-surface">
                <MRelativeTime :value="v" :locale="l.tag" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Input formats"
      description="value accepts an ISO string straight from an API, epoch milliseconds, or a Date."
      :code="`<MRelativeTime value=&quot;2026-10-13T14:30:00Z&quot; />
<MRelativeTime :value=&quot;1791901800000&quot; />
<MRelativeTime :value=&quot;new Date(2026, 9, 9)&quot; />`"
    >
      <div class="grid w-full max-w-md grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-body-medium">
        <span class="text-on-surface-variant">ISO string</span>
        <MRelativeTime :value="isoValue" class="text-on-surface" />
        <span class="text-on-surface-variant">Epoch ms</span>
        <MRelativeTime :value="epochValue" class="text-on-surface" />
        <span class="text-on-surface-variant">Date</span>
        <MRelativeTime :value="dateValue" class="text-on-surface" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="relativeTimeProps" />

    <ComponentPager current="MRelativeTime" />
  </div>
</template>

<style scoped>
.feed-enter-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.2, 0, 0, 1);
}
.feed-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.feed-move {
  transition: transform 0.25s cubic-bezier(0.2, 0, 0, 1);
}
</style>
