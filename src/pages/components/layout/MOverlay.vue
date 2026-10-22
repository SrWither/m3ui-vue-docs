<script setup lang="ts">
import { ref } from 'vue'
import { MOverlay, MButton, MCenter, MCard, MText, MSubtitle, MIconButton, MIcon, MDialog } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const overlayProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', default: 'true', description: 'Controls visibility (v-model)' },
  { name: 'scrim', type: 'boolean', default: 'true', description: 'Show dark backdrop' },
  { name: 'zIndex', type: 'number', default: '50', description: 'Z-index value' },
  { name: 'closeOnEscape', type: 'boolean', default: 'false', description: "Closes on Escape. It shares the library's Escape stack with MDialog and the sheets, so a dialog or menu opened over it takes Escape first" },
  { name: 'lockScroll', type: 'boolean', default: 'false', description: "Locks the page's scroll while open (shared with the library's other modal surfaces, so stacking is safe)" },
  { name: 'transition', type: 'string', description: 'Name of a <Transition> (your CSS classes) to play instead of the default fade. The overlay is teleported, so define them globally (an unscoped <style>, or :global() in a scoped one)' },
]

const overlayEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Emitted with false when the scrim is clicked (or Escape is pressed with closeOnEscape), for v-model support' },
]

const showOverlay = ref(false)
const viewerOpen = ref(false)
const confirmOpen = ref(false)
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MOverlay</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Full-screen overlay with scrim and teleport to body. A generic low-level building block — content is entirely
      up to you via the default slot.
    </p>

    <ComponentDemo
      title="Overlay"
      description="Full-screen overlay with scrim and teleport to body."
      :code="`<template>
  <MButton @click=&quot;show = true&quot;>Show Overlay</MButton>
  <MOverlay v-model=&quot;show&quot;>
    <MCenter class=&quot;h-full&quot;>
      <MCard class=&quot;p-6&quot;>
        <MText variant=&quot;title-medium&quot;>Overlay content</MText>
        <MButton class=&quot;mt-4&quot; @click=&quot;show = false&quot;>Close</MButton>
      </MCard>
    </MCenter>
  </MOverlay>
</template>`"
      :script="`import { ref } from 'vue'
import { MOverlay, MButton, MCenter, MCard, MText } from '@m3ui-vue/m3ui-vue'

const show = ref(false)`"
    >
      <MButton @click="showOverlay = true">Show Overlay</MButton>
      <MOverlay v-model="showOverlay">
        <MCenter class="h-full">
          <MCard class="p-6">
            <MText variant="title-medium" weight="medium">Overlay Content</MText>
            <MSubtitle size="medium" class="mt-1">Click the scrim or button to close.</MSubtitle>
            <MButton class="mt-4" @click="showOverlay = false">Close</MButton>
          </MCard>
        </MCenter>
      </MOverlay>
    </ComponentDemo>

    <ComponentDemo
      title="Full-screen viewer"
      description="Without a scrim, your classes paint and lay out the content layer (they go on it, over the scrim, not on the teleported wrapper), so it becomes a photo or story viewer. closeOnEscape and lockScroll do what a modal needs; Escape goes to whatever opened last, so with the dialog open it closes the dialog first. transition plays your own enter/leave."
      :code="`<MOverlay
  v-model=&quot;open&quot;
  :scrim=&quot;false&quot;
  close-on-escape
  lock-scroll
  transition=&quot;viewer&quot;
  class=&quot;flex flex-col bg-black text-white&quot;
  role=&quot;dialog&quot;
  aria-label=&quot;Photo&quot;
>
  <header class=&quot;flex justify-end gap-1 p-2&quot;>
    <MIconButton icon=&quot;delete&quot; label=&quot;Delete&quot; color=&quot;#fff&quot; @click=&quot;confirm = true&quot; />
    <MIconButton icon=&quot;close&quot; label=&quot;Close&quot; color=&quot;#fff&quot; @click=&quot;open = false&quot; />
  </header>
  ...
</MOverlay>
<MDialog v-model=&quot;confirm&quot; title=&quot;Delete photo?&quot;>...</MDialog>

<style>
/* Unscoped: the overlay is teleported out of this component */
.viewer-enter-active, .viewer-leave-active { transition: opacity 200ms, transform 250ms cubic-bezier(0.2, 0, 0, 1); }
.viewer-enter-from, .viewer-leave-to { opacity: 0; transform: scale(0.96); }
</style>`"
    >
      <MButton icon="photo" @click="viewerOpen = true">Open photo</MButton>
      <MOverlay
        v-model="viewerOpen"
        :scrim="false"
        close-on-escape
        lock-scroll
        transition="docs-viewer"
        class="flex flex-col bg-black text-white"
        role="dialog"
        aria-label="Photo"
      >
        <header class="flex justify-end gap-1 p-2">
          <MIconButton icon="delete" label="Delete" color="#fff" @click="confirmOpen = true" />
          <MIconButton icon="close" label="Close" color="#fff" @click="viewerOpen = false" />
        </header>
        <div class="flex min-h-0 flex-1 items-center justify-center p-6">
          <div class="flex aspect-[4/3] w-full max-w-2xl items-center justify-center rounded-2xl bg-linear-to-br from-amber-300 via-rose-400 to-indigo-700">
            <MIcon name="landscape" :size="96" class="text-white/80" />
          </div>
        </div>
        <p class="pb-6 text-center text-body-medium text-white/70">Press Escape: with the dialog open it closes the dialog, then the viewer.</p>
      </MOverlay>
      <MDialog v-model="confirmOpen" title="Delete photo?">
        It will be gone from all your albums.
        <template #actions>
          <MButton variant="text" @click="confirmOpen = false">Cancel</MButton>
          <MButton @click="confirmOpen = false; viewerOpen = false">Delete</MButton>
        </template>
      </MDialog>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="overlayProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="overlayEvents" />

    <ComponentPager current="MOverlay" />
  </div>
</template>

<style>
/* Unscoped: MOverlay plays the transition on its teleported container */
.docs-viewer-enter-active,
.docs-viewer-leave-active {
  transition: opacity 200ms ease, transform 250ms cubic-bezier(0.2, 0, 0, 1);
}
.docs-viewer-enter-from,
.docs-viewer-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
