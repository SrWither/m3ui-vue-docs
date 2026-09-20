<script setup lang="ts">
import { ref } from 'vue'
import { MSwitch } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const switchVal = ref(true)
const switchNoIconVal = ref(true)

const switchProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Toggle state (v-model)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the switch' },
  { name: 'label', type: 'string', description: 'Label text' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error'", default: "'primary'", description: 'Track/thumb color when on' },
  { name: 'icon', type: 'boolean', default: 'true', description: "M3 officially has two Switch variants — with a check icon inside the thumb, and without (Compose's actual default). Set to false for the plain/no-icon variant." },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSwitch</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A toggle switch with an optional label, 4 semantic colors, and both M3 icon variants.
    </p>

    <ComponentDemo
      title="Switch"
      description="Toggle switches with labels."
      :code="`<template>
  <MSwitch v-model=&quot;val&quot; label=&quot;Notifications&quot; />
  <MSwitch :model-value=&quot;false&quot; :disabled=&quot;true&quot; label=&quot;Disabled&quot; />
</template>`"
      :script="`import { MSwitch } from '@m3ui-vue/m3ui-vue'

const val = ref(true)`"
    >
      <MSwitch v-model="switchVal" label="Notifications" />
      <MSwitch :model-value="false" :disabled="true" label="Disabled" />
    </ComponentDemo>

    <ComponentDemo
      title="Switch Colors"
      description="Same 4 named colors as MCheckbox/MRadio, applied to the track, thumb, and on-check icon."
      :code="`<template>
  <MSwitch :model-value=&quot;true&quot; color=&quot;primary&quot; label=&quot;Primary&quot; />
  <MSwitch :model-value=&quot;true&quot; color=&quot;secondary&quot; label=&quot;Secondary&quot; />
  <MSwitch :model-value=&quot;true&quot; color=&quot;tertiary&quot; label=&quot;Tertiary&quot; />
  <MSwitch :model-value=&quot;true&quot; color=&quot;error&quot; label=&quot;Error&quot; />
</template>`"
    >
      <div class="flex flex-wrap items-center gap-4">
        <MSwitch :model-value="true" color="primary" label="Primary" />
        <MSwitch :model-value="true" color="secondary" label="Secondary" />
        <MSwitch :model-value="true" color="tertiary" label="Tertiary" />
        <MSwitch :model-value="true" color="error" label="Error" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Without Icon"
      description="M3 officially has two Switch variants — with a check icon inside the thumb (the default here, for backwards compatibility) and without (actually Compose's own default — pass icon=false to match it)."
      :code="`<template>
  <MSwitch v-model=&quot;val&quot; :icon=&quot;false&quot; label=&quot;No icon&quot; />
</template>`"
      :script="`const val = ref(true)`"
    >
      <MSwitch v-model="switchNoIconVal" :icon="false" label="No icon" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="switchProps" />

    <ComponentPager current="MSwitch" />
  </div>
</template>
