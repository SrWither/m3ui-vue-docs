<script setup lang="ts">
import { ref } from 'vue'
import {
  MCard, MButton, MIconButton, MIcon, MAvatar, MBadge, MDivider,
  MAppBar, MNavigationDrawer, MTextField, MSelect, MSwitch,
  MCheckbox, MFab, MChip, MStatCard, MTooltip,
  MText, MTitle, MSubtitle, MFlex, MSpacer, MBox, MSection,
  MList, MListItem, MListSubheader, MGrid, MScrollable, MRelative, MAbsolute,
  MStack, MCenter, MAppLayout,
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

const mailItems = [
  { name: 'Alex Rivera', subject: 'Project update', preview: 'Hey, I just pushed the latest changes to the repo...', time: '2m' },
  { name: 'Jordan Lee', subject: 'Meeting notes', preview: 'Here are the notes from today\'s standup meeting...', time: '1h' },
  { name: 'Morgan Park', subject: 'Design review', preview: 'Could you review the new mockups I uploaded?', time: '3h' },
  { name: 'Casey Quinn', subject: 'Weekly report', preview: 'Attached is the weekly progress report for...', time: 'Yesterday' },
]

const activityItems = [
  { name: 'New signup', desc: 'john@example.com registered', icon: 'person_add', time: '5m ago' },
  { name: 'Payment received', desc: 'Order #1234 — $299.00', icon: 'payment', time: '23m ago' },
  { name: 'Report generated', desc: 'Monthly analytics report', icon: 'description', time: '1h ago' },
  { name: 'Server alert', desc: 'CPU usage exceeded 90%', icon: 'warning', time: '2h ago' },
]

const topPages = [
  { path: '/home', views: '4,231' },
  { path: '/products', views: '3,102' },
  { path: '/pricing', views: '2,847' },
  { path: '/docs', views: '1,923' },
]
</script>

<template>
  <div>
    <MCenter class="mb-10">
      <MStack align="center">
        <MText variant="display-small" weight="medium">Examples</MText>
        <MSubtitle align="center">
          Full-page layout examples showing how to compose multiple components together.
        </MSubtitle>
      </MStack>
    </MCenter>

    <!-- ── Drawer Layout ─────────────────────────────────────────── -->
    <MSection title="Drawer Layout" title-variant="headline-small">

      <ComponentDemo
        title="Mail App"
        description="A classic Material navigation drawer with profile header, badges, and collapsible sections."
        flush
        :code="`<template>
  <MAppLayout height=&quot;480px&quot;>
    <template #drawer>
      <MNavigationDrawer
        :model-value=&quot;open&quot;
        :modal=&quot;false&quot;
        :selected=&quot;selected&quot;
        :sections=&quot;sections&quot;
        @select=&quot;selected = $event&quot;
      >
        <template #header>
          <MStack gap=&quot;xs&quot; class=&quot;px-4 pt-5 pb-3&quot;>
            <MAvatar name=&quot;Sarah Chen&quot; :size=&quot;56&quot; />
            <MText variant=&quot;title-medium&quot; weight=&quot;medium&quot;>Sarah Chen</MText>
            <MSubtitle size=&quot;small&quot;>sarah@example.com</MSubtitle>
          </MStack>
        </template>
      </MNavigationDrawer>
    </template>

    <template #header>
      <MAppBar elevated>
        <template #leading>
          <MIconButton :icon=&quot;open ? 'menu_open' : 'menu'&quot; @click=&quot;open = !open&quot; />
        </template>
        <MText variant=&quot;title-large&quot; weight=&quot;medium&quot;>Inbox</MText>
        <template #trailing>
          <MIconButton icon=&quot;search&quot; />
          <MIconButton icon=&quot;more_vert&quot; />
        </template>
      </MAppBar>
    </template>

    <MBox surface=&quot;container-lowest&quot; padding=&quot;lg&quot;>
      <MStack gap=&quot;sm&quot;>
        <MCard v-for=&quot;mail in mails&quot; :key=&quot;mail.name&quot; clickable>
          <MFlex gap=&quot;sm&quot; class=&quot;p-4&quot;>
            <MAvatar :name=&quot;mail.name&quot; :size=&quot;40&quot; />
            <MStack gap=&quot;none&quot; class=&quot;min-w-0 flex-1&quot;>
              <MFlex justify=&quot;between&quot; align=&quot;center&quot;>
                <MText variant=&quot;title-small&quot; weight=&quot;medium&quot;>{{ mail.name }}</MText>
                <MText variant=&quot;body-small&quot; color=&quot;on-surface-variant&quot;>{{ mail.time }}</MText>
              </MFlex>
              <MText variant=&quot;body-medium&quot; weight=&quot;medium&quot;>{{ mail.subject }}</MText>
              <MText variant=&quot;body-small&quot; color=&quot;on-surface-variant&quot; :truncate=&quot;true&quot;>{{ mail.preview }}</MText>
            </MStack>
          </MFlex>
        </MCard>
      </MStack>
    </MBox>

    <template #fab>
      <MAbsolute placement=&quot;bottom-right&quot; :offset=&quot;24&quot;>
        <MFab icon=&quot;edit&quot; />
      </MAbsolute>
    </template>
  </MAppLayout>
</template>`"
        :script="`import { ref } from 'vue'
import {
  MAppLayout, MNavigationDrawer, MAppBar, MIconButton, MTooltip,
  MAvatar, MFab, MCard, MText, MSubtitle, MFlex, MStack, MBox,
  MAbsolute,
} from '@m3ui-vue/m3ui-vue'
import type { DrawerSection } from '@m3ui-vue/m3ui-vue'

const open = ref(true)
const selected = ref('inbox')

const sections: DrawerSection[] = [
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
    ],
  },
]

