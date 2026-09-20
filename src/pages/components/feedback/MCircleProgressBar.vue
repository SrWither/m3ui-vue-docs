<script setup lang="ts">
import { ref } from 'vue'
import { MCircleProgressBar, MButton, MIcon } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const circleVal = ref(40)

// Play Store download demo
type DlPhase = 'idle' | 'downloading' | 'installing' | 'installed'
const dlPhase = ref<DlPhase>('idle')
const dlProgress = ref(0)
let dlTimer: ReturnType<typeof setInterval> | null = null

function startInstall() {
  if (dlPhase.value !== 'idle') return
  dlPhase.value = 'downloading'
  dlProgress.value = 0
  dlTimer = setInterval(() => {
    const r = Math.random()
    const inc = r < 0.15 ? 0 : 0.2 + Math.random() * 1.8
    dlProgress.value = Math.min(100, dlProgress.value + inc)
    if (dlProgress.value >= 100) {
      clearInterval(dlTimer!); dlTimer = null
      setTimeout(() => {
        dlPhase.value = 'installing'
        setTimeout(() => { dlPhase.value = 'installed' }, 2500)
      }, 1300)
    }
  }, 40)
}
function cancelDl() {
  if (dlTimer) { clearInterval(dlTimer); dlTimer = null }
  dlPhase.value = 'idle'
  dlProgress.value = 0
}

