<script setup lang="ts">
import { computed } from 'vue'
import { MEmptyState } from '@m3ui-vue/m3ui-vue'
import { usePlaza } from '../usePlaza'
import AppHeader from '../components/AppHeader.vue'
import PostCard from '../components/PostCard.vue'

const { bookmarked } = usePlaza()
const ids = computed(() => [...bookmarked].reverse())
</script>

<template>
  <div class="h-full overflow-y-auto">
    <AppHeader title="Bookmarks" :subtitle="`${ids.length} saved`" />
    <PostCard v-for="id in ids" :key="id" :id="id" />
    <MEmptyState v-if="!ids.length" icon="bookmark" title="Save posts for later" description="Tap the bookmark on any post to find it here again." />
  </div>
</template>
