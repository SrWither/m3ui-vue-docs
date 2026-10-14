<script setup lang="ts">
// Start menu: search, every app, and the way back to the docs / to this example's source.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { MAvatar, MButton, MIcon } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { useDesktop } from '../useDesktop'

const open = defineModel<boolean>({ required: true })
const router = useRouter()
const { apps, open: openApp } = useDesktop()

const query = ref('')
const input = ref<HTMLInputElement>()
const panel = ref<HTMLElement>()
const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? apps.filter((a) => a.title.toLowerCase().includes(q)) : apps
})

function launch(id: string) {
  openApp(id)
  open.value = false
}
function onEnter() {
  if (results.value[0]) launch(results.value[0].id)
}

watch(open, async (v) => {
  if (!v) return
  query.value = ''
  await nextTick()
  input.value?.focus()
})

function onPointerDown(e: PointerEvent) {
  const t = e.target as Element
  if (open.value && !panel.value?.contains(t) && !t.closest('[data-start-button]')) open.value = false
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}
onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('keydown', onKeydown)
})

const tones = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
  error: 'bg-error-container text-on-error-container',
}
</script>

<template>
  <Transition name="m3d-start">
    <div
      v-if="open"
      ref="panel"
      role="dialog"
      aria-label="Start"
      class="absolute bottom-16 left-1/2 flex w-[min(560px,calc(100vw-16px))] -translate-x-1/2 flex-col overflow-hidden rounded-3xl bg-surface-container-high shadow-elevation-3"
    >
      <div class="p-4 pb-2">
        <label class="flex h-12 items-center gap-3 rounded-full bg-surface-container-highest px-4 focus-within:ring-2 focus-within:ring-secondary">
          <MIcon name="search" class="text-on-surface-variant" />
          <input
            ref="input"
            v-model="query"
            type="text"
            placeholder="Search apps"
            class="min-w-0 flex-1 bg-transparent text-body-large text-on-surface outline-none placeholder:text-on-surface-variant"
            @keydown.enter="onEnter"
          />
        </label>
      </div>

      <p class="px-6 pt-2 pb-1 text-label-large text-on-surface-variant">{{ query ? 'Results' : 'All apps' }}</p>
      <div class="grid grid-cols-4 gap-1 px-3 pb-3 sm:grid-cols-5">
        <button
          v-for="app in results"
          :key="app.id"
          type="button"
          class="flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl p-2 outline-none transition-colors hover:bg-on-surface/8 focus-visible:ring-2 focus-visible:ring-secondary"
          @click="launch(app.id)"
        >
          <span class="flex h-12 w-12 items-center justify-center rounded-2xl" :class="tones[app.tone]">
            <MIcon :name="app.icon" :size="26" />
          </span>
          <span class="text-label-medium text-on-surface">{{ app.title }}</span>
        </button>
        <p v-if="!results.length" class="col-span-full py-6 text-center text-body-medium text-on-surface-variant">No apps match "{{ query }}"</p>
      </div>

      <div class="flex items-center gap-3 border-t border-outline-variant/60 bg-surface-container px-5 py-3">
        <MAvatar name="Guest" :size="32" />
        <span class="flex-1 text-title-small text-on-surface">Guest</span>
        <a :href="exampleSource('desktop')" target="_blank" rel="noopener" class="no-underline">
          <MButton variant="text" icon="code">Source</MButton>
        </a>
        <MButton variant="tonal" icon="menu_book" @click="router.push('/examples')">Docs</MButton>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.m3d-start-enter-active {
  transition: opacity 150ms linear, transform 300ms cubic-bezier(0.05, 0.7, 0.1, 1);
}
.m3d-start-leave-active {
  transition: opacity 120ms linear, transform 200ms cubic-bezier(0.3, 0, 0.8, 0.15);
}
.m3d-start-enter-from,
.m3d-start-leave-to {
  opacity: 0;
  /* Tailwind v4 centers with the separate `translate` property, so this only adds the rise. */
  transform: translateY(24px);
}
</style>