const circleProgressProps: PropDef[] = [
  { name: 'value', type: 'number', description: 'Progress 0–100 (omit when indeterminate)' },
  { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Spinning arc — no value needed. Identical for both variants.' },
  { name: 'variant', type: "'wavy' | 'circle'", default: "'wavy'", description: 'wavy: animated bumpy ring that fades to circle near 0% and 100%; circle: smooth arc' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error'", default: "'primary'", description: 'Ring color' },
  { name: 'size', type: 'number', default: '48 wavy / 40 circle', description: 'Diameter in px — matches the real M3 WaveSize/Size tokens per variant' },
  { name: 'thickness', type: 'number', default: '4', description: 'Stroke width of the ring/wave in px, matching the real M3 token' },
  { name: 'label', type: 'string', description: 'Label text below the circle' },
]

const circleProgressSlots: SlotDef[] = [
  { name: '#default', description: 'Custom content centered inside the ring. When provided, the percentage label is hidden.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MCircleProgressBar</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A circular progress indicator — a smooth arc, or the M3 Expressive wavy ring that fades between a
      circle and a bumpy wave near the extremes.
    </p>

    <ComponentDemo
      title="Circle"
      description="Smooth ring arc — simple and clean."
      :code="`<MCircleProgressBar variant=&quot;circle&quot; :value=&quot;65&quot; />
<MCircleProgressBar variant=&quot;circle&quot; :value=&quot;40&quot; color=&quot;secondary&quot; :size=&quot;64&quot; />
<MCircleProgressBar variant=&quot;circle&quot; :value=&quot;90&quot; color=&quot;tertiary&quot; :size=&quot;56&quot; />`"
      :script="`import { MCircleProgressBar } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="flex flex-wrap items-center gap-8">
        <MCircleProgressBar variant="circle" :value="circleVal" />
        <MCircleProgressBar variant="circle" :value="circleVal" color="secondary" :size="64" />
        <MCircleProgressBar variant="circle" :value="circleVal" color="tertiary" :size="56" />
        <MCircleProgressBar variant="circle" :value="circleVal" color="error" :size="96" />
      </div>
      <div class="mt-6 flex items-center gap-3">
        <MButton variant="tonal" icon="remove" @click="circleVal = Math.max(0, circleVal - 10)">- 10</MButton>
        <span class="w-12 text-center text-title-medium font-medium">{{ circleVal }}%</span>
        <MButton variant="tonal" icon="add" @click="circleVal = Math.min(100, circleVal + 10)">+ 10</MButton>
        <MButton variant="text" @click="circleVal = 0">Reset</MButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Wavy Circle"
      description="The active arc is a bumpy animated ring that rotates continuously. The track (unfilled circle) fades out as it fills. Near 0% and 100% the amplitude smoothly drops to zero, blending back into a clean circle."
      :code="`<MCircleProgressBar :value=&quot;40&quot; />
<MCircleProgressBar :value=&quot;75&quot; color=&quot;secondary&quot; />
<MCircleProgressBar :value=&quot;90&quot; color=&quot;error&quot; :size=&quot;64&quot; />`"
      :script="`import { MCircleProgressBar } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="flex flex-wrap items-center gap-8">
        <MCircleProgressBar :value="circleVal" />
        <MCircleProgressBar :value="circleVal" color="secondary" />
        <MCircleProgressBar :value="circleVal" color="tertiary" :size="64" />
        <MCircleProgressBar :value="circleVal" color="error" :size="96" />
      </div>
      <div class="mt-6 flex items-center gap-3">
        <MButton variant="tonal" icon="remove" @click="circleVal = Math.max(0, circleVal - 10)">- 10</MButton>
        <span class="w-12 text-center text-title-medium font-medium">{{ circleVal }}%</span>
        <MButton variant="tonal" icon="add" @click="circleVal = Math.min(100, circleVal + 10)">+ 10</MButton>
        <MButton variant="text" @click="circleVal = 0">Reset</MButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Indeterminate"
      description="When the duration is unknown, use indeterminate. The spinning arc looks the same regardless of the variant prop."
      :code="`<MCircleProgressBar indeterminate />
<MCircleProgressBar indeterminate color=&quot;secondary&quot; />
<MCircleProgressBar indeterminate color=&quot;tertiary&quot; :size=&quot;64&quot; />
<MCircleProgressBar indeterminate color=&quot;error&quot; :size=&quot;96&quot; />`"
      :script="`import { MCircleProgressBar } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="flex flex-wrap items-center gap-8">
        <MCircleProgressBar indeterminate />
        <MCircleProgressBar indeterminate color="secondary" />
        <MCircleProgressBar indeterminate color="tertiary" :size="64" />
        <MCircleProgressBar indeterminate color="error" :size="96" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Play Store download"
      description="Use the default slot to embed any content inside the ring. The percentage label is hidden automatically when the slot is used."
      :code="`<script setup>
type DlPhase = 'idle' | 'downloading' | 'installing' | 'installed'
const dlPhase    = ref&lt;DlPhase&gt;('idle')
const dlProgress = ref(0)
let dlTimer: ReturnType&lt;typeof setInterval&gt; | null = null

function startInstall() {
  if (dlPhase.value !== 'idle') return
  dlPhase.value = 'downloading'
  dlProgress.value = 0
  dlTimer = setInterval(() => {
    const r = Math.random()
    const inc = r &lt; 0.15 ? 0 : 0.2 + Math.random() * 1.8
    dlProgress.value = Math.min(100, dlProgress.value + inc)
    if (dlProgress.value &gt;= 100) {
      clearInterval(dlTimer!); dlTimer = null
      setTimeout(() => {
        dlPhase.value = 'installing'
        setTimeout(() => { dlPhase.value = 'installed' }, 2000)
      }, 350)
    }
  }, 40)
}
function cancelDl() {
  if (dlTimer) { clearInterval(dlTimer); dlTimer = null }
  dlPhase.value = 'idle'; dlProgress.value = 0
}
&lt;/script&gt;

&lt;template&gt;
  &lt;div class=&quot;flex flex-col items-center gap-4&quot;&gt;
    &lt;!-- ring shown while downloading / installing --&gt;
    &lt;MCircleProgressBar
      v-if=&quot;dlPhase !== 'installed'&quot;
      :value=&quot;dlPhase === 'downloading' ? Math.round(dlProgress) : undefined&quot;
      :indeterminate=&quot;dlPhase === 'installing'&quot;
      :size=&quot;120&quot;
    &gt;
      &lt;div style=&quot;width:58px;height:58px;border-radius:14px;background:#1DB954;
                  display:flex;align-items:center;justify-content:center&quot;&gt;
        &lt;MIcon name=&quot;headphones&quot; :size=&quot;30&quot; style=&quot;color:white&quot; /&gt;
      &lt;/div&gt;
    &lt;/MCircleProgressBar&gt;

    &lt;!-- idle / installed: just the icon, larger --&gt;
    &lt;div v-else style=&quot;width:72px;height:72px;border-radius:16px;background:#1DB954;
                       display:flex;align-items:center;justify-content:center&quot;&gt;
      &lt;MIcon name=&quot;headphones&quot; :size=&quot;38&quot; style=&quot;color:white&quot; /&gt;
    &lt;/div&gt;

    &lt;div class=&quot;text-center&quot;&gt;
      &lt;p class=&quot;text-title-medium font-medium&quot;&gt;Wavify&lt;/p&gt;
      &lt;p class=&quot;text-body-small text-on-surface-variant&quot;&gt;Music &amp;amp; Podcasts · 48 MB&lt;/p&gt;
    &lt;/div&gt;

    &lt;MButton v-if=&quot;dlPhase === 'idle'&quot; variant=&quot;filled&quot; @click=&quot;startInstall&quot;&gt;Install&lt;/MButton&gt;
    &lt;MButton v-else-if=&quot;dlPhase === 'downloading'&quot; variant=&quot;outlined&quot; @click=&quot;cancelDl&quot;&gt;
      {{ Math.round(dlProgress) }}%  ·  Cancel
    &lt;/MButton&gt;
    &lt;MButton v-else-if=&quot;dlPhase === 'installing'&quot; variant=&quot;outlined&quot; disabled&gt;Installing…&lt;/MButton&gt;
    &lt;MButton v-else variant=&quot;tonal&quot; icon=&quot;open_in_new&quot; @click=&quot;cancelDl&quot;&gt;Open&lt;/MButton&gt;
  &lt;/div&gt;
&lt;/template&gt;`"
    >
      <div class="flex flex-col items-center gap-4 py-4">
        <MCircleProgressBar
          v-if="dlPhase !== 'idle' && dlPhase !== 'installed'"
          :value="dlPhase === 'downloading' ? Math.round(dlProgress) : undefined"
          :indeterminate="dlPhase === 'installing'"
          :size="120"
          color="primary"
        >
          <div
            style="width:58px;height:58px;border-radius:14px;background:#1DB954;display:flex;align-items:center;justify-content:center"
          >
            <MIcon name="headphones" :size="30" style="color:white" />
          </div>
        </MCircleProgressBar>

        <div
          v-else
          style="width:72px;height:72px;border-radius:16px;background:#1DB954;display:flex;align-items:center;justify-content:center"
        >
          <MIcon name="headphones" :size="38" style="color:white" />
        </div>

        <div class="text-center">
          <p class="text-title-medium font-medium">Wavify</p>
          <p class="text-body-small text-on-surface-variant">Music &amp; Podcasts · 48 MB</p>
        </div>

        <MButton v-if="dlPhase === 'idle'" variant="filled" icon="download" @click="startInstall">Install</MButton>
        <MButton v-else-if="dlPhase === 'downloading'" variant="outlined" @click="cancelDl">
          {{ Math.round(dlProgress) }}% · Cancel
        </MButton>
        <MButton v-else-if="dlPhase === 'installing'" variant="outlined" :disabled="true">Installing…</MButton>
        <MButton v-else variant="tonal" icon="open_in_new" @click="cancelDl">Open</MButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Thickness"
      description="Use the thickness prop to scale the ring stroke. Works on both variants and with the slot."
      :code="`<MCircleProgressBar :value=&quot;60&quot; :thickness=&quot;1&quot; label=&quot;1px&quot; />
<MCircleProgressBar :value=&quot;60&quot; :thickness=&quot;3&quot; label=&quot;3px (default)&quot; />
<MCircleProgressBar :value=&quot;60&quot; :thickness=&quot;6&quot; label=&quot;6px&quot; />
<MCircleProgressBar :value=&quot;60&quot; :thickness=&quot;10&quot; label=&quot;10px&quot; />`"
    >
      <div class="flex flex-wrap items-end gap-8">
        <MCircleProgressBar :value="circleVal" :thickness="1" label="1px" />
        <MCircleProgressBar :value="circleVal" :thickness="3" label="3px (default)" />
        <MCircleProgressBar :value="circleVal" :thickness="6" label="6px" color="secondary" />
        <MCircleProgressBar :value="circleVal" :thickness="10" label="10px" color="tertiary" :size="100" />
      </div>
      <div class="mt-5 flex items-center gap-3">
        <MButton variant="tonal" icon="remove" @click="circleVal = Math.max(0, circleVal - 10)">- 10</MButton>
        <span class="w-12 text-center text-title-medium font-medium">{{ circleVal }}%</span>
        <MButton variant="tonal" icon="add" @click="circleVal = Math.min(100, circleVal + 10)">+ 10</MButton>
        <MButton variant="text" @click="circleVal = 0">Reset</MButton>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="circleProgressProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="circleProgressSlots" />

    <ComponentPager current="MCircleProgressBar" />
  </div>
</template>
