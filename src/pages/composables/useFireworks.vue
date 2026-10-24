<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef } from 'vue'
import { MButton, MCard, MIcon, MSlider, useFireworks } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const { launch } = useFireworks()

const amount = ref(6)

// A show that keeps going until it's stopped
const stopShow = shallowRef<(() => void) | null>(null)
function toggleShow() {
  if (stopShow.value) {
    stopShow.value()
    stopShow.value = null
  } else {
    stopShow.value = launch({ count: 2, duration: Infinity })
  }
}
onBeforeUnmount(() => stopShow.value?.())

const types: TypeDef[] = [
  {
    name: 'useFireworks()',
    description: 'Returns launch(). launchFireworks(options?) is the same as a plain function, outside components',
    fields: [
      { name: 'launch(options?)', type: '(options?: FireworksOptions) => StopFireworks', required: true, description: 'Launches rockets from the bottom of the screen that burst high up. Returns a function that stops a show with a duration early; what is in the air finishes' },
    ],
  },
  {
    name: 'FireworksOptions',
    fields: [
      { name: 'count', type: 'number', description: 'How many rockets (6, launched over about a second and a half); with duration, rockets per second' },
      { name: 'shapes', type: "('classic' | ShapeName)[]", description: "What the bursts look like, one picked per burst: 'classic' (sparks thrown out from the center, trailing streaks, that fall as they fade) or an MShape's shape the sparks are laid out along: Circle (a ring, with a smaller one inside), Heart, Flower, Sunny, Clover4Leaf… Default: mostly classic, with a shape now and then" },
      { name: 'colors', type: 'string[]', description: 'Any CSS colors, one per burst (sometimes two). Default: primary, secondary, tertiary and their containers' },
      { name: 'size', type: 'number', description: 'Burst radius in px. Default: a sixth of the screen\'s smaller side, between 70 and 180' },
      { name: 'duration', type: 'number', description: 'Keep launching for this long, in ms, count then being rockets per second. Infinity runs until the returned stop()' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useFireworks</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Rockets that rise from the bottom of the screen and burst: the classic way, sparks thrown out from the center
      in every direction trailing streaks, falling as they fade, or laid out along Material 3's expressive shapes:
      rings, hearts, flowers, stars. In your theme's colors, for the big moments: a milestone, a launch, a new
      year. It shares useConfetti's canvas over the page, which ignores clicks and screen readers and goes away when the
      last spark fades, and it does nothing when the system asks for reduced motion.
    </p>

    <ComponentDemo
      title="Basic"
      description="A handful of rockets, launched one after another: mostly classic bursts, with a shape now and then."
      :code="`<script setup>
import { useFireworks } from '@m3ui-vue/m3ui-vue'
const { launch } = useFireworks()
</script>

<template>
  <MButton icon=&quot;celebration&quot; @click=&quot;launch()&quot;>Celebrate</MButton>
</template>`"
    >
      <MButton size="md" icon="celebration" @click="launch()">Celebrate</MButton>
    </ComponentDemo>

    <ComponentDemo
      title="How Many"
      description="count sets how many rockets go up, launched one after another."
      :code="`<script setup>
const { launch } = useFireworks()
const amount = ref(6)
</script>

<template>
  <MSlider v-model=&quot;amount&quot; :min=&quot;1&quot; :max=&quot;30&quot; label=&quot;Rockets&quot; show-value />
  <MButton @click=&quot;launch({ count: amount })&quot;>Launch</MButton>
</template>`"
    >
      <div class="flex w-full max-w-md flex-col items-center gap-4">
        <MSlider v-model="amount" :min="1" :max="30" label="Rockets" show-value class="w-full" />
        <MButton icon="rocket_launch" @click="launch({ count: amount })">Launch {{ amount }}</MButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Shapes and Colors"
      description="Pick how the bursts look, classic or a shape, and their colors."
      :code="`<MButton @click=&quot;launch({ shapes: ['classic'] })&quot;>Classic</MButton>
<MButton @click=&quot;launch({ shapes: ['Heart'], colors: ['#e91e63', '#ff80ab'] })&quot;>Hearts</MButton>
<MButton @click=&quot;launch({ shapes: ['Circle'], count: 8 })&quot;>Classic rings</MButton>
<MButton @click=&quot;launch({ shapes: ['Flower', 'Clover4Leaf'], size: 140 })&quot;>Flowers</MButton>`"
    >
      <div class="flex flex-wrap justify-center gap-3">
        <MButton variant="tonal" icon="flare" @click="launch({ shapes: ['classic'] })">Classic</MButton>
        <MButton variant="tonal" @click="launch({ shapes: ['Heart'], colors: ['#e91e63', '#ff80ab', '#f06292'], count: 4 })">
          <MIcon name="favorite" filled :size="18" /> Hearts
        </MButton>
        <MButton variant="tonal" icon="radio_button_unchecked" @click="launch({ shapes: ['Circle'], count: 8 })">Classic rings</MButton>
        <MButton variant="tonal" icon="local_florist" @click="launch({ shapes: ['Flower', 'Clover4Leaf'], size: 140 })">Flowers</MButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="A Show That Lasts"
      description="With duration it keeps launching for that long, count being rockets per second. Infinity runs until you call the function launch() returns."
      :code="`<script setup>
const { launch } = useFireworks()
let stop = null
</script>

<template>
  <MButton @click=&quot;launch({ duration: 8000, count: 2 })&quot;>8 seconds</MButton>
  <MButton @click=&quot;stop = launch({ count: 2, duration: Infinity })&quot;>Start</MButton>
  <MButton @click=&quot;stop?.()&quot;>Stop</MButton>
</template>`"
    >
      <div class="flex flex-wrap justify-center gap-3">
        <MButton variant="tonal" icon="timer" @click="launch({ duration: 8000, count: 2 })">8 seconds</MButton>
        <MButton :icon="stopShow ? 'stop' : 'play_arrow'" @click="toggleShow">{{ stopShow ? 'Stop the show' : 'Until stopped' }}</MButton>
      </div>
    </ComponentDemo>

    <MCard variant="filled" class="mb-6 p-4 text-body-medium text-on-surface-variant">
      They show best over a dark surface: in light mode, the containers' pale colors fade into the page. Pass your own
      colors (or use them in dark mode) for a stronger show.
    </MCard>

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <ComponentPager current="useFireworks" />
  </div>
</template>
