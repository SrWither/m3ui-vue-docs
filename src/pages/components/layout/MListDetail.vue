<script setup lang="ts">
import { computed, ref } from 'vue'
import { MListDetail, MListItem, MIconButton, MIcon, MAvatar, MSwitch, MChip, MDivider } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import AdaptiveFrame from '@/components/demos/AdaptiveFrame.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const ldProps: PropDef[] = [
  { name: 'showDetail', type: 'boolean', default: 'false', description: 'Whether the detail is the current destination (v-model:showDetail). With one pane it decides which pane shows; with two, both always show' },
  { name: 'listWidth', type: 'string', description: "List pane width with two panes. Defaults to M3's 360px, 412px from the large width class (1200px)" },
]
const ldEvents: EventDef[] = [
  { name: 'update:showDetail', payload: 'boolean', description: 'Emitted with false when the detail slot calls back()' },
]
const ldSlots: SlotDef[] = [
  { name: 'list', scope: '{ twoPane }', description: 'The list pane. Scrolls on its own and keeps its scroll position while the detail is open' },
  { name: 'detail', scope: '{ twoPane, back }', description: 'The detail pane. back() returns to the list; show a back button only when !twoPane' },
]

// Inbox
const mails = [
  { id: 1, from: 'Ana Torres', subject: 'Design review moved to Thursday', preview: 'Hi team, the design review for the checkout flow is moving to Thursday at 10:00…', time: '9:41', unread: true, label: 'Work',
    body: 'Hi team,\n\nThe design review for the checkout flow is moving to Thursday at 10:00, since half of us are at the offsite on Wednesday.\n\nPlease bring the latest prototypes and any open questions about the payment step. I\'ll send the agenda tomorrow.\n\nThanks,\nAna' },
  { id: 2, from: 'Luis Gómez', subject: 'Release notes draft', preview: 'Here is the draft for 2.4. Can you check the part about the new filters?', time: '8:15', unread: true, label: 'Work',
    body: 'Here is the draft for 2.4. Can you check the part about the new filters? I\'m not sure the wording about saved searches is clear enough for people who never used them.\n\nLuis' },
  { id: 3, from: 'Airline', subject: 'Your boarding pass for MAD → LIS', preview: 'Check-in is open. Your seat is 14C, boarding starts at 07:20.', time: 'Yesterday', unread: false, label: 'Travel',
    body: 'Check-in is open for your flight from Madrid to Lisbon.\n\nSeat: 14C\nBoarding: 07:20, gate K42\n\nHave a good trip!' },
  { id: 4, from: 'Marta Ruiz', subject: 'Dinner on Saturday?', preview: 'We were thinking of trying the new place near the park. Are you in?', time: 'Mon', unread: false, label: 'Personal',
    body: 'We were thinking of trying the new place near the park on Saturday around 21:00. Are you in? Bring Pablo if he\'s around.' },
  { id: 5, from: 'Bank', subject: 'Your monthly statement is ready', preview: 'Your statement for September is now available in the app.', time: 'Oct 1', unread: false, label: 'Finance',
    body: 'Your statement for September is now available in the app and online banking.' },
  { id: 6, from: 'Sofía Lima', subject: 'Roadmap Q4', preview: 'I put together a first version of the roadmap, feedback welcome before Friday.', time: 'Sep 29', unread: false, label: 'Work',
    body: 'I put together a first version of the Q4 roadmap. Feedback welcome before Friday, especially on the mobile items.' },
]
const selectedMail = ref<number | null>(1)
const mailOpen = ref(false)
const readIds = ref(new Set<number>())
const mail = computed(() => mails.find((m) => m.id === selectedMail.value))
function openMail(id: number) {
  selectedMail.value = id
  mailOpen.value = true
  readIds.value = new Set(readIds.value).add(id)
}

const inboxCode = `<MListDetail v-model:show-detail="open" class="h-dvh">
  <template #list>
    <MListItem
      v-for="m in mails"
      :key="m.id"
      :title="m.from"
      :subtitle="m.subject"
      :avatar-name="m.from"
      :active="m.id === selectedId"
      clickable
      @click="selectedId = m.id; open = true"
    />
  </template>

  <template #detail="{ twoPane, back }">
    <header class="flex items-center gap-2">
      <!-- Back only matters when the detail replaced the list -->
      <MIconButton v-if="!twoPane" icon="arrow_back" label="Back" @click="back" />
      <h2>{{ mail.subject }}</h2>
    </header>
    <p>{{ mail.body }}</p>
  </template>
</MListDetail>`

