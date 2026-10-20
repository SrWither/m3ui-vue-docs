<script setup lang="ts">
/*
 * Cook mode: one step at a time, full screen, in the recipe's colors. Each step takes another
 * container color and the big shape behind it morphs into a new one. Swipe or use the arrow keys
 * to move, steps with a wait show their timer, and the screen stays awake while it's open.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MBottomSheet, MButton, MIcon, MIconButton, MList, MListItem, MShape, type ShapeName } from '@m3ui-vue/m3ui-vue'
import { byId, formatQty } from '../data'
import { useRecipes } from '../useRecipes'
import TimerRing from '../components/TimerRing.vue'

const { cooking, cookStep, factorOf, isSaved, toggleSaved, runningTimers, remaining } = useRecipes()
const recipe = computed(() => (cooking.value ? byId(cooking.value) : undefined))
const steps = computed(() => recipe.value?.steps ?? [])
const finished = computed(() => cookStep.value >= steps.value.length)
const step = computed(() => steps.value[cookStep.value])

// Container role per step, and the shape behind it.
const tones = [
  { bg: 'bg-primary-container', text: 'text-on-primary-container', shape: 'text-primary' },
  { bg: 'bg-tertiary-container', text: 'text-on-tertiary-container', shape: 'text-tertiary' },
  { bg: 'bg-secondary-container', text: 'text-on-secondary-container', shape: 'text-secondary' },
]
const tone = computed(() => (finished.value ? tones[0]! : tones[cookStep.value % tones.length]!))
const shapes: ShapeName[] = ['Cookie9Sided', 'Flower', 'Sunny', 'Clover8Leaf', 'SoftBurst', 'Puffy', 'Cookie12Sided']
const shape = computed<ShapeName>(() => (finished.value ? 'Burst' : shapes[cookStep.value % shapes.length]!))

const direction = ref<'next' | 'prev'>('next')
function goTo(i: number) {
  const n = Math.min(steps.value.length, Math.max(0, i))
  if (n === cookStep.value) return
  direction.value = n > cookStep.value ? 'next' : 'prev'
  cookStep.value = n
}
const close = () => (cooking.value = null)

// Swipe between steps (horizontal drags; vertical ones stay scrolls).
let startX = 0
let startY = 0
function onDown(e: PointerEvent) {
  startX = e.clientX
  startY = e.clientY
}
function onUp(e: PointerEvent) {
  const dx = e.clientX - startX
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(e.clientY - startY) * 1.5) goTo(cookStep.value + (dx < 0 ? 1 : -1))
}

function onKey(e: KeyboardEvent) {
  if (!cooking.value || (e.target as HTMLElement).closest('input, textarea')) return
  if (e.key === 'ArrowRight') goTo(cookStep.value + 1)
  else if (e.key === 'ArrowLeft') goTo(cookStep.value - 1)
  else if (e.key === 'Escape' && !sheet.value) close()
}

// Keep the screen on while cooking, where the browser allows it.
let lock: { release(): Promise<void> } | null = null
async function wake(on: boolean) {
  try {
    if (on && !lock) lock = await (navigator as Navigator & { wakeLock?: { request(t: 'screen'): Promise<{ release(): Promise<void> }> } }).wakeLock?.request('screen') ?? null
    else if (!on && lock) {
      await lock.release()
      lock = null
    }
  } catch {
    lock = null
  }
}
watch(cooking, (v) => wake(!!v))
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  wake(false)
})

const sheet = ref(false)
const qty = (i: number) => {
  const r = recipe.value!
  const ing = r.ingredients[i]!
  return [formatQty(ing.qty, factorOf(r)), ing.unit].filter(Boolean).join(' ')
}

// Timers running on other steps, as small pills you can jump to.
const otherTimers = computed(() => runningTimers.value.filter((t) => t.recipe === cooking.value && t.step !== cookStep.value))
const clock = (s: number) => `${Math.floor(Math.ceil(s) / 60)}:${String(Math.ceil(s) % 60).padStart(2, '0')}`
</script>

<template>
  <Transition name="sim-cook">
    <div
      v-if="recipe"
      class="sim-cook fixed inset-0 z-40 flex flex-col overflow-hidden"
      :class="[tone.bg, tone.text]"
      role="dialog"
      aria-modal="true"
      :aria-label="`Cooking ${recipe.title}`"
      @pointerdown="onDown"
      @pointerup="onUp"
    >
      <MShape :shape="shape" :speed="0.8" class="sim-cook-shape pointer-events-none absolute opacity-20" :class="tone.shape" />

      <header class="relative flex h-16 shrink-0 items-center gap-2 px-3 sm:px-5">
        <MIconButton icon="close" label="Leave cook mode" @click="close" />
        <div class="min-w-0 flex-1">
          <p class="truncate text-title-medium">{{ recipe.title }}</p>
          <p class="text-label-medium opacity-75">{{ finished ? 'All done' : `Step ${cookStep + 1} of ${steps.length}` }}</p>
        </div>
        <MButton variant="elevated" icon="list_alt" @click="sheet = true">Ingredients</MButton>
      </header>

      <div class="relative flex shrink-0 gap-1.5 px-4 sm:px-6" role="tablist" aria-label="Steps">
        <button
          v-for="(_, i) in steps"
          :key="i"
          role="tab"
          :aria-selected="i === cookStep"
          :aria-label="`Step ${i + 1}`"
          class="sim-dot h-2 rounded-full bg-current"
          :class="i === cookStep ? 'flex-[4] opacity-100' : i < cookStep ? 'flex-1 opacity-60' : 'flex-1 opacity-20'"
          @click="goTo(i)"
        />
      </div>

      <div v-if="otherTimers.length" class="relative flex flex-wrap gap-2 px-4 pt-3 sm:px-6">
        <button
          v-for="t in otherTimers"
          :key="t.step"
          class="flex items-center gap-1.5 rounded-full bg-surface/70 px-3 py-1.5 text-label-large text-on-surface"
          @click="goTo(t.step)"
        >
          <MIcon name="timer" :size="18" /> Step {{ t.step + 1 }} · {{ clock(remaining(t)) }}
        </button>
      </div>

      <main class="relative min-h-0 flex-1 touch-pan-y overflow-y-auto">
        <Transition :name="`sim-step-${direction}`" mode="out-in">
          <div v-if="!finished && step" :key="cookStep" class="mx-auto flex min-h-full max-w-3xl flex-col justify-center gap-6 px-6 py-8 sm:px-10">
            <span class="sim-display text-[6rem] leading-none font-bold tracking-tighter opacity-90 sm:text-[8rem]">{{ String(cookStep + 1).padStart(2, '0') }}</span>
            <p class="text-headline-small sm:text-headline-medium">{{ step.text }}</p>
            <TimerRing v-if="step.timer" :recipe="recipe.id" :step="cookStep" :minutes="step.timer" class="mt-2" />
          </div>
          <div v-else key="done" class="mx-auto flex min-h-full max-w-xl flex-col items-center justify-center gap-6 px-6 py-8 text-center">
            <span class="relative grid h-40 w-40 place-items-center text-primary">
              <MShape shape="SoftBurst" class="sim-spin absolute inset-0" />
              <MIcon name="restaurant" :size="64" class="sim-fill relative text-on-primary" />
            </span>
            <h2 class="sim-display text-display-small font-semibold">Bon appétit!</h2>
            <p class="text-body-large opacity-80">{{ recipe.title }} is ready. Enjoy it while it's hot.</p>
            <div class="flex flex-wrap justify-center gap-2">
              <MButton size="md" icon="check" @click="close">Back to the recipe</MButton>
              <MButton v-if="!isSaved(recipe.id)" variant="tonal" size="md" icon="favorite" @click="toggleSaved(recipe.id, true)">Save it</MButton>
            </div>
          </div>
        </Transition>
      </main>

      <footer v-if="!finished" class="relative flex shrink-0 items-center gap-3 px-4 pt-2 pb-6 sm:px-6">
        <MIconButton icon="arrow_back" label="Previous step" variant="outlined" size="lg" :disabled="cookStep === 0" @click="goTo(cookStep - 1)" />
        <MButton size="lg" variant="elevated" class="flex-1" :icon="cookStep === steps.length - 1 ? 'done_all' : 'arrow_forward'" icon-pos="trailing" @click="goTo(cookStep + 1)">
          {{ cookStep === steps.length - 1 ? 'Finish' : 'Next step' }}
        </MButton>
      </footer>

      <MBottomSheet v-model="sheet" title="Ingredients">
        <MList segmented>
          <MListItem v-for="(ing, i) in recipe.ingredients" :key="ing.name" :title="ing.name" :trailing-text="qty(i)" />
        </MList>
      </MBottomSheet>
    </div>
  </Transition>
</template>
