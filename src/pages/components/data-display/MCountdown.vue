<script setup lang="ts">
import { ref } from 'vue'
import { MCountdown, MButton, MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const launch = new Date(Date.now() + 3 * 86_400_000 + 7 * 3_600_000 + 42 * 60_000)
const sale = ref(new Date(Date.now() + 14 * 60_000 + 30_000))
const hold = new Date(Date.now() + 52 * 3_600_000 + 15 * 60_000)

const short = ref(new Date(Date.now() + 10_000))
const finishedCount = ref(0)
const restart = () => (short.value = new Date(Date.now() + 10_000))

const props: PropDef[] = [
  { name: 'to', type: 'Date | number | string', description: 'The moment it counts down to: a Date, a timestamp in ms, or a date string' },
  { name: 'units', type: "('days' | 'hours' | 'minutes' | 'seconds')[]", default: 'all four', description: 'Units shown. One left out folds into the next larger one shown (no days → 52 hours), and the smallest one shown rounds up (30s left reads 1 min without seconds)' },
  { name: 'variant', type: "'boxes' | 'inline'", default: "'boxes'", description: 'boxes: each unit in its own container with its name below; inline: one line of text (3d 7h 42m 10s)' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Digit size: title-large, display-small or display-medium' },
  { name: 'labels', type: 'boolean', default: 'true', description: "Unit names, from Intl in the app's language and plural-aware (1 día, 3 días). Inline without labels separates with colons" },
  { name: 'hideEmpty', type: 'boolean', default: 'false', description: 'Hide leading units while they are zero (no “0 days” a few hours before); the smallest unit always stays' },
  { name: 'animate', type: 'boolean', default: 'true', description: "Roll the digits (MAnimatedNumber); false, or the system's reduced motion, swaps them" },
  { name: 'locale', type: 'string', description: "BCP-47 language for the unit names; defaults to the app's locale (lang)" },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MCountdown</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A countdown to a date for launches, sales, bookings and events: days, hours, minutes and seconds with rolling
      digits, in boxes or as one line of text. Unit names come from <code>Intl</code> in your app's language, so there's
      nothing to translate. It ticks on the second boundary with a single timer, emits <code>finished</code> once when it
      reaches zero, and screen readers get the whole time left as a <code>role="timer"</code> label.
    </p>

    <ComponentDemo
      title="Launch"
      description="The default: one box per unit with its name below."
      :code="`<template>
  <MCountdown :to=&quot;launch&quot; />
</template>`"
    >
      <MCountdown :to="launch" />
    </ComponentDemo>

    <ComponentDemo
      title="Inline"
      description="One line of text that sits in a sentence or a banner, in any size."
      :code="`<template>
  <p>Sale ends in <MCountdown :to=&quot;saleEnd&quot; variant=&quot;inline&quot; size=&quot;sm&quot; hide-empty /></p>
</template>`"
    >
      <MCard variant="filled" class="flex w-full max-w-md items-center gap-3 p-4">
        <MIcon name="local_offer" class="text-primary" />
        <span class="text-body-large">Sale ends in</span>
        <MCountdown :to="sale" variant="inline" size="sm" hide-empty class="font-medium" />
      </MCard>
    </ComponentDemo>

    <ComponentDemo
      title="Units"
      description="A booking hold in hours and minutes only: the days fold into the hours, and the seconds round up into the minutes."
      :code="`<template>
  <MCountdown :to=&quot;holdUntil&quot; :units=&quot;['hours', 'minutes']&quot; size=&quot;lg&quot; />
</template>`"
    >
      <MCountdown :to="hold" :units="['hours', 'minutes']" size="lg" />
    </ComponentDemo>

    <ComponentDemo
      title="Finished and Custom Slots"
      description="#finished replaces it once it reaches zero, and the finished event fires once. The default slot draws your own: it gets days, hours, minutes, seconds, total and finished."
      :code="`<template>
  <MCountdown :to=&quot;to&quot; @finished=&quot;count++&quot;>
    <template #finished>We're live!</template>
  </MCountdown>

  <MCountdown :to=&quot;to&quot; v-slot=&quot;{ seconds, finished }&quot;>
    {{ finished ? 'Go' : seconds + ' s' }}
  </MCountdown>
</template>`"
    >
      <div class="flex flex-col items-center gap-4">
        <MCountdown :to="short" :units="['minutes', 'seconds']" @finished="finishedCount++">
          <template #finished>
            <span class="text-headline-medium text-primary">We're live!</span>
          </template>
        </MCountdown>
        <MCountdown :to="short" v-slot="{ seconds, finished }">
          <span class="text-title-medium">{{ finished ? 'Go' : `${seconds} s` }}</span>
        </MCountdown>
        <div class="flex items-center gap-3">
          <MButton variant="tonal" icon="restart_alt" @click="restart">Restart</MButton>
          <span class="text-body-medium text-on-surface-variant">finished fired {{ finishedCount }}×</span>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events and Slots</h3>
    <ul class="mb-6 list-disc space-y-1 pl-6 text-body-medium text-on-surface-variant">
      <li><code>finished</code>: once when it reaches zero (not on mount if <code>to</code> is already past)</li>
      <li><code>tick</code>: every second, with the parts</li>
      <li><code>#default</code>: replaces the rendering; gets <code>{ days, hours, minutes, seconds, total, finished }</code></li>
      <li><code>#finished</code>: shown instead of the countdown once it reaches zero</li>
    </ul>

    <ComponentPager current="MCountdown" />
  </div>
</template>
