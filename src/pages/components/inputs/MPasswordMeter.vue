<script setup lang="ts">
import { ref } from 'vue'
import { MTextField, MPasswordMeter } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const pwMeterWeak = ref('abc')
const pwMeterStrong = ref('Sup3r$ecure!')
const pwMeterCustom = ref('short1')

const passwordMeterProps: PropDef[] = [
  { name: 'value', type: 'string', description: 'Password to score' },
  { name: 'labels', type: 'string[]', default: "['Very weak', 'Weak', 'Fair', 'Good', 'Strong']", description: '5 labels, weakest to strongest' },
  { name: 'minLength', type: 'number', default: '8', description: 'Length considered "long enough" — also used (+4) as the "very long" bonus threshold' },
]

const passwordMeterEvents: EventDef[] = [
  { name: 'score', payload: 'number', description: 'Emitted whenever value changes — -1 for an empty value, or 0-4 otherwise' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MPasswordMeter</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A password strength bar. Scores length + character variety (0-4) and emits <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">score</code> so you can gate a submit button on it.
    </p>

    <ComponentDemo
      title="Password strength"
      description="Pair with MTextField type=&quot;password&quot;."
      :code="`<MTextField v-model=&quot;password&quot; label=&quot;Password&quot; type=&quot;password&quot; leading-icon=&quot;lock&quot; />
<MPasswordMeter :value=&quot;password&quot; @score=&quot;onScore&quot; />`"
      :script="`const password = ref('')

function onScore(score: number) {
  // -1 (empty) to 4 (strongest) — e.g. disable submit while score < 2
}`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <div class="flex flex-col gap-2">
          <MTextField v-model="pwMeterWeak" label="Password" type="password" leading-icon="lock" />
          <MPasswordMeter :value="pwMeterWeak" />
        </div>
        <div class="flex flex-col gap-2">
          <MTextField v-model="pwMeterStrong" label="Password" type="password" leading-icon="lock" variant="outlined" />
          <MPasswordMeter :value="pwMeterStrong" />
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom minLength & labels"
      description="Tune the 'long enough' threshold and the label set — e.g. a stricter policy that requires 12+ characters."
      :code="`<MPasswordMeter :value=&quot;password&quot; :min-length=&quot;12&quot; :labels=&quot;['Too short', 'Weak', 'Okay', 'Strong', 'Excellent']&quot; />`"
    >
      <div class="flex flex-col gap-2 w-full sm:w-80">
        <MTextField v-model="pwMeterCustom" label="Password" type="password" leading-icon="lock" variant="outlined" />
        <MPasswordMeter :value="pwMeterCustom" :min-length="12" :labels="['Too short', 'Weak', 'Okay', 'Strong', 'Excellent']" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="passwordMeterProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="passwordMeterEvents" />

    <ComponentPager current="MPasswordMeter" />
  </div>
</template>
