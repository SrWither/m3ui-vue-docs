<script setup lang="ts">
import { MCard } from '@m3ui-vue/m3ui-vue'
import { MChart } from '@m3ui-vue/m3ui-vue/chart'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [12, 19, 8, 15, 22, 17],
      backgroundColor: 'rgba(103, 80, 164, 0.6)',
      borderColor: 'rgb(103, 80, 164)',
      borderWidth: 2,
    },
    {
      label: 'Expenses',
      data: [8, 12, 6, 10, 14, 11],
      backgroundColor: 'rgba(0, 150, 136, 0.6)',
      borderColor: 'rgb(0, 150, 136)',
      borderWidth: 2,
    },
    {
      label: 'Profit',
      data: [4, 7, 2, 5, 8, 6],
      backgroundColor: 'rgba(255, 152, 0, 0.6)',
      borderColor: 'rgb(255, 152, 0)',
      borderWidth: 2,
    },
  ],
}

const pieData = {
  labels: ['Vue', 'React', 'Angular', 'Svelte', 'Solid'],
  datasets: [{
    data: [35, 28, 18, 12, 7],
    backgroundColor: [
      'rgb(103, 80, 164)',
      'rgb(0, 150, 136)',
      'rgb(233, 30, 99)',
      'rgb(255, 152, 0)',
      'rgb(33, 150, 243)',
    ],
  }],
}

const radarData = {
  labels: ['Speed', 'DX', 'Ecosystem', 'Bundle Size', 'Learning Curve', 'Community'],
  datasets: [
    {
      label: 'Vue',
      data: [90, 95, 80, 85, 90, 85],
      backgroundColor: 'rgba(103, 80, 164, 0.2)',
      borderColor: 'rgb(103, 80, 164)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(103, 80, 164)',
    },
    {
      label: 'React',
      data: [85, 80, 95, 70, 75, 95],
      backgroundColor: 'rgba(0, 150, 136, 0.2)',
      borderColor: 'rgb(0, 150, 136)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(0, 150, 136)',
    },
  ],
}

const noLegendOptions = {
  plugins: { legend: { display: false } },
}

const chartProps: PropDef[] = [
  { name: 'type', type: "'line' | 'bar' | 'pie' | 'doughnut' | 'radar'", description: 'Chart type. Required — there is no default.' },
  { name: 'data', type: 'Record<string, any>', description: 'Chart.js data object with labels and datasets. Required — there is no default.' },
  { name: 'options', type: 'Record<string, any>', description: "Chart.js options, deep-merged on top of MChart's own M3-themed defaults (legend/tooltip/axis colors that track the active theme automatically)" },
  { name: 'height', type: 'string', default: "'300px'", description: 'Chart height' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MChart</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A thin Chart.js wrapper — line, bar, pie, doughnut, and radar types, with legend/tooltip/axis colors that
      automatically track the active M3 theme (light/dark, and any palette swap). Available from the
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">/chart</code> entry point, with
      <code class="text-body-small">chart.js</code> and <code class="text-body-small">vue-chartjs</code> as
      optional peer dependencies.
    </p>

    <ComponentDemo
      title="Bar & Line"
      description="Multi-dataset charts with custom colors per series."
      :code="`<script setup>
const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    { label: 'Revenue', data: [12, 19, 8, 15, 22, 17], backgroundColor: 'rgba(103, 80, 164, 0.6)', borderColor: 'rgb(103, 80, 164)' },
    { label: 'Expenses', data: [8, 12, 6, 10, 14, 11], backgroundColor: 'rgba(0, 150, 136, 0.6)', borderColor: 'rgb(0, 150, 136)' },
    { label: 'Profit', data: [4, 7, 2, 5, 8, 6], backgroundColor: 'rgba(255, 152, 0, 0.6)', borderColor: 'rgb(255, 152, 0)' },
  ],
}
<\/script>

<template>
  <MChart type=&quot;bar&quot; :data=&quot;data&quot; height=&quot;280px&quot; />
  <MChart type=&quot;line&quot; :data=&quot;data&quot; height=&quot;280px&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MCard variant="outlined" class="p-4">
          <p class="mb-2 text-label-medium font-medium text-on-surface-variant">Bar</p>
          <MChart type="bar" :data="chartData" height="260px" />
        </MCard>
        <MCard variant="outlined" class="p-4">
          <p class="mb-2 text-label-medium font-medium text-on-surface-variant">Line</p>
          <MChart type="line" :data="chartData" height="260px" />
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Pie & Doughnut"
      description="Circular charts with distinct colors per segment."
      :code="`<script setup>
const data = {
  labels: ['Vue', 'React', 'Angular', 'Svelte', 'Solid'],
  datasets: [{
    data: [35, 28, 18, 12, 7],
    backgroundColor: ['rgb(103,80,164)', 'rgb(0,150,136)', 'rgb(233,30,99)', 'rgb(255,152,0)', 'rgb(33,150,243)'],
  }],
}
<\/script>

<template>
  <MChart type=&quot;pie&quot; :data=&quot;data&quot; height=&quot;280px&quot; />
  <MChart type=&quot;doughnut&quot; :data=&quot;data&quot; height=&quot;280px&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MCard variant="outlined" class="p-4">
          <p class="mb-2 text-label-medium font-medium text-on-surface-variant">Pie</p>
          <MChart type="pie" :data="pieData" height="260px" />
        </MCard>
        <MCard variant="outlined" class="p-4">
          <p class="mb-2 text-label-medium font-medium text-on-surface-variant">Doughnut</p>
          <MChart type="doughnut" :data="pieData" height="260px" />
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Radar"
      description="Multi-axis comparison chart, ideal for comparing feature sets."
      :code="`<script setup>
const data = {
  labels: ['Speed', 'DX', 'Ecosystem', 'Bundle Size', 'Learning Curve', 'Community'],
  datasets: [
    { label: 'Vue', data: [90, 95, 80, 85, 90, 85], backgroundColor: 'rgba(103,80,164,0.2)', borderColor: 'rgb(103,80,164)' },
    { label: 'React', data: [85, 80, 95, 70, 75, 95], backgroundColor: 'rgba(0,150,136,0.2)', borderColor: 'rgb(0,150,136)' },
  ],
}
<\/script>

<template>
  <MChart type=&quot;radar&quot; :data=&quot;data&quot; height=&quot;350px&quot; />
</template>`"
    >
      <div class="mx-auto w-full max-w-lg">
        <MCard variant="outlined" class="p-4">
          <p class="mb-2 text-label-medium font-medium text-on-surface-variant">Radar</p>
          <MChart type="radar" :data="radarData" height="320px" />
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Options"
      description="options is deep-merged on top of MChart's own theme-aware defaults, so you only need to specify what you want to override — here, hiding the legend."
      :code="`<script setup>
const options = {
  plugins: { legend: { display: false } },
}
<\/script>

<template>
  <MChart type=&quot;bar&quot; :data=&quot;data&quot; :options=&quot;options&quot; height=&quot;240px&quot; />
</template>`"
    >
      <MCard variant="outlined" class="w-full p-4">
        <p class="mb-2 text-label-medium font-medium text-on-surface-variant">Legend hidden via options</p>
        <MChart type="bar" :data="chartData" :options="noLegendOptions" height="240px" />
      </MCard>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="chartProps" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Peer Dependencies</p>
      <pre class="rounded-lg bg-surface-container p-3 text-body-small"><code>chart.js  vue-chartjs</code></pre>
    </MCard>

    <ComponentPager current="MChart" />
  </div>
</template>