interface Mail {
  name: string
  subject: string
  preview: string
  time: string
}

const mails: Mail[] = [
  { name: 'Alex Rivera', subject: 'Project update', preview: 'Hey, I just pushed the latest changes...', time: '2m' },
  { name: 'Jordan Lee', subject: 'Meeting notes', preview: 'Here are the notes from today\\'s standup...', time: '1h' },
]`"
      >
        <div class="h-160 overflow-hidden rounded-b-md">
          <MAppLayout height="100%">
            <template #drawer>
              <MNavigationDrawer
                :model-value="drawerOpen"
                :modal="false"
                :selected="drawerSelected"
                :sections="drawerSections"
                @select="drawerSelected = String($event)"
              >
                <template #header>
                  <MStack gap="xs" class="px-4 pt-5 pb-3">
                    <MAvatar name="Sarah Chen" :size="56" />
                    <MText variant="title-medium" weight="medium" class="mt-3">Sarah Chen</MText>
                    <MSubtitle size="small">sarah@example.com</MSubtitle>
                  </MStack>
                </template>
              </MNavigationDrawer>
            </template>

            <template #header>
              <MAppBar elevated>
                <template #leading>
                  <MIconButton :icon="drawerOpen ? 'menu_open' : 'menu'" @click="drawerOpen = !drawerOpen" label="Toggle drawer" />
                </template>
                <MText variant="title-large" weight="medium">
                  {{ drawerSections.flatMap(s => s.items).find(i => i.value === drawerSelected)?.label ?? 'Inbox' }}
                </MText>
                <template #trailing>
                  <MTooltip text="Search">
                    <MIconButton icon="search" label="Search" />
                  </MTooltip>
                  <MTooltip text="More">
                    <MIconButton icon="more_vert" label="More" />
                  </MTooltip>
                </template>
              </MAppBar>
            </template>

            <MBox surface="container-low" padding="lg">
              <MStack gap="sm">
                <MCard v-for="(mail, i) in mailItems" :key="i" clickable>
                  <MFlex gap="sm" class="p-4">
                    <MAvatar :name="mail.name" :size="40" />
                    <MStack gap="none" class="min-w-0 flex-1">
                      <MFlex justify="between" align="center">
                        <MText variant="title-small" weight="medium">{{ mail.name }}</MText>
                        <MText variant="body-small" color="on-surface-variant">{{ mail.time }}</MText>
                      </MFlex>
                      <MText variant="body-medium" weight="medium">{{ mail.subject }}</MText>
                      <MText variant="body-small" color="on-surface-variant" :truncate="true">{{ mail.preview }}</MText>
                    </MStack>
                  </MFlex>
                </MCard>
              </MStack>
            </MBox>

            <template #fab>
              <MAbsolute placement="bottom-right" :offset="24">
                <MFab icon="edit" />
              </MAbsolute>
            </template>
          </MAppLayout>
        </div>
      </ComponentDemo>
    </MSection>

    <!-- ── Dashboard Layout ───────────────────────────────────────── -->
    <MSection title="Dashboard Layout" title-variant="headline-small" class="mt-14">

      <ComponentDemo
        title="Analytics Dashboard"
        description="App bar, collapsible sidebar, stat cards, and content area."
        flush
        :code="`<template>
  <MAppLayout>
    <template #drawer>
      <MNavigationDrawer
        :model-value=&quot;true&quot;
        :modal=&quot;false&quot;
        :collapsed=&quot;collapsed&quot;
        :selected=&quot;selected&quot;
        :sections=&quot;sections&quot;
        @select=&quot;selected = $event&quot;
      >
        <template #toggle>
          <MIconButton
            :icon=&quot;collapsed ? 'menu' : 'menu_open'&quot;
            @click=&quot;collapsed = !collapsed&quot;
          />
        </template>
      </MNavigationDrawer>
    </template>

    <template #header>
      <MAppBar :bordered=&quot;true&quot;>
        <MText variant=&quot;title-large&quot; weight=&quot;medium&quot;>Dashboard</MText>
        <template #trailing>
          <MBadge :count=&quot;5&quot;>
            <MIconButton icon=&quot;notifications&quot; />
          </MBadge>
          <MAvatar name=&quot;Admin User&quot; :size=&quot;32&quot; />
        </template>
      </MAppBar>
    </template>

    <MBox surface=&quot;container-lowest&quot; padding=&quot;lg&quot;>
      <MStack gap=&quot;lg&quot;>
        <MGrid :cols=&quot;2&quot; gap=&quot;md&quot;>
          <MStatCard title=&quot;Total Users&quot; value=&quot;12,847&quot; icon=&quot;group&quot; :trend=&quot;12.5&quot; />
          <MStatCard title=&quot;Revenue&quot; value=&quot;$48.2K&quot; icon=&quot;payments&quot; :trend=&quot;8.1&quot; />
          <MStatCard title=&quot;Orders&quot; value=&quot;1,432&quot; icon=&quot;shopping_cart&quot; :trend=&quot;-2.3&quot; />
          <MStatCard title=&quot;Conversion&quot; value=&quot;3.24%&quot; icon=&quot;trending_up&quot; :trend=&quot;0.8&quot; />
        </MGrid>

        <MGrid :cols=&quot;1&quot; :lg=&quot;3&quot; gap=&quot;md&quot;>
          <MCard class=&quot;lg:col-span-2&quot; title=&quot;Recent Activity&quot; subtitle=&quot;Last 7 days&quot;>
            <MList>
              <MListItem
                v-for=&quot;item in activity&quot;
                :title=&quot;item.name&quot;
                :subtitle=&quot;item.desc&quot;
                :icon=&quot;item.icon&quot;
                leading=&quot;icon-container&quot;
                :trailing-text=&quot;item.time&quot;
              />
            </MList>
          </MCard>
          <MCard title=&quot;Top Pages&quot; subtitle=&quot;Most visited&quot;>
            <MList :dense=&quot;true&quot;>
              <MListItem
                v-for=&quot;page in pages&quot;
                :title=&quot;page.path&quot;
                :trailing-text=&quot;page.views&quot;
                :clickable=&quot;true&quot;
              />
            </MList>
          </MCard>
        </MGrid>
      </MStack>
    </MBox>
  </MAppLayout>
</template>`"
        :script="`import { ref, computed } from 'vue'
import {
  MAppLayout, MNavigationDrawer, MAppBar, MIconButton, MAvatar,
  MBadge, MTooltip, MStatCard, MCard, MText, MFlex, MStack,
  MBox, MGrid, MScrollable, MList, MListItem,
} from '@m3ui-vue/m3ui-vue'
import type { DrawerSection } from '@m3ui-vue/m3ui-vue'

const collapsed = ref(false)
const selected = ref<string | number>('overview')

const sections: DrawerSection[] = [
  {
    items: [
      { value: 'overview', label: 'Overview', icon: 'dashboard' },
      { value: 'analytics', label: 'Analytics', icon: 'analytics' },
      { value: 'users', label: 'Users', icon: 'group' },
      { value: 'settings', label: 'Settings', icon: 'settings' },
    ],
  },
]

const activity = [
  { name: 'New signup', desc: 'john@example.com registered', icon: 'person_add', time: '5m ago' },
  { name: 'Payment received', desc: 'Order #1234 — \\$299.00', icon: 'payment', time: '23m ago' },
]`"
      >
        <div class="h-160 overflow-hidden rounded-b-md">
          <MAppLayout height="100%">
            <template #drawer>
              <MNavigationDrawer
                :model-value="true"
                :modal="false"
                :collapsed="dashboardDrawerCollapsed"
                :selected="dashboardSelected"
                :sections="dashboardSections"
                @select="dashboardSelected = $event"
              >
                <template #toggle>
                <MIconButton
                  :icon="dashboardDrawerCollapsed ? 'menu' : 'menu_open'"
                  @click="dashboardDrawerCollapsed = !dashboardDrawerCollapsed"
                  label="Toggle drawer"
                />
              </template>
              </MNavigationDrawer>
            </template>

            <template #header>
              <MAppBar :bordered="true">
                <MText variant="title-large" weight="medium">
                  {{ dashboardSections[0]!.items.find(i => i.value === dashboardSelected)?.label ?? 'Overview' }}
                </MText>
                <template #trailing>
                  <MTooltip text="Notifications">
                    <MBadge :count="5">
                      <MIconButton icon="notifications" label="Notifications" />
                    </MBadge>
                  </MTooltip>
                  <MAvatar name="Admin User" :size="32" />
                </template>
              </MAppBar>
            </template>

            <MScrollable class="h-full">
              <MBox surface="container-low" padding="lg">
                <MStack gap="lg">
                  <MGrid :cols="2" gap="md">
                    <MStatCard title="Total Users" value="12,847" icon="group" :trend="12.5" trend-label="vs last month" color="primary" />
                    <MStatCard title="Revenue" value="$48.2K" icon="payments" :trend="8.1" trend-label="vs last month" color="secondary" />
                    <MStatCard title="Orders" value="1,432" icon="shopping_cart" :trend="-2.3" trend-label="vs last month" color="tertiary" />
                    <MStatCard title="Conversion" value="3.24%" icon="trending_up" :trend="0.8" trend-label="vs last month" color="success" />
                  </MGrid>

                  <MGrid :cols="1" :lg="3" gap="md">
                    <MCard class="lg:col-span-2" title="Recent Activity" subtitle="Last 7 days">
                      <MList class="px-0">
                        <MListItem
                          v-for="(item, i) in activityItems"
                          :key="i"
                          :title="item.name"
                          :subtitle="item.desc"
                          :icon="item.icon"
                          leading="icon-container"
                          icon-container-color="primary"
                          :trailing-text="item.time"
                        />
                      </MList>
                    </MCard>

                    <MCard title="Top Pages" subtitle="Most visited">
                      <MList :dense="true">
                        <MListItem
                          v-for="(page, i) in topPages"
                          :key="i"
                          :title="page.path"
                          :trailing-text="page.views"
                          :clickable="true"
                        />
                      </MList>
                    </MCard>
                  </MGrid>
                </MStack>
              </MBox>
            </MScrollable>
          </MAppLayout>
        </div>
      </ComponentDemo>
    </MSection>

    <!-- ── Form Page ──────────────────────────────────────────────── -->
    <MSection title="Form Page" title-variant="headline-small" class="mt-14">

      <ComponentDemo
        title="Profile Settings"
        description="Complete form layout with text fields, select, toggles, and action buttons."
        :code="`<template>
  <MCard class=&quot;w-full max-w-lg&quot;>
    <template #header>
      <MFlex gap=&quot;md&quot; align=&quot;center&quot;>
        <MAvatar name=&quot;Alex Morgan&quot; :size=&quot;56&quot; />
        <MStack gap=&quot;none&quot;>
          <MTitle size=&quot;small&quot;>Edit Profile</MTitle>
          <MSubtitle size=&quot;small&quot;>Update your personal information</MSubtitle>
        </MStack>
      </MFlex>
    </template>

    <MStack gap=&quot;md&quot; class=&quot;px-4 pb-2&quot;>
      <MTextField v-model=&quot;name&quot; label=&quot;Full Name&quot; variant=&quot;outlined&quot; leading-icon=&quot;person&quot; />
      <MTextField v-model=&quot;email&quot; label=&quot;Email&quot; type=&quot;email&quot; variant=&quot;outlined&quot; leading-icon=&quot;mail&quot; />
      <MSelect v-model=&quot;role&quot; :options=&quot;roles&quot; label=&quot;Role&quot; variant=&quot;outlined&quot; leading-icon=&quot;badge&quot; />
      <MTextField v-model=&quot;bio&quot; label=&quot;Bio&quot; variant=&quot;outlined&quot; multiline :rows=&quot;3&quot; />
      <MDivider />
      <MSwitch v-model=&quot;notifications&quot; label=&quot;Push notifications&quot; />
      <MCheckbox v-model=&quot;newsletter&quot; label=&quot;Subscribe to newsletter&quot; />
    </MStack>

    <template #actions>
      <MButton variant=&quot;text&quot;>Cancel</MButton>
      <MButton>Save Changes</MButton>
    </template>
  </MCard>
</template>`"
        :script="`import { ref } from 'vue'
import {
  MCard, MButton, MAvatar, MTextField, MSelect, MSwitch,
  MCheckbox, MDivider, MText, MSubtitle, MFlex, MStack,
} from '@m3ui-vue/m3ui-vue'

const name = ref('')
const email = ref('')
const role = ref<string | number | null>(null)
const bio = ref('')
const notifications = ref(true)
const newsletter = ref(false)

const roleOptions = [
  { label: 'Developer', value: 'developer' },
  { label: 'Designer', value: 'designer' },
  { label: 'Manager', value: 'manager' },
  { label: 'Other', value: 'other' },
]`"
      >
        <MCard class="mx-auto w-full max-w-lg">
          <template #header>
            <MFlex gap="md" align="center">
              <MAvatar name="Alex Morgan" :size="56" />
              <MStack gap="none">
                <MText variant="title-large" weight="medium">Edit Profile</MText>
                <MSubtitle size="small">Update your personal information</MSubtitle>
              </MStack>
            </MFlex>
          </template>

          <MStack gap="md" class="px-4 pb-2">
            <MTextField v-model="formName" label="Full Name" variant="outlined" leading-icon="person" />
            <MTextField v-model="formEmail" label="Email" type="email" variant="outlined" leading-icon="mail" />
            <MSelect v-model="formRole" :options="roleOptions" label="Role" variant="outlined" leading-icon="badge" />
            <MTextField v-model="formBio" label="Bio" variant="outlined" multiline :rows="3" />
            <MDivider />
            <MSwitch v-model="formNotifications" label="Push notifications" />
            <MCheckbox v-model="formNewsletter" label="Subscribe to newsletter" />
          </MStack>

          <template #actions>
            <MButton variant="text">Cancel</MButton>
            <MButton>Save Changes</MButton>
          </template>
        </MCard>
      </ComponentDemo>
    </MSection>
  </div>
</template>
