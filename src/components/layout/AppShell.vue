<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { MAppLayout } from '@m3ui-vue/m3ui-vue'
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
  <MAppLayout>
    <template #drawer>
      <SideNav
        :expanded="expanded"
        :drawer-open="drawerOpen"
        @toggle="expanded = !expanded"
        @drawer-close="drawerOpen = false"
      />
    </template>

    <template #header>
      <TopAppBar @menu-click="drawerOpen = true" />
    </template>

    <div ref="mainEl" class="mx-auto max-w-5xl p-4 pb-8 md:p-8">
      <slot />
    </div>
  </MAppLayout>
</template>
