import { ref } from 'vue'

// Module-level so the trigger button in TopAppBar and the actual
// <MSpotlightSearch> mounted once in App.vue share the same open state
// without threading props/events through AppShell.
export const spotlightOpen = ref(false)
