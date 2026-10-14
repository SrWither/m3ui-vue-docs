<script setup lang="ts">
/* Wide screens: Home and Search on top, Your Library below. */
import { MList, MListItem } from '@m3ui-vue/m3ui-vue'
import { useMusic } from '../useMusic'
import LibraryList from './LibraryList.vue'

const { screen, go } = useMusic()
</script>

<template>
  <nav class="flex min-h-0 flex-col gap-2" aria-label="Main">
    <div class="shrink-0 rounded-2xl bg-surface-container-low p-2">
      <MList nav>
        <MListItem title="Home" icon="home" clickable :active="screen.name === 'home'" @click="go({ name: 'home' })" />
        <MListItem title="Search" icon="search" clickable :active="screen.name === 'search'" @click="go({ name: 'search' })" />
      </MList>
    </div>
    <LibraryList class="min-h-0 flex-1 rounded-2xl bg-surface-container-low" />
  </nav>
</template>