// Settings
const sections = [
  { id: 'notifications', label: 'Notifications', icon: 'notifications', desc: 'Push, email, sounds' },
  { id: 'privacy', label: 'Privacy', icon: 'lock', desc: 'Profile visibility, data' },
  { id: 'display', label: 'Display', icon: 'brightness_6', desc: 'Theme, text size' },
  { id: 'storage', label: 'Storage', icon: 'storage', desc: '12.4 GB of 64 GB used' },
]
const section = ref('notifications')
const settingsOpen = ref(false)
const prefs = ref<Record<string, boolean>>({
  push: true, email: false, sounds: true, digest: true,
  publicProfile: false, activity: true, analytics: false,
  dark: false, largeText: false, reduceMotion: false,
  autoClean: true, offline: false,
})
const sectionPrefs: Record<string, { key: string; label: string; hint: string }[]> = {
  notifications: [
    { key: 'push', label: 'Push notifications', hint: 'Messages and mentions' },
    { key: 'email', label: 'Email notifications', hint: 'A copy of every notification' },
    { key: 'sounds', label: 'Sounds', hint: 'Play a sound for new messages' },
    { key: 'digest', label: 'Weekly digest', hint: 'A summary every Monday' },
  ],
  privacy: [
    { key: 'publicProfile', label: 'Public profile', hint: 'Anyone can see your profile' },
    { key: 'activity', label: 'Show activity status', hint: 'Others see when you\'re online' },
    { key: 'analytics', label: 'Share usage data', hint: 'Helps improve the app' },
  ],
  display: [
    { key: 'dark', label: 'Dark theme', hint: 'Easier on the eyes at night' },
    { key: 'largeText', label: 'Large text', hint: 'Bigger body text everywhere' },
    { key: 'reduceMotion', label: 'Reduce motion', hint: 'Fewer animations' },
  ],
  storage: [
    { key: 'autoClean', label: 'Clean up automatically', hint: 'Remove cached files after 30 days' },
    { key: 'offline', label: 'Offline mode', hint: 'Keep recent items on this device' },
  ],
}
const currentSection = computed(() => sections.find((s) => s.id === section.value)!)
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MListDetail</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Material 3's list-detail layout: a list of items and the details of the selected one. When there's room
      (840px and up, the expanded width class) both panes sit side by side; on smaller screens only one shows,
      the detail sliding in over the list when you open an item and back out on <code>back()</code>. It measures
      its own width, so it adapts inside a column or a dialog too. Both panes stay mounted, so the list keeps its
      scroll position. It has no default size: give it a height so each pane scrolls on its own.
    </p>

    <ComponentDemo
      title="Inbox"
      description="A mail client. On Phone the message opens over the list with a back arrow; on Desktop the list stays on the left and the open message is highlighted. Unread mails turn read when opened."
      :code="inboxCode"
    >
      <AdaptiveFrame height="560px" initial="desktop">
        <MListDetail v-model:show-detail="mailOpen" class="h-full bg-surface-container">
          <template #list="{ twoPane }">
            <div class="flex h-full flex-col bg-surface-container">
              <div class="flex items-center gap-2 px-4 pt-4 pb-2">
                <span class="flex-1 text-title-large text-on-surface">Inbox</span>
                <MIconButton icon="search" label="Search" />
              </div>
              <div class="flex-1 px-2 pb-2">
                <div
                  v-for="m in mails"
                  :key="m.id"
                  class="mb-1 cursor-pointer rounded-xl px-3 py-3 transition-colors"
                  :class="twoPane && m.id === selectedMail ? 'bg-secondary-container' : 'bg-surface-container-lowest hover:bg-surface-container-high'"
                  @click="openMail(m.id)"
                >
                  <div class="flex items-start gap-3">
                    <MAvatar :name="m.from" :size="40" />
                    <div class="min-w-0 flex-1">
                      <div class="flex items-baseline gap-2">
                        <span
                          class="flex-1 truncate text-body-large"
                          :class="m.unread && !readIds.has(m.id) ? 'font-semibold text-on-surface' : 'text-on-surface-variant'"
                        >{{ m.from }}</span>
                        <span class="shrink-0 text-label-small text-on-surface-variant">{{ m.time }}</span>
                      </div>
                      <p class="truncate text-body-medium text-on-surface">{{ m.subject }}</p>
                      <p class="truncate text-body-small text-on-surface-variant">{{ m.preview }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #detail="{ twoPane, back }">
            <div v-if="mail" class="@container flex flex-col bg-surface-container-lowest" :class="twoPane ? 'my-2 mr-2 min-h-[calc(100%-1rem)] rounded-2xl' : 'min-h-full'">
              <div class="flex h-16 shrink-0 items-center gap-1 px-1">
                <MIconButton v-if="!twoPane" icon="arrow_back" label="Back" @click="back" />
                <span class="flex-1" />
                <MIconButton icon="archive" label="Archive" />
                <MIconButton icon="delete" label="Delete" />
                <MIconButton icon="more_vert" label="More" />
              </div>
              <div class="px-4 pt-2 pb-8 @lg:px-6">
                <h2 class="mb-4 text-headline-small text-on-surface">{{ mail.subject }}</h2>
                <MChip class="mb-6">{{ mail.label }}</MChip>
                <div class="mb-8 flex items-center gap-3">
                  <MAvatar :name="mail.from" :size="40" />
                  <div class="min-w-0 flex-1">
                    <p class="text-title-small text-on-surface">{{ mail.from }}</p>
                    <p class="text-body-small text-on-surface-variant">to me · {{ mail.time }}</p>
                  </div>
                  <MIconButton icon="reply" label="Reply" variant="tonal" />
                </div>
                <p class="whitespace-pre-line text-body-large text-on-surface">{{ mail.body }}</p>
              </div>
            </div>
          </template>
        </MListDetail>
      </AdaptiveFrame>
    </ComponentDemo>

    <ComponentDemo
      title="Settings"
      description="A settings screen: sections on the left, their options on the right. On Phone a section opens as its own page; the switches keep their values whichever layout you're in."
      :code="`<MListDetail v-model:show-detail=&quot;open&quot; list-width=&quot;300px&quot;>
  <template #list>
    <MListItem
      v-for=&quot;s in sections&quot;
      :key=&quot;s.id&quot;
      :title=&quot;s.label&quot;
      :subtitle=&quot;s.desc&quot;
      :icon=&quot;s.icon&quot;
      :active=&quot;s.id === section&quot;
      clickable
      @click=&quot;section = s.id; open = true&quot;
    />
  </template>
  <template #detail=&quot;{ twoPane, back }&quot;>
    <MIconButton v-if=&quot;!twoPane&quot; icon=&quot;arrow_back&quot; label=&quot;Back&quot; @click=&quot;back&quot; />
    <MSwitch v-for=&quot;p in prefsOf(section)&quot; :key=&quot;p.key&quot; v-model=&quot;prefs[p.key]&quot; :label=&quot;p.label&quot; />
  </template>
</MListDetail>`"
    >
      <AdaptiveFrame height="440px" initial="tablet">
        <MListDetail v-model:show-detail="settingsOpen" list-width="300px" class="h-full">
          <template #list="{ twoPane }">
            <div class="py-2">
              <p class="px-4 pt-2 pb-3 text-title-large text-on-surface">Settings</p>
              <MListItem
                v-for="s in sections"
                :key="s.id"
                :title="s.label"
                :subtitle="s.desc"
                :icon="s.icon"
                :active="twoPane && s.id === section"
                :trailing-icon="twoPane ? undefined : 'chevron_right'"
                clickable
                @click="section = s.id; settingsOpen = true"
              />
            </div>
          </template>
          <template #detail="{ twoPane, back }">
            <div class="h-full py-2" :class="twoPane ? 'border-l border-outline-variant' : ''">
              <div class="flex items-center gap-2 px-2 pt-1 pb-2" :class="twoPane ? 'pl-4' : ''">
                <MIconButton v-if="!twoPane" icon="arrow_back" label="Back" @click="back" />
                <MIcon :name="currentSection.icon" class="text-primary" />
                <span class="text-title-large text-on-surface">{{ currentSection.label }}</span>
              </div>
              <template v-for="(p, i) in sectionPrefs[section]" :key="p.key">
                <MDivider v-if="i" class="mx-4" />
                <div class="flex items-center gap-4 px-4 py-3">
                  <div class="min-w-0 flex-1">
                    <p class="text-body-large text-on-surface">{{ p.label }}</p>
                    <p class="text-body-medium text-on-surface-variant">{{ p.hint }}</p>
                  </div>
                  <MSwitch v-model="prefs[p.key]!" :aria-label="p.label" />
                </div>
              </template>
            </div>
          </template>
        </MListDetail>
      </AdaptiveFrame>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="ldProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="ldEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="ldSlots" />

    <ComponentPager current="MListDetail" />
  </div>
</template>
