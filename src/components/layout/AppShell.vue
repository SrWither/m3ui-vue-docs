<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import TopAppBar from './TopAppBar.vue'
import SideNav from './SideNav.vue'

const expanded = ref(true)
const drawerOpen = ref(false)
const mainEl = ref<HTMLElement>()
const route = useRoute()

watch(() => route.path, () => {
  mainEl.value?.scrollTo(0, 0)
})
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-surface">
    <SideNav
      :expanded="expanded"
      :drawer-open="drawerOpen"
      @toggle="expanded = !expanded"
      @drawer-close="drawerOpen = false"
    />
    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <TopAppBar @menu-click="drawerOpen = true" />
      <main ref="mainEl" class="flex-1 overflow-auto">
        <div class="mx-auto max-w-5xl p-4 pb-8 md:p-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
