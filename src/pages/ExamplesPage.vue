<script setup lang="ts">
import { ref } from 'vue'
import {
  MCard, MButton, MIconButton, MIcon, MAvatar, MBadge, MDivider,
  MAppBar, MNavigationDrawer, MTextField, MSelect, MSwitch,
  MCheckbox, MFab, MChip, MStatCard, MTooltip,
} from '@m3ui-vue/m3ui-vue'
import type { DrawerSection } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'

// ── Drawer Layout ──
const drawerOpen = ref(true)
const drawerSelected = ref('inbox')
const drawerSections: DrawerSection[] = [
  {
    items: [
      { value: 'inbox', label: 'Inbox', icon: 'inbox', badge: 24 },
      { value: 'starred', label: 'Starred', icon: 'star' },
      { value: 'sent', label: 'Sent', icon: 'send' },
      { value: 'drafts', label: 'Drafts', icon: 'drafts', badge: 3 },
    ],
  },
  {
    title: 'Labels',
    collapsible: true,
    icon: 'label',
    items: [
      { value: 'work', label: 'Work', icon: 'work' },
      { value: 'personal', label: 'Personal', icon: 'person' },
      { value: 'travel', label: 'Travel', icon: 'flight' },
    ],
  },
]

// ── Dashboard Layout ──
const dashboardDrawerCollapsed = ref(false)
const dashboardSelected = ref<string | number>('overview')
const dashboardSections: DrawerSection[] = [
  {
    items: [
      { value: 'overview', label: 'Overview', icon: 'dashboard' },
      { value: 'analytics', label: 'Analytics', icon: 'analytics' },
      { value: 'users', label: 'Users', icon: 'group' },
      { value: 'settings', label: 'Settings', icon: 'settings' },
    ],
  },
]

// ── Form Page ──
const formName = ref('')
const formEmail = ref('')
const formRole = ref<string | number | null>(null)
const formBio = ref('')
const formNotifications = ref(true)
const formNewsletter = ref(false)
const roleOptions = [
  { label: 'Developer', value: 'developer' },
  { label: 'Designer', value: 'designer' },
  { label: 'Manager', value: 'manager' },
  { label: 'Other', value: 'other' },
]
</script>

<template>
  <div class="flex flex-col">
    <div class="mb-10 text-center self-center">
      <h1 class="text-display-small font-medium text-on-surface">Examples</h1>
      <p class="mx-auto mt-3 max-w-2xl text-body-large text-on-surface-variant">
        Full-page layout examples showing how to compose multiple components together.
      </p>
    </div>

    <!-- ── Drawer Layout ─────────────────────────────────────────── -->
    <h2 class="mb-4 w-full text-headline-small font-medium">Drawer Layout</h2>

    <ComponentDemo
      title="Mail App"
      description="A classic Material navigation drawer with profile header, badges, and collapsible sections."
      flush
      :code="`<template>
  <div class=&quot;flex h-[480px] overflow-hidden rounded-xl border border-outline-variant&quot;>
    <MNavigationDrawer
      :model-value=&quot;open&quot;
      :modal=&quot;false&quot;
      :selected=&quot;selected&quot;
      :sections=&quot;sections&quot;
      @select=&quot;selected = $event&quot;
    >
      <template #header>
        <div class=&quot;px-4 pt-5 pb-3&quot;>
          <MAvatar name=&quot;Sarah Chen&quot; :size=&quot;56&quot; />
          <h3 class=&quot;mt-3 text-title-medium font-medium&quot;>Sarah Chen</h3>
          <p class=&quot;text-body-small text-on-surface-variant&quot;>sarah@example.com</p>
        </div>
      </template>
    </MNavigationDrawer>

    <div class=&quot;flex min-w-0 flex-1 flex-col&quot;>
      <MAppBar elevated>
        <template #leading>
          <MIconButton
            :icon=&quot;open ? 'menu_open' : 'menu'&quot;
            @click=&quot;open = !open&quot;
          />
        </template>
        <span class=&quot;text-title-large font-medium&quot;>Inbox</span>
        <template #trailing>
          <MIconButton icon=&quot;search&quot; />
          <MIconButton icon=&quot;more_vert&quot; />
        </template>
      </MAppBar>
      <div class=&quot;relative flex-1 overflow-auto bg-surface-container-lowest p-6&quot;>
        &lt;!-- Content --&gt;
        <MFab icon=&quot;edit&quot; class=&quot;!absolute right-6 bottom-6&quot; />
      </div>
    </div>
  </div>
