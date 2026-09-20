<script setup lang="ts">
import { ref } from 'vue'
import { MProgressBar, MButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const progressVal = ref(50)
const progressWavy = ref(50)

const progressProps: PropDef[] = [
  { name: 'value', type: 'number', description: 'Progress 0–100 (omit for indeterminate)' },
  { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Indeterminate animation — also implied by omitting value' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error'", default: "'primary'", description: 'Bar color' },
  { name: 'variant', type: "'linear' | 'wavy'", default: "'linear'", description: 'Bar style' },
  { name: 'thickness', type: 'number', default: '4', description: 'Stroke width in px. Defaults to 4dp, matching the real M3 token for both variants.' },
  { name: 'label', type: 'string', description: 'Label text above the bar' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MProgressBar</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A linear progress indicator — determinate, indeterminate, or the M3 Expressive wavy variant.
    </p>

    <ComponentDemo
      title="Progress Bars"
      description="Determinate, indeterminate, and wavy variants."
      :code="`<template>
  <MProgressBar :value=&quot;65&quot; label=&quot;Uploading...&quot; />
  <MProgressBar :indeterminate=&quot;true&quot; color=&quot;tertiary&quot; />
  <MProgressBar :value=&quot;80&quot; variant=&quot;wavy&quot; color=&quot;secondary&quot; />
</template>`"
    >
      <div class="w-full space-y-6">
        <MProgressBar :value="65" label="Uploading... 65%" />
        <MProgressBar :indeterminate="true" color="tertiary" label="Loading..." />
        <MProgressBar :value="80" variant="wavy" color="secondary" label="Processing..." />
        <div class="flex gap-4">
          <MProgressBar :value="30" color="error" />
          <MProgressBar :value="60" color="primary" />
          <MProgressBar :value="90" color="tertiary" />
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Interactive Progress"
      description="Use the buttons to increase or decrease the progress value."
      :code="`<MProgressBar :value=&quot;progress&quot; :label=&quot;\`\${progress}%\`&quot; />
<MButton @click=&quot;progress = Math.max(0, progress - 10)&quot;>- 10</MButton>
<MButton @click=&quot;progress = Math.min(100, progress + 10)&quot;>+ 10</MButton>`"
      :script="`import { MProgressBar, MButton } from '@m3ui-vue/m3ui-vue'

const progress = ref(50)`"
    >
      <div class="w-full space-y-6">
        <div>
          <p class="mb-2 text-label-large font-medium">Default</p>
          <MProgressBar :value="progressVal" :label="`${progressVal}%`" />
          <div class="mt-3 flex items-center gap-3">
            <MButton variant="tonal" icon="remove" @click="progressVal = Math.max(0, progressVal - 10)">- 10</MButton>
            <span class="w-12 text-center text-title-medium font-medium">{{ progressVal }}%</span>
            <MButton variant="tonal" icon="add" @click="progressVal = Math.min(100, progressVal + 10)">+ 10</MButton>
            <MButton variant="text" @click="progressVal = 0">Reset</MButton>
          </div>
        </div>
        <div>
          <p class="mb-2 text-label-large font-medium">Wavy</p>
          <MProgressBar :value="progressWavy" variant="wavy" color="secondary" :label="`${progressWavy}%`" />
          <div class="mt-3 flex items-center gap-3">
            <MButton variant="tonal" icon="remove" @click="progressWavy = Math.max(0, progressWavy - 10)">- 10</MButton>
            <span class="w-12 text-center text-title-medium font-medium">{{ progressWavy }}%</span>
            <MButton variant="tonal" icon="add" @click="progressWavy = Math.min(100, progressWavy + 10)">+ 10</MButton>
            <MButton variant="text" @click="progressWavy = 0">Reset</MButton>
          </div>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Thickness"
      description="Use the thickness prop to control the stroke width. Both variants default to 4dp, matching the real M3 token."
      :code="`<!-- Linear -->
<MProgressBar :value=&quot;60&quot; :thickness=&quot;2&quot; label=&quot;linear · thickness 2&quot; />
<MProgressBar :value=&quot;60&quot; label=&quot;linear · thickness 4 (default)&quot; />
<MProgressBar :value=&quot;60&quot; :thickness=&quot;8&quot; label=&quot;linear · thickness 8&quot; />

<!-- Wavy -->
<MProgressBar :value=&quot;60&quot; variant=&quot;wavy&quot; :thickness=&quot;2&quot; color=&quot;secondary&quot; label=&quot;wavy · thickness 2&quot; />
<MProgressBar :value=&quot;60&quot; variant=&quot;wavy&quot; color=&quot;secondary&quot; label=&quot;wavy · thickness 3 (default)&quot; />
<MProgressBar :value=&quot;60&quot; variant=&quot;wavy&quot; :thickness=&quot;5&quot; color=&quot;secondary&quot; label=&quot;wavy · thickness 5&quot; />`"
    >
      <div class="w-full space-y-6">
        <div class="space-y-4">
          <p class="text-label-large font-medium text-on-surface-variant">Linear</p>
          <MProgressBar :value="60" :thickness="2" label="thickness: 2" />
          <MProgressBar :value="60" label="thickness: 4 (default)" />
          <MProgressBar :value="60" :thickness="8" label="thickness: 8" />
        </div>
        <div class="space-y-4">
          <p class="text-label-large font-medium text-on-surface-variant">Wavy</p>
          <MProgressBar :value="60" variant="wavy" :thickness="2" color="secondary" label="thickness: 2" />
          <MProgressBar :value="60" variant="wavy" color="secondary" label="thickness: 3 (default)" />
          <MProgressBar :value="60" variant="wavy" :thickness="5" color="secondary" label="thickness: 5" />
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="progressProps" />

    <ComponentPager current="MProgressBar" />
  </div>
</template>
