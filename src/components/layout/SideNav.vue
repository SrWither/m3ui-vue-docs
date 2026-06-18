<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { MIcon } from '@m3ui-vue/m3ui-vue'

interface NavItem {
  label: string
  icon: string
  to: string
}

interface NavSection {
  title: string
  icon: string
  items: NavItem[]
}

const sections: NavSection[] = [
  {
    title: 'Getting Started',
    icon: 'rocket_launch',
    items: [
      { label: 'Introduction', icon: 'home', to: '/' },
    ],
  },
  {
    title: 'Components',
    icon: 'widgets',
    items: [
      { label: 'Buttons', icon: 'smart_button', to: '/components/buttons' },
    ],
  },
  {
    title: 'Styles',
    icon: 'palette',
    items: [
      { label: 'Palettes', icon: 'color_lens', to: '/styles/palettes' },
    ],
  },
]

defineProps<{ expanded?: boolean; drawerOpen?: boolean }>()
defineEmits<{ toggle: []; drawerClose: [] }>()

const route = useRoute()
const openSections = ref<Record<string, boolean>>(
  Object.fromEntries(sections.map((s) => [s.title, true])),
)

function toggleSection(title: string) {
  openSections.value[title] = !openSections.value[title]
}

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <!-- Desktop sidebar -->
  <nav
    class="hidden shrink-0 flex-col overflow-hidden border-r border-outline-variant bg-surface transition-[width] duration-300 ease-in-out md:flex"
    :class="expanded ? 'w-64' : 'w-[72px]'"
  >
    <div class="flex h-16 shrink-0 items-center border-b border-outline-variant">
      <div class="flex w-[72px] shrink-0 justify-center">
        <button
          type="button"
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/8 active:bg-on-surface/12"
          :title="expanded ? 'Collapse' : 'Expand'"
          @click="$emit('toggle')"
        >
          <MIcon :name="expanded ? 'menu_open' : 'menu'" :size="22" />
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-1 overflow-y-auto p-2 pt-3">
      <template v-if="expanded">
        <div v-for="section in sections" :key="section.title" class="mb-1">
          <button
            type="button"
            class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-label-large font-medium text-on-surface-variant transition-colors hover:bg-on-surface/8"
            @click="toggleSection(section.title)"
          >
            <MIcon :name="section.icon" :size="20" />
            <span class="flex-1 text-left">{{ section.title }}</span>
            <MIcon
              :name="openSections[section.title] ? 'expand_less' : 'expand_more'"
              :size="18"
              class="transition-transform duration-200"
            />
          </button>

          <Transition name="section">
            <div v-if="openSections[section.title]" class="section-grid">
              <div class="section-body">
                <RouterLink
                  v-for="item in section.items"
                  :key="item.to"
                  :to="item.to"
                  class="ml-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-label-large transition-colors"
                  :class="
                    isActive(item.to)
                      ? 'bg-secondary-container text-on-secondary-container font-medium'
                      : 'text-on-surface-variant hover:bg-on-surface/8 active:bg-on-surface/12'
                  "
                >
                  <MIcon :name="item.icon" :size="20" />
                  <span>{{ item.label }}</span>
                </RouterLink>
              </div>
            </div>
          </Transition>
        </div>
      </template>

      <template v-else>
        <RouterLink
          v-for="section in sections"
          :key="section.title"
          :to="section.items[0]?.to ?? '/'"
          :title="section.title"
          class="flex h-14 items-center justify-center rounded-2xl transition-colors"
          :class="
            section.items.some((it) => isActive(it.to))
              ? 'bg-secondary-container text-on-secondary-container'
              : 'text-on-surface-variant hover:bg-on-surface/8'
          "
        >
          <MIcon :name="section.icon" :size="24" />
        </RouterLink>
      </template>
    </div>
  </nav>

  <!-- Mobile drawer -->
  <Teleport to="body">
    <Transition name="drawer" :duration="{ enter: 300, leave: 300 }">
      <div
        v-if="drawerOpen"
        class="fixed inset-0 z-50 flex md:hidden"
        @keydown.esc="$emit('drawerClose')"
      >
        <div
          class="drawer-scrim absolute inset-0 bg-black/40"
          @click="$emit('drawerClose')"
        />

        <nav class="drawer-panel relative flex h-full w-72 max-w-[80vw] flex-col bg-surface-container shadow-elevation-3">
          <div class="flex h-16 shrink-0 items-center justify-between border-b border-outline-variant px-4">
            <div class="flex items-center gap-3">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                <MIcon name="widgets" :size="18" />
              </span>
              <span class="text-title-medium font-medium text-on-surface">M3UI Docs</span>
            </div>
            <button
              type="button"
              class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/8 active:bg-on-surface/12"
              @click="$emit('drawerClose')"
            >
              <MIcon name="close" :size="20" />
            </button>
          </div>

          <div class="flex flex-col gap-1 overflow-y-auto p-3 pt-4">
            <div v-for="section in sections" :key="section.title" class="mb-1">
              <button
                type="button"
                class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-label-large font-medium text-on-surface-variant transition-colors hover:bg-on-surface/8"
                @click="toggleSection(section.title)"
              >
                <MIcon :name="section.icon" :size="20" />
                <span class="flex-1 text-left">{{ section.title }}</span>
                <MIcon
                  :name="openSections[section.title] ? 'expand_less' : 'expand_more'"
                  :size="18"
                  class="transition-transform duration-200"
                />
              </button>

              <Transition name="section">
                <div v-if="openSections[section.title]" class="section-grid">
                  <div class="section-body">
                    <RouterLink
                      v-for="item in section.items"
                      :key="item.to"
                      :to="item.to"
                      class="flex items-center gap-4 rounded-2xl px-4 py-3 text-label-large transition-colors"
                      :class="
                        isActive(item.to)
                          ? 'bg-secondary-container text-on-secondary-container font-medium'
                          : 'text-on-surface-variant hover:bg-on-surface/8 active:bg-on-surface/12'
                      "
                      @click="$emit('drawerClose')"
                    >
                      <MIcon :name="item.icon" :size="24" />
                      <span>{{ item.label }}</span>
                    </RouterLink>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </nav>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Section collapse animation */
.section-grid {
  display: grid;
  grid-template-rows: 1fr;
}

.section-body {
  min-height: 0;
  overflow: hidden;
}

.section-enter-active {
  transition: grid-template-rows 250ms cubic-bezier(0.2, 0, 0, 1);
}
.section-enter-active > .section-body {
  transition: opacity 200ms;
}
.section-enter-from {
  grid-template-rows: 0fr;
}
.section-enter-from > .section-body {
  opacity: 0;
}

.section-leave-active {
  transition: grid-template-rows 200ms cubic-bezier(0.4, 0, 1, 1);
}
.section-leave-active > .section-body {
  transition: opacity 150ms;
}
.section-leave-to {
  grid-template-rows: 0fr;
}
.section-leave-to > .section-body {
  opacity: 0;
}

/* Drawer transitions */
.drawer-scrim {
  transition: opacity 300ms ease;
}
.drawer-enter-from .drawer-scrim,
.drawer-leave-to .drawer-scrim {
  opacity: 0;
}

.drawer-panel {
  transition: transform 300ms cubic-bezier(0.2, 0, 0, 1);
}
.drawer-enter-from .drawer-panel,
.drawer-leave-to .drawer-panel {
  transform: translateX(-100%);
}
</style>