</template>`"
    >
      <div class="flex h-160 overflow-hidden rounded-b-md">
        <MNavigationDrawer
          :model-value="drawerOpen"
          :modal="false"
          :selected="drawerSelected"
          :sections="drawerSections"
          @select="drawerSelected = String($event)"
        >
          <template #header>
            <div class="px-4 pt-5 pb-3">
              <MAvatar name="Sarah Chen" :size="56" />
              <h3 class="mt-3 text-title-medium font-medium text-on-surface">Sarah Chen</h3>
              <p class="text-body-small text-on-surface-variant">sarah@example.com</p>
            </div>
          </template>
        </MNavigationDrawer>

        <div class="relative flex min-w-0 flex-1 flex-col">
          <MAppBar elevated>
            <template #leading>
              <MIconButton :icon="drawerOpen ? 'menu_open' : 'menu'" @click="drawerOpen = !drawerOpen" label="Toggle drawer" />
            </template>
            <span class="text-title-large font-medium">{{ drawerSections.flatMap(s => s.items).find(i => i.value === drawerSelected)?.label ?? 'Inbox' }}</span>
            <template #trailing>
              <MTooltip text="Search">
                <MIconButton icon="search" label="Search" />
              </MTooltip>
              <MTooltip text="More">
                <MIconButton icon="more_vert" label="More" />
              </MTooltip>
            </template>
          </MAppBar>

          <div class="flex-1 overflow-auto bg-surface-container-lowest p-6">
            <div class="flex flex-col gap-3">
              <MCard v-for="i in 4" :key="i" clickable class="p-4">
                <div class="flex items-start gap-3">
                  <MAvatar :name="['Alex Rivera', 'Jordan Lee', 'Morgan Park', 'Casey Quinn'][i - 1] ?? ''" :size="40" />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between">
                      <span class="text-title-small font-medium">{{ ['Alex Rivera', 'Jordan Lee', 'Morgan Park', 'Casey Quinn'][i - 1] }}</span>
                      <span class="text-body-small text-on-surface-variant">{{ ['2m', '1h', '3h', 'Yesterday'][i - 1] }}</span>
                    </div>
                    <p class="text-body-medium font-medium">{{ ['Project update', 'Meeting notes', 'Design review', 'Weekly report'][i - 1] }}</p>
                    <p class="truncate text-body-small text-on-surface-variant">{{ ['Hey, I just pushed the latest changes to the repo...', 'Here are the notes from today\'s standup meeting...', 'Could you review the new mockups I uploaded?', 'Attached is the weekly progress report for...'][i - 1] }}</p>
                  </div>
                </div>
              </MCard>
            </div>
          </div>
          <div class="absolute right-6 bottom-6 z-10">
            <MFab icon="edit" />
          </div>
        </div>
      </div>
    </ComponentDemo>

    <!-- ── Dashboard Layout ───────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 w-full text-headline-small font-medium">Dashboard Layout</h2>

    <ComponentDemo
      title="Analytics Dashboard"
      description="App bar, collapsible sidebar, stat cards, and content area."
      flush
      :code="`<template>
  <div class=&quot;flex h-[700px] overflow-hidden rounded-xl border border-outline-variant&quot;>
    <MNavigationDrawer
      :model-value=&quot;true&quot;
      :modal=&quot;false&quot;
      :collapsed=&quot;collapsed&quot;
      :selected=&quot;selected&quot;
      :sections=&quot;sections&quot;
      @select=&quot;selected = $event&quot;
    >
      <template #header>
        <div class=&quot;flex h-16 items-center border-b border-outline-variant&quot;>
          <div class=&quot;flex w-[72px] shrink-0 justify-center&quot;>
            <MIconButton
              :icon=&quot;collapsed ? 'menu' : 'menu_open'&quot;
              @click=&quot;collapsed = !collapsed&quot;
            />
          </div>
        </div>
      </template>
    </MNavigationDrawer>

    <div class=&quot;flex min-w-0 flex-1 flex-col bg-surface-container-lowest&quot;>
      <MAppBar>
        <span class=&quot;text-title-large font-medium&quot;>Dashboard</span>
        <template #trailing>
          <MAvatar name=&quot;Admin User&quot; :size=&quot;32&quot; />
        </template>
      </MAppBar>
      <div class=&quot;flex-1 overflow-auto p-6&quot;>
        &lt;!-- Stats + content --&gt;
      </div>
    </div>
  </div>
