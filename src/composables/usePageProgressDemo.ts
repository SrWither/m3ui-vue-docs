import { ref } from 'vue'

// Module-level so App.vue's real <MPageProgress /> and the demo controls on
// FeedbackPage.vue share the same state — changing it in the demo moves/resizes
// the actual site-wide bar, which is the whole point of the demo.
export const pageProgressPosition = ref<'top' | 'bottom'>('top')
export const pageProgressThickness = ref(3)
export const pageProgressColor = ref<'primary' | 'secondary' | 'tertiary' | 'error'>('primary')
