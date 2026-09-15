<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import AppShell from '@/components/layout/AppShell.vue'
import { palettes, useColorPalette, MPageProgress, MSpotlightSearch } from '@m3ui-vue/m3ui-vue'
import type { SpotlightResult } from '@m3ui-vue/m3ui-vue'
import { pageProgressPosition, pageProgressThickness, pageProgressColor } from '@/composables/usePageProgressDemo'
import { spotlightOpen } from '@/composables/useSpotlightSearch'
import { searchIndex } from '@/nav/sections'

const route = useRoute()
const router = useRouter()
const { set } = useColorPalette()

onMounted(() => {
  const random = palettes[Math.floor(Math.random() * palettes.length)]!.id
  set(random)
})

const spotlightResults = ref<SpotlightResult[]>([])

function onSpotlightSearch(query: string) {
  const q = query.trim().toLowerCase()
  spotlightResults.value = q
    ? searchIndex.filter(r => r.title.toLowerCase().includes(q) || r.category?.toLowerCase().includes(q))
    : []
}

function onSpotlightSelect(result: SpotlightResult) {
  router.push(result.id as string)
}
</script>

<template>
  <MPageProgress :position="pageProgressPosition" :thickness="pageProgressThickness" :color="pageProgressColor" />
  <MSpotlightSearch
    v-model="spotlightOpen"
    :results="spotlightResults"
    placeholder="Search components, composables, pages…"
    @search="onSpotlightSearch"
    @select="onSpotlightSelect"
  />
  <AppShell>
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </AppShell>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