</template>`"
    >
      <div class="flex h-160 overflow-hidden rounded-b-md">
        <MNavigationDrawer
          :model-value="true"
          :modal="false"
          :collapsed="dashboardDrawerCollapsed"
          :selected="dashboardSelected"
          :sections="dashboardSections"
          @select="dashboardSelected = $event"
        >
          <template #header>
            <div class="flex h-16 items-center border-b border-outline-variant">
              <div class="flex w-18 shrink-0 justify-center">
                <MIconButton
                  :icon="dashboardDrawerCollapsed ? 'menu' : 'menu_open'"
                  @click="dashboardDrawerCollapsed = !dashboardDrawerCollapsed"
                  label="Toggle drawer"
                />
              </div>
            </div>
          </template>
        </MNavigationDrawer>

        <div class="flex min-w-0 flex-1 flex-col bg-surface-container-lowest">
          <MAppBar>
            <span class="text-title-large font-medium">{{ dashboardSections[0]!.items.find(i => i.value === dashboardSelected)?.label ?? 'Overview' }}</span>
            <template #trailing>
              <MTooltip text="Notifications">
                <MBadge :count="5">
                  <MIconButton icon="notifications" label="Notifications" />
                </MBadge>
              </MTooltip>
              <MAvatar name="Admin User" :size="32" />
            </template>
          </MAppBar>

          <div class="flex-1 overflow-auto p-6">
            <div class="grid grid-cols-2 gap-4">
              <MStatCard title="Total Users" value="12,847" icon="group" :trend="12.5" trend-label="vs last month" color="primary" />
              <MStatCard title="Revenue" value="$48.2K" icon="payments" :trend="8.1" trend-label="vs last month" color="secondary" />
              <MStatCard title="Orders" value="1,432" icon="shopping_cart" :trend="-2.3" trend-label="vs last month" color="tertiary" />
              <MStatCard title="Conversion" value="3.24%" icon="trending_up" :trend="0.8" trend-label="vs last month" color="success" />
            </div>

            <div class="mt-6 grid gap-4 lg:grid-cols-3">
              <MCard class="lg:col-span-2" title="Recent Activity" subtitle="Last 7 days">
                <div class="flex flex-col gap-3 px-4 pb-4">
                  <div v-for="(item, i) in [
                    { name: 'New signup', desc: 'john@example.com registered', icon: 'person_add', time: '5m ago' },
                    { name: 'Payment received', desc: 'Order #1234 — $299.00', icon: 'payment', time: '23m ago' },
                    { name: 'Report generated', desc: 'Monthly analytics report', icon: 'description', time: '1h ago' },
                    { name: 'Server alert', desc: 'CPU usage exceeded 90%', icon: 'warning', time: '2h ago' },
                  ]" :key="i" class="flex items-center gap-3">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-container">
                      <MIcon :name="item.icon" :size="18" class="text-on-primary-container" />
                    </span>
                    <div class="min-w-0 flex-1">
                      <p class="text-body-medium font-medium">{{ item.name }}</p>
                      <p class="text-body-small text-on-surface-variant">{{ item.desc }}</p>
                    </div>
                    <span class="shrink-0 text-body-small text-on-surface-variant">{{ item.time }}</span>
                  </div>
                </div>
              </MCard>

              <MCard title="Top Pages" subtitle="Most visited">
                <div class="flex flex-col gap-2 px-4 pb-4">
                  <div v-for="(page, i) in [
                    { path: '/home', views: '4,231' },
                    { path: '/products', views: '3,102' },
                    { path: '/pricing', views: '2,847' },
                    { path: '/docs', views: '1,923' },
                  ]" :key="i" class="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-on-surface/4">
                    <span class="text-body-medium">{{ page.path }}</span>
                    <span class="text-body-small text-on-surface-variant">{{ page.views }}</span>
                  </div>
                </div>
              </MCard>
            </div>
          </div>
        </div>
      </div>
    </ComponentDemo>

    <!-- ── Form Page ──────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 w-full text-headline-small font-medium">Form Page</h2>

    <ComponentDemo
      title="Profile Settings"
      description="Complete form layout with text fields, select, toggles, and action buttons."
      :code="`<template>
  <MCard class=&quot;w-full max-w-lg&quot;>
    <template #header>
      <div class=&quot;flex items-center gap-4&quot;>
        <MAvatar name=&quot;Alex Morgan&quot; :size=&quot;56&quot; />
        <div>
          <h3 class=&quot;text-title-large font-medium&quot;>Edit Profile</h3>
          <p class=&quot;text-body-small text-on-surface-variant&quot;>Update your personal information</p>
        </div>
      </div>
    </template>

    <div class=&quot;flex flex-col gap-5 px-4 pb-2&quot;>
      <MTextField v-model=&quot;name&quot; label=&quot;Full Name&quot; variant=&quot;outlined&quot; leading-icon=&quot;person&quot; />
      <MTextField v-model=&quot;email&quot; label=&quot;Email&quot; type=&quot;email&quot; variant=&quot;outlined&quot; leading-icon=&quot;mail&quot; />
      <MSelect v-model=&quot;role&quot; :options=&quot;roles&quot; label=&quot;Role&quot; variant=&quot;outlined&quot; leading-icon=&quot;badge&quot; />
      <MTextField v-model=&quot;bio&quot; label=&quot;Bio&quot; variant=&quot;outlined&quot; multiline :rows=&quot;3&quot; />
      <MDivider />
      <MSwitch v-model=&quot;notifications&quot; label=&quot;Push notifications&quot; />
      <MCheckbox v-model=&quot;newsletter&quot; label=&quot;Subscribe to newsletter&quot; />
    </div>

    <template #actions>
      <MButton variant=&quot;text&quot;>Cancel</MButton>
      <MButton>Save Changes</MButton>
    </template>
  </MCard>
</template>`"
    >
      <MCard class="mx-auto w-full max-w-lg">
        <template #header>
          <div class="flex items-center gap-4">
            <MAvatar name="Alex Morgan" :size="56" />
            <div>
              <h3 class="text-title-large font-medium">Edit Profile</h3>
              <p class="text-body-small text-on-surface-variant">Update your personal information</p>
            </div>
          </div>
        </template>

        <div class="flex flex-col gap-5 px-4 pb-2">
          <MTextField v-model="formName" label="Full Name" variant="outlined" leading-icon="person" />
          <MTextField v-model="formEmail" label="Email" type="email" variant="outlined" leading-icon="mail" />
          <MSelect v-model="formRole" :options="roleOptions" label="Role" variant="outlined" leading-icon="badge" />
          <MTextField v-model="formBio" label="Bio" variant="outlined" multiline :rows="3" />
          <MDivider />
          <MSwitch v-model="formNotifications" label="Push notifications" />
          <MCheckbox v-model="formNewsletter" label="Subscribe to newsletter" />
        </div>

        <template #actions>
          <MButton variant="text">Cancel</MButton>
          <MButton>Save Changes</MButton>
        </template>
      </MCard>
    </ComponentDemo>
  </div>
</template>
