<script setup lang="ts">
import { ref } from 'vue'
import { MScheme, MButton, MChip, MIcon, MIconButton, MSwitch, MSlider, seedFromImage, palettes, useColorPalette } from '@m3ui-vue/m3ui-vue'
import type { SchemeVariant } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

// From a seed
const seeds = ['#c8432b', '#e5b92c', '#3b8a5a', '#3b4ca0', '#8a3b8f']
const seed = ref(seeds[0]!)
const notify = ref(true)
const volume = ref(60)

// From an image
const photos = [
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', title: 'Swiss Alps', text: 'Sunrise over the ridge' },
  { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', title: 'Tropical beach', text: 'Crystal clear waters' },
  { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop', title: 'Starry night', text: 'The Milky Way over the peaks' },
]
const photo = ref(0)

// Your own photo
const ownSeed = ref<string>()
const ownUrl = ref<string>()
const reading = ref(false)
const fileInput = ref<HTMLInputElement>()
async function pick(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  reading.value = true
  if (ownUrl.value) URL.revokeObjectURL(ownUrl.value)
  ownUrl.value = URL.createObjectURL(file)
  ownSeed.value = await seedFromImage(file)
  reading.value = false
}

// Palettes
const { palette: appPalette, set: setPalette } = useColorPalette()

// Variants
const variants: SchemeVariant[] = ['tonal-spot', 'content', 'vibrant', 'expressive', 'fidelity', 'monochrome']

const schemeProps: PropDef[] = [
  { name: 'seed', type: 'string', description: 'Seed color (#rrggbb) the scheme is built from' },
  { name: 'image', type: 'string', description: 'An image URL whose dominant color becomes the seed, picked as Android picks a wallpaper\'s. Cross-origin images need CORS headers. seed wins while both are set' },
  { name: 'palette', type: 'string', description: 'One of the palettes (useColorPalette().palettes, custom ones included), applied to this element only with its own CSS, in its standard contrast. seed and image win while set' },
  { name: 'variant', type: "'tonal-spot' | 'content' | 'fidelity' | 'vibrant' | 'expressive' | 'neutral' | 'monochrome' | 'rainbow' | 'fruit-salad'", default: "'tonal-spot'", description: 'How the seed spreads into the scheme; content and fidelity keep the seed\'s own color most visible' },
  { name: 'contrast', type: 'number', default: '0', description: 'Contrast level: 0 standard, 0.5 medium, 1 high (-1 reduced)' },
  { name: 'as', type: 'string', default: "'div'", description: 'Element to render' },
]

const schemeEvents: EventDef[] = [
  { name: 'seed', payload: 'string', description: 'The seed color read from image' },
]

const schemeSlots: SlotDef[] = [
  { name: '#default', description: 'The content. Receives { seed, ready }: the seed in use (the image\'s once it\'s read) and whether the scheme is applied yet' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MScheme</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Paints its content with a color scheme of its own, built from a seed color or from an image's dominant
      color: Material You's content color, where an album, a dish or a profile photo colors its own page. Every
      M3 class and component inside uses the scheme, in light or dark like the rest of the app, while the rest of
      the app keeps its palette. It can also wear one of the library's palettes. It sets the text color and no
      background.
    </p>

    <ComponentDemo
      title="From a Seed"
      description="Pick a seed: everything inside MScheme follows it, buttons, chips, switches and sliders included. The page around it keeps your palette."
      :code="`<template>
  <MScheme :seed=&quot;seed&quot; class=&quot;rounded-3xl bg-surface-container p-5&quot;>
    <p class=&quot;text-title-large&quot;>Evening playlist</p>
    <MChip tone=&quot;primary&quot;>Lo-fi</MChip>
    <MSwitch v-model=&quot;notify&quot; />
    <MSlider v-model=&quot;volume&quot; />
    <MButton icon=&quot;play_arrow&quot;>Play</MButton>
    <MButton variant=&quot;tonal&quot;>Shuffle</MButton>
  </MScheme>
</template>`"
    >
      <div class="flex w-full max-w-md flex-col gap-4">
        <div class="flex gap-2">
          <button
            v-for="s in seeds"
            :key="s"
            class="h-9 w-9 rounded-full ring-offset-2 ring-offset-surface transition-shadow"
            :class="seed === s ? 'ring-2 ring-on-surface' : ''"
            :style="{ background: s }"
            :aria-label="`Seed ${s}`"
            @click="seed = s"
          />
        </div>
        <MScheme :seed="seed" class="flex flex-col gap-4 rounded-3xl bg-surface-container p-5">
          <div class="flex items-center gap-3">
            <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container">
              <MIcon name="queue_music" filled />
            </span>
            <div class="min-w-0 flex-1">
              <p class="text-title-large">Evening playlist</p>
              <p class="text-body-medium text-on-surface-variant">24 songs · 1 h 32 min</p>
            </div>
            <MIconButton icon="favorite" :checked="true" label="Liked" />
          </div>
          <div class="flex flex-wrap gap-2">
            <MChip tone="primary">Lo-fi</MChip>
            <MChip tone="tertiary">Chill</MChip>
            <MChip tone="secondary">Focus</MChip>
          </div>
          <div class="flex items-center gap-3">
            <MIcon name="volume_up" class="text-on-surface-variant" />
            <MSlider v-model="volume" class="flex-1" />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-body-large">Notify me of new songs</span>
            <MSwitch v-model="notify" />
          </div>
          <div class="flex gap-2">
            <MButton icon="play_arrow">Play</MButton>
            <MButton variant="tonal" icon="shuffle">Shuffle</MButton>
          </div>
        </MScheme>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="From an Image"
      description="With image, the photo's dominant color becomes the seed, picked the way Android picks a wallpaper's. The slot gets the seed it read."
      :code="`<template>
  <MScheme :image=&quot;photo.src&quot; variant=&quot;content&quot; v-slot=&quot;{ seed }&quot; class=&quot;overflow-hidden rounded-3xl bg-primary-container&quot;>
    <img :src=&quot;photo.src&quot; :alt=&quot;photo.title&quot; class=&quot;aspect-[4/3] w-full object-cover&quot; />
    <div class=&quot;p-5 text-on-primary-container&quot;>
      <p class=&quot;text-headline-small&quot;>{{ photo.title }}</p>
      <p>Seed: {{ seed }}</p>
      <MButton icon=&quot;map&quot;>Directions</MButton>
    </div>
  </MScheme>
</template>`"
    >
      <div class="flex w-full max-w-md flex-col gap-4">
        <div class="flex gap-2">
          <button
            v-for="(p, i) in photos"
            :key="p.src"
            class="h-14 w-20 overflow-hidden rounded-xl ring-offset-2 ring-offset-surface"
            :class="photo === i ? 'ring-2 ring-on-surface' : 'opacity-70'"
            :aria-label="p.title"
            @click="photo = i"
          >
            <img :src="p.src" alt="" class="h-full w-full object-cover" crossorigin="anonymous" />
          </button>
        </div>
        <MScheme v-slot="{ seed: picked }" :image="photos[photo]!.src" variant="content" class="overflow-hidden rounded-3xl bg-primary-container">
          <img :src="photos[photo]!.src" :alt="photos[photo]!.title" class="aspect-[4/3] w-full object-cover" crossorigin="anonymous" />
          <div class="flex flex-col gap-3 p-5 text-on-primary-container">
            <div>
              <p class="text-headline-small">{{ photos[photo]!.title }}</p>
              <p class="text-body-medium opacity-80">{{ photos[photo]!.text }}</p>
            </div>
            <p class="flex items-center gap-2 text-label-large">
              <span class="h-4 w-4 rounded-full ring-2 ring-on-primary-container/50" :style="{ background: picked }" /> Seed {{ picked ?? '…' }}
            </p>
            <div class="flex gap-2">
              <MButton icon="map">Directions</MButton>
              <MButton variant="tonal" icon="bookmark">Save</MButton>
            </div>
          </div>
        </MScheme>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Your Own Photo"
      description="seedFromImage() reads a seed from a URL, an img, an ImageBitmap or a file the user picked. Nothing is uploaded: the photo is read in the browser."
      :code="`<script setup>
import { seedFromImage } from '@m3ui-vue/m3ui-vue'

const seed = ref()
async function pick(e) {
  seed.value = await seedFromImage(e.target.files[0])
}
</script>

<template>
  <input type=&quot;file&quot; accept=&quot;image/*&quot; @change=&quot;pick&quot; />
  <MScheme :seed=&quot;seed&quot; variant=&quot;content&quot;>…</MScheme>
</template>`"
    >
      <div class="flex w-full max-w-md flex-col gap-4">
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="pick" />
        <div>
          <MButton variant="tonal" icon="add_photo_alternate" :loading="reading" @click="fileInput?.click()">Choose a photo</MButton>
        </div>
        <MScheme :seed="ownSeed" variant="content" class="flex items-center gap-4 rounded-3xl bg-primary-container p-4 text-on-primary-container">
          <img v-if="ownUrl" :src="ownUrl" alt="" class="h-20 w-20 rounded-2xl object-cover" />
          <span v-else class="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-container-high text-on-surface-variant">
            <MIcon name="image" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-title-medium">{{ ownSeed ? 'Your colors' : 'No photo yet' }}</p>
            <p class="text-body-medium opacity-80">{{ ownSeed ? `Seed ${ownSeed}` : 'Pick one to color this card' }}</p>
          </div>
          <MIconButton icon="palette" variant="filled" label="Palette" />
        </MScheme>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Palettes"
      description="With palette, a block wears one of the library's palettes instead of a generated scheme: a theme picker can show every theme at once. Click one to apply it to the whole site."
      :code="`<template>
  <MScheme v-for=&quot;p in palettes&quot; :key=&quot;p.id&quot; :palette=&quot;p.id&quot; as=&quot;button&quot; @click=&quot;set(p.id)&quot;>
    <span class=&quot;bg-primary&quot; />
    <span class=&quot;bg-secondary-container&quot; />
    <span class=&quot;bg-tertiary-container&quot; />
    {{ p.label }}
  </MScheme>
</template>`"
    >
      <div class="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
        <MScheme
          v-for="p in palettes"
          :key="p.id"
          :palette="p.id"
          as="button"
          class="flex flex-col gap-2 rounded-2xl bg-surface-container p-3 text-left transition-shadow"
          :class="appPalette === p.id && 'ring-2 ring-primary'"
          @click="setPalette(p.id)"
        >
          <span class="flex gap-1">
            <span class="h-6 flex-1 rounded-full bg-primary" />
            <span class="h-6 flex-1 rounded-full bg-secondary-container" />
            <span class="h-6 flex-1 rounded-full bg-tertiary-container" />
          </span>
          <span class="text-label-large">{{ p.label }}</span>
        </MScheme>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Variants"
      description="The same seed spread six ways. tonal-spot is Android's default; content and fidelity keep the seed itself in the containers."
      :code="`<template>
  <MScheme seed=&quot;#c8432b&quot; variant=&quot;vibrant&quot;>…</MScheme>
</template>`"
    >
      <div class="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
        <MScheme v-for="v in variants" :key="v" :seed="seed" :variant="v" class="flex flex-col gap-2 rounded-2xl bg-surface-container p-3">
          <span class="text-label-large">{{ v }}</span>
          <div class="flex gap-1">
            <span class="h-8 flex-1 rounded-lg bg-primary" />
            <span class="h-8 flex-1 rounded-lg bg-primary-container" />
            <span class="h-8 flex-1 rounded-lg bg-secondary-container" />
            <span class="h-8 flex-1 rounded-lg bg-tertiary-container" />
          </div>
          <MButton size="xs">Button</MButton>
        </MScheme>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="schemeProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="schemeEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="schemeSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">seedFromImage and seedFromPixels</h3>
    <p class="mb-3 text-body-large text-on-surface-variant">
      <code>seedFromImage(source)</code> returns a promise of the image's seed color (<code>#rrggbb</code>): pass it
      to MScheme's <code>seed</code>, to <code>generateScheme()</code>, or to <code>useColorPalette().setSeed()</code>
      to color the whole app from a wallpaper. It takes a URL, an <code>&lt;img&gt;</code>, an
      <code>ImageBitmap</code> or a <code>Blob</code>, and scales the image down before reading it, so big photos are
      fast. <code>seedFromPixels(rgba)</code> does the same from raw RGBA bytes (a canvas's
      <code>ImageData.data</code>, a video frame).
    </p>

    <ComponentPager current="MScheme" />
  </div>
</template>
