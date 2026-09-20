<script setup lang="ts">
import { computed, watch, ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { MNavigationDrawer, MIcon, MIconButton, MFlex } from '@m3ui-vue/m3ui-vue'
import { sections } from '@/nav/sections'

defineProps<{ expanded?: boolean; drawerOpen?: boolean }>()
defineEmits<{ toggle: []; drawerClose: [] }>()

const route = useRoute()
const selected = computed(() => route.hash ? route.path + route.hash : route.path)
const desktopDrawer = ref<InstanceType<typeof MNavigationDrawer>>()
const mobileDrawer = ref<InstanceType<typeof MNavigationDrawer>>()

function syncDrawer(drawer: InstanceType<typeof MNavigationDrawer> | undefined, path: string) {
  const oi = drawer?.openItems
  if (!oi) return
  for (const key of Object.keys(oi)) oi[key] = false
  const allItems = sections.flatMap(s => s.items)
  // Exact match covers hash-anchored (not-yet-migrated) sections, whose route path
  // never changes as you scroll between anchors. startsWith covers migrated sections,
  // where each component now lives on its own sub-route (e.g. /components/buttons/mfab)
  // instead of staying on the section's own path.
  const match = allItems.find(i => i.children?.length && (i.value === path || path.startsWith(`${i.value}/`)))
  if (match) oi[match.value] = true
}

watch(() => route.path, (path) => {
  nextTick(() => {
    syncDrawer(desktopDrawer.value, path)
    syncDrawer(mobileDrawer.value, path)
  })
}, { immediate: true })
</script>

<template>
  <!-- Desktop sidebar -->
  <div class="hidden h-full md:flex">
    <MNavigationDrawer
      ref="desktopDrawer"
      :model-value="true"
      :modal="false"
      :collapsed="!expanded"
      :selected="selected"
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
    ref="mobileDrawer"
    :model-value="drawerOpen ?? false"
    :sections="sections"
    :selected="selected"
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
