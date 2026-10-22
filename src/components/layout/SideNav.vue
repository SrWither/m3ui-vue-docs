<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { MNavigationDrawer, MIcon, MIconButton, MFlex } from '@m3ui-vue/m3ui-vue'
import { sections } from '@/nav/sections'

defineProps<{ expanded?: boolean; drawerOpen?: boolean }>()
defineEmits<{ toggle: []; drawerClose: [] }>()

const route = useRoute()
// The drawer opens the group holding the current page itself (expandSelected), one group at a time (accordion)
const selected = computed(() => route.path)
</script>

<template>
  <!-- Desktop sidebar -->
  <div class="hidden h-full md:flex">
    <MNavigationDrawer
      :model-value="true"
      :modal="false"
      :collapsed="!expanded"
      :selected="selected"
      accordion
      :sections="sections"
      width="18rem"
    >
      <template #toggle>
        <MIconButton
          :icon="expanded ? 'menu_open' : 'menu'"
          :label="expanded ? 'Collapse' : 'Expand'"
          @click="$emit('toggle')"
        />
      </template>
    </MNavigationDrawer>
  </div>

  <!-- Mobile drawer -->
  <MNavigationDrawer
    :model-value="drawerOpen ?? false"
    :sections="sections"
    :selected="selected"
    accordion
    width="18rem"
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
