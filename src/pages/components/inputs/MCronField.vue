<script setup lang="ts">
import { computed, ref } from 'vue'
import { MCard, MCronField, MSwitch, describeCron, nextCronRuns, useLocale } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

// First demo: a scheduled job
const backup = ref('0 2 * * *')
const enabled = ref(true)

// Second demo: expressions described in the site's language
const t = useLocale()
const plain = ref('30 8 * * 1-5')
const samples = ['*/5 * * * *', '0 * * * *', '0 9 * * 1-5', '30 8,18 * * 0,6', '0 0 1 * *', '0 12 1 * 5', '15 3 1 */3 *', '@weekly']
const described = computed(() => samples.map((e) => ({ expression: e, text: describeCron(e, t) ?? '' })))
const fmt = computed(() => new Intl.DateTimeFormat(t.lang || undefined, { dateStyle: 'medium', timeStyle: 'short' }))
const nextBackup = computed(() => nextCronRuns(backup.value, 1)[0])

const fieldProps: PropDef[] = [
  { name: 'modelValue', type: 'string', description: 'The expression (v-model): minute hour day-of-month month day-of-week, with *, ranges a-b, steps */n, lists, names (JAN, MON) and macros (@daily, @weekly, @monthly, @yearly, @hourly). Only valid expressions are emitted.' },
  { name: 'builder', type: 'boolean', default: 'true', description: 'Controls for the common schedules above the expression: every few minutes, hourly, daily, weekly on some days, monthly on a day; anything else is Custom.' },
  { name: 'nextRuns', type: 'number', default: '3', description: 'How many upcoming runs to list under it (0: none).' },
  { name: 'label', type: 'string', description: 'The field\'s label; the locale\'s "Cron expression" by default.' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Field style.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables it.' },
  { name: 'error', type: 'boolean | string', description: 'Error state. A string is also the message' },
  { name: 'errorLabel', type: 'string', description: 'Error message shown when error is true' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Inside an MForm or with rules, an expression must be set' },
  { name: 'rules', type: 'ValidationRule | ValidationRule[]', description: "Validation rules: functions (value, ctx) => true | 'message' (may be async) or a Standard Schema. See MForm" },
  { name: 'validateOn', type: "'blur' | 'input' | 'submit'", default: "'blur'", description: 'When the rules are checked and shown' },
  { name: 'validateDebounce', type: 'number', description: "Wait this long (ms) after the value stops changing before re-checking: one request for an async rule, not one per key. Defaults to its MForm's" },
  { name: 'name', type: 'string', description: 'The key of this field in its MForm' },
]
const fieldEvents: EventDef[] = [
  { name: 'blur', payload: '—', description: 'Focus left it (wire a validation library\'s touch here)' },
  { name: 'update:modelValue', payload: 'string', description: 'The expression changed (valid ones only; while the text is invalid the field shows an error instead).' },
]
const helpers = [
  ['describeCron(expression, locale)', 'A sentence in the locale\'s language: describeCron(\'0 9 * * 1-5\', useLocale()) → "At 9:00 AM, Monday to Friday". null when invalid.'],
  ['nextCronRuns(expression, count?, from?)', 'The next times it runs, as Dates in local time (within four years).'],
  ['parseCron(expression) / isValidCron(expression)', 'The values each field allows, or null; whether it\'s valid.'],
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MCronField</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A cron expression editor that nobody needs to remember cron for: controls for the common schedules, the expression
      itself for anything else, a sentence saying what it means in the app's language and the next times it runs.
      Day and month names come from the browser, in the locale's language. When both day fields are set, a day matching
      either runs, as crontab does.
    </p>

    <ComponentDemo
      title="A scheduled job"
      description="A nightly backup, daily at 2:00. Switch to Weekly and pick days, or to Custom and type any expression; the sentence and the next runs follow."
      :code="`<MCronField v-model=&quot;backup&quot; label=&quot;Backup schedule&quot; />`"
      :script="`import { MCronField } from '@m3ui-vue/m3ui-vue'

const backup = ref('0 2 * * *')`"
    >
      <MCard variant="outlined" class="flex w-full max-w-lg flex-col gap-4 p-4">
        <div class="flex items-center gap-3">
          <span class="flex-1 text-title-medium">Nightly backup</span>
          <MSwitch v-model="enabled" aria-label="Enabled" />
        </div>
        <MCronField v-model="backup" label="Backup schedule" :disabled="!enabled" />
        <p class="text-body-small text-on-surface-variant">
          v-model: <code class="text-primary">{{ backup }}</code><template v-if="nextBackup && enabled"> · next: {{ fmt.format(nextBackup) }}</template>
        </p>
      </MCard>
    </ComponentDemo>

    <ComponentDemo
      title="Without the builder, and the helpers"
      description="builder off leaves the expression and its sentence. Below, describeCron() on a few expressions, in this site's language: switch it in the top bar."
      :code="`<MCronField v-model=&quot;expression&quot; :builder=&quot;false&quot; :next-runs=&quot;0&quot; variant=&quot;outlined&quot; />

<li v-for=&quot;e in samples&quot;>{{ e }}: {{ describeCron(e, useLocale()) }}</li>`"
      :script="`import { describeCron, nextCronRuns, useLocale } from '@m3ui-vue/m3ui-vue'

const t = useLocale()
describeCron('0 9 * * 1-5', t) // 'At 9:00 AM, Monday to Friday'
nextCronRuns('0 9 * * 1-5', 3) // [Date, Date, Date]`"
    >
      <div class="flex w-full max-w-2xl flex-col gap-4">
        <MCronField v-model="plain" :builder="false" :next-runs="0" variant="outlined" class="max-w-sm" />
        <div class="overflow-x-auto rounded-xl border border-outline-variant">
          <table class="w-full text-left text-body-medium">
            <tbody>
              <tr v-for="d in described" :key="d.expression" class="border-b border-outline-variant last:border-b-0">
                <td class="whitespace-nowrap px-4 py-2 font-mono text-primary">{{ d.expression }}</td>
                <td class="px-4 py-2 text-on-surface-variant first-letter:uppercase">{{ d.text }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="fieldProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="fieldEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Helpers</h3>
    <div class="mb-8 overflow-x-auto rounded-xl border border-outline-variant">
      <table class="w-full text-left text-body-medium">
        <tbody>
          <tr v-for="[fn, what] in helpers" :key="fn" class="border-b border-outline-variant last:border-b-0">
            <td class="whitespace-nowrap px-4 py-2 font-mono text-primary">{{ fn }}</td>
            <td class="px-4 py-2 text-on-surface-variant">{{ what }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ComponentPager current="MCronField" />
  </div>
</template>
