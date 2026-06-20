<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { MNavigationDrawer, MIcon, MIconButton, MFlex } from '@m3ui-vue/m3ui-vue'
import type { DrawerSection } from '@m3ui-vue/m3ui-vue'

defineProps<{ expanded?: boolean; drawerOpen?: boolean }>()
defineEmits<{ toggle: []; drawerClose: [] }>()

const route = useRoute()
const selected = computed(() => route.path)

const sections: DrawerSection[] = [
  {
    title: 'Getting Started',
    icon: 'rocket_launch',
    collapsible: true,
    items: [
      { value: '/', label: 'Introduction', icon: 'home', to: '/' },
      { value: '/getting-started/setup', label: 'Setup', icon: 'build', to: '/getting-started/setup' },
    ],
  },
  {
    title: 'Components',
    icon: 'widgets',
    collapsible: true,
    items: [
      { value: '/components/buttons', label: 'Buttons', icon: 'smart_button', to: '/components/buttons' },
      { value: '/components/inputs', label: 'Inputs', icon: 'input', to: '/components/inputs' },
      { value: '/components/feedback', label: 'Feedback', icon: 'feedback', to: '/components/feedback' },
      { value: '/components/data-display', label: 'Data Display', icon: 'dashboard', to: '/components/data-display' },
      { value: '/components/navigation', label: 'Navigation', icon: 'menu_open', to: '/components/navigation' },
      { value: '/components/layout', label: 'Layout', icon: 'grid_view', to: '/components/layout' },
      { value: '/components/overlays', label: 'Overlays', icon: 'layers', to: '/components/overlays' },
      { value: '/components/tables', label: 'Tables', icon: 'table_chart', to: '/components/tables' },
      { value: '/components/utility', label: 'Utility', icon: 'build', to: '/components/utility' },
      { value: '/components/editors', label: 'Editors', icon: 'code', to: '/components/editors' },
      { value: '/components/advanced', label: 'Advanced', icon: 'auto_awesome', to: '/components/advanced' },
    ],
  },
  {
    title: 'Examples',
    icon: 'design_services',
    collapsible: true,
    items: [
      { value: '/examples', label: 'Layouts', icon: 'view_quilt', to: '/examples' },
      { value: '/examples/apps', label: 'Apps', icon: 'devices', to: '/examples/apps' },
    ],
  },
  {
    title: 'Styles',
    icon: 'palette',
    collapsible: true,
    items: [
      { value: '/styles/palettes', label: 'Palettes', icon: 'color_lens', to: '/styles/palettes' },
    ],
  },
]
</script>

<template>
  <!-- Desktop sidebar -->
  <div class="hidden h-full md:flex">
    <MNavigationDrawer
      :model-value="true"
      :modal="false"
      :collapsed="!expanded"
      :selected="selected"
      :sections="sections"
    >
      <template #header>
        <div class="shrink-0 border-b border-outline-variant">
          <MFlex align="center" class="h-16">
            <div class="flex w-[72px] shrink-0 justify-center">
              <MIconButton
                :icon="expanded ? 'menu_open' : 'menu'"
                :label="expanded ? 'Collapse' : 'Expand'"
                @click="$emit('toggle')"
              />
            </div>
          </MFlex>
        </div>
      </template>
    </MNavigationDrawer>
  </div>

  <!-- Mobile drawer -->
  <MNavigationDrawer
    :model-value="drawerOpen ?? false"
    :sections="sections"
    :selected="selected"
    @update:model-value="!$event && $emit('drawerClose')"
  >
    <template #header>
      <MFlex align="center" justify="between" class="px-4 pt-5 pb-2">
        <MFlex align="center" gap="sm">
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
            <MIcon name="widgets" :size="18" />
          </span>
          <span class="text-title-medium font-medium text-on-surface">M3UI Docs</span>
        </MFlex>
        <MIconButton icon="close" label="Close menu" @click="$emit('drawerClose')" />
      </MFlex>
    </template>
  </MNavigationDrawer>
</template>
