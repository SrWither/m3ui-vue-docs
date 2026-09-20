<script setup lang="ts">
import { ref } from 'vue'
import { MList, MListItem, MListSubheader, MCard } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const listProps: PropDef[] = [
  { name: 'dense', type: 'boolean', default: 'false', description: 'Compact vertical padding on child items' },
  { name: 'dividers', type: "boolean | 'inset'", default: 'false', description: "Show separators between items — 'inset' aligns the line past a leading icon/avatar" },
  { name: 'nav', type: 'boolean', default: 'false', description: 'Navigation variant with rounded (pill) active items, ideal for drawers' },
  { name: 'segmented', type: 'boolean', default: 'false', description: 'Segmented style — items each get an individual rounded background instead of a flat list' },
  { name: 'selectable', type: 'boolean', default: 'false', description: 'Enable single-item selection — items compare their value prop against selected' },
  { name: 'selected', type: 'string | number | null', description: 'Currently selected item value (v-model:selected)' },
  { name: 'lines', type: '1 | 2 | 3', description: "Default line count for child items that don't set their own lines prop" },
]

const listEvents: EventDef[] = [
  { name: 'update:selected', payload: 'string | number | null', description: 'Fires when a selectable item is clicked (via v-model:selected)' },
]

const listSlots: SlotDef[] = [
  { name: '#default', description: 'MListItem / MListSubheader children' },
]

const listItemProps: PropDef[] = [
  { name: 'title', type: 'string', description: 'Primary text (headline)' },
  { name: 'overline', type: 'string', description: 'Small label above the title' },
  { name: 'subtitle', type: 'string', description: 'Secondary text (line 2)' },
  { name: 'description', type: 'string', description: 'Tertiary text (line 3)' },
  { name: 'lines', type: '1 | 2 | 3', description: 'Number of text lines — auto-detected from which text props/parent MList lines are set when omitted' },
  { name: 'icon', type: 'string', description: 'Leading Material Symbol icon' },
  { name: 'leading', type: "'icon' | 'avatar' | 'checkbox' | 'radio' | 'image' | 'icon-container'", description: "Leading element type — auto-resolves to 'icon'/'avatar'/'image' from icon/avatarName/image when omitted" },
  { name: 'avatarName', type: 'string', description: "Name for the avatar (when leading='avatar')" },
  { name: 'image', type: 'string', description: "Image URL (when leading='image')" },
  { name: 'iconContainerColor', type: "'primary' | 'secondary' | 'tertiary' | 'error' | 'success'", default: "'primary'", description: "Icon container background color (when leading='icon-container')" },
  { name: 'trailingIcon', type: 'string', description: 'Trailing icon name' },
  { name: 'trailingText', type: 'string', description: 'Trailing text label' },
  { name: 'trailing', type: "'icon' | 'text' | 'switch' | 'checkbox'", description: 'Trailing element type — auto-resolves from trailingIcon/trailingText when omitted' },
  { name: 'trailingValue', type: 'boolean', description: 'Value for a trailing switch/checkbox (v-model:trailingValue)' },
  { name: 'value', type: 'string | number', description: 'Selection value — compared against the parent MList selected prop' },
  { name: 'active', type: 'boolean', default: 'false', description: 'Force the active/highlighted state regardless of parent list selection' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state (38% opacity, blocks interaction)' },
  { name: 'clickable', type: 'boolean', description: 'Force interactive styling/behavior (auto-true when href, to, @click, selectable, or expandable apply)' },
  { name: 'href', type: 'string', description: 'Link URL — renders the item as an <a>' },
  { name: 'to', type: 'string | object', description: 'Vue Router destination — renders the item as a router-link' },
  { name: 'expandable', type: 'boolean', default: 'false', description: 'Show an expand/collapse chevron revealing the #children slot' },
  { name: 'expanded', type: 'boolean', description: 'Control the expanded state (v-model:expanded) — otherwise managed internally' },
]

const listItemEvents: EventDef[] = [
  { name: 'click', payload: 'MouseEvent', description: 'Fires on any click, including on an expandable item (right before it toggles)' },
  { name: 'update:trailingValue', payload: 'boolean', description: "Fires when a trailing switch/checkbox is toggled (trailing='switch' | 'checkbox')" },
  { name: 'update:expanded', payload: 'boolean', description: 'Fires when an expandable item is toggled open/closed' },
]

const listItemSlots: SlotDef[] = [
  { name: '#default', description: 'Custom content replacing the title/subtitle/description text block' },
  { name: '#overline', description: 'Custom overline content, replacing the overline prop' },
  { name: '#leading', description: 'Custom leading element, replacing the icon/avatar/image/icon-container' },
  { name: '#trailing', description: 'Custom trailing element, replacing the icon/text/switch/checkbox' },
  { name: '#children', description: 'Nested content revealed when expandable is set and the item is expanded' },
]

const listSubheaderProps: PropDef[] = [
  { name: 'inset', type: 'boolean', default: 'false', description: 'Align with items that have a leading icon (adds left padding)' },
]

const listSubheaderSlots: SlotDef[] = [
  { name: '#default', description: 'Subheader text/content' },
]

const listSelected = ref<string | number | null>('inbox')
const darkMode = ref(false)
const notifications = ref(true)
const autoUpdate = ref(false)
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MList</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A vertical list container (MList) with rich, flexible rows (MListItem) and optional section
      headers (MListSubheader) — one-line to three-line items, leading/trailing elements, selection,
      navigation, segmented, and expandable variants.
    </p>

    <ComponentDemo
      title="Basic List"
      description="Simple one-line and two-line list items with icons."
      :code="`<template>
  <MList>
    <MListItem title=&quot;Inbox&quot; icon=&quot;inbox&quot; trailing-text=&quot;24&quot; />
    <MListItem title=&quot;Starred&quot; icon=&quot;star&quot; />
    <MListItem title=&quot;Sent&quot; icon=&quot;send&quot; />
    <MListItem title=&quot;Drafts&quot; icon=&quot;drafts&quot; trailing-text=&quot;3&quot; />
  </MList>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="overflow-hidden">
          <MList>
            <MListItem title="Inbox" icon="inbox" trailing-text="24" />
            <MListItem title="Starred" icon="star" />
            <MListItem title="Sent" icon="send" />
            <MListItem title="Drafts" icon="drafts" trailing-text="3" />
          </MList>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Two-Line Items"
      description="Items with title and subtitle for additional context."
      :code="`<template>
  <MList :dividers=&quot;true&quot;>
    <MListItem title=&quot;Wi-Fi&quot; subtitle=&quot;Connected to HomeNetwork&quot; icon=&quot;wifi&quot; />
    <MListItem title=&quot;Bluetooth&quot; subtitle=&quot;Galaxy Buds Pro&quot; icon=&quot;bluetooth&quot; />
    <MListItem title=&quot;Mobile data&quot; subtitle=&quot;4G LTE&quot; icon=&quot;signal_cellular_alt&quot; />
  </MList>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="overflow-hidden">
          <MList :dividers="true">
            <MListItem title="Wi-Fi" subtitle="Connected to HomeNetwork" icon="wifi" />
            <MListItem title="Bluetooth" subtitle="Galaxy Buds Pro" icon="bluetooth" />
            <MListItem title="Mobile data" subtitle="4G LTE" icon="signal_cellular_alt" />
          </MList>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Three-Line Items"
      description="Rich items with title, subtitle, and description."
      :code="`<template>
  <MList :dividers=&quot;'inset'&quot;>
    <MListItem
      title=&quot;Alice Brown&quot;
      subtitle=&quot;Project update&quot;
      description=&quot;Hey team, just pushed the latest changes to the staging branch. Let me know if you see any issues.&quot;
      leading=&quot;avatar&quot;
      avatar-name=&quot;Alice Brown&quot;
      trailing-text=&quot;3m&quot;
    />
    <MListItem
      title=&quot;Carlos Diaz&quot;
      subtitle=&quot;Design review&quot;
      description=&quot;I've uploaded the new mockups for the dashboard. The color scheme follows our M3 guidelines.&quot;
      leading=&quot;avatar&quot;
      avatar-name=&quot;Carlos Diaz&quot;
      trailing-text=&quot;1h&quot;
    />
  </MList>
</template>`"
    >
      <div class="w-full max-w-md">
        <MCard variant="outlined" class="overflow-hidden">
          <MList dividers="inset">
            <MListItem
              title="Alice Brown"
              subtitle="Project update"
              description="Hey team, just pushed the latest changes to the staging branch. Let me know if you see any issues."
              leading="avatar"
              avatar-name="Alice Brown"
              trailing-text="3m"
            />
            <MListItem
              title="Carlos Diaz"
              subtitle="Design review"
              description="I've uploaded the new mockups for the dashboard. The color scheme follows our M3 guidelines."
              leading="avatar"
              avatar-name="Carlos Diaz"
              trailing-text="1h"
            />
            <MListItem
              title="Eva Flores"
              subtitle="Sprint planning"
              description="Let's schedule a meeting this week to discuss the roadmap and prioritize the backlog items."
              leading="avatar"
              avatar-name="Eva Flores"
              trailing-text="2h"
            />
          </MList>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Overline"
      description="An overline label above the title — e.g. for a category or status tag."
      :code="`<template>
  <MList :dividers=&quot;true&quot;>
    <MListItem overline=&quot;URGENT&quot; title=&quot;Server outage&quot; subtitle=&quot;Production down since 10:42&quot; icon=&quot;error&quot; />
    <MListItem overline=&quot;RESOLVED&quot; title=&quot;Slow queries&quot; subtitle=&quot;Database index added&quot; icon=&quot;check_circle&quot; />
  </MList>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="overflow-hidden">
          <MList :dividers="true">
            <MListItem overline="URGENT" title="Server outage" subtitle="Production down since 10:42" icon="error" />
            <MListItem overline="RESOLVED" title="Slow queries" subtitle="Database index added" icon="check_circle" />
          </MList>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Icon Containers"
      description="Colored icon containers for settings-style lists."
      :code="`<template>
  <MList>
    <MListItem title=&quot;Account&quot; subtitle=&quot;Privacy, security, language&quot; icon=&quot;person&quot; leading=&quot;icon-container&quot; icon-container-color=&quot;primary&quot; trailing-icon=&quot;chevron_right&quot; />
    <MListItem title=&quot;Notifications&quot; subtitle=&quot;Alerts, sounds, vibration&quot; icon=&quot;notifications&quot; leading=&quot;icon-container&quot; icon-container-color=&quot;secondary&quot; trailing-icon=&quot;chevron_right&quot; />
    <MListItem title=&quot;Storage&quot; subtitle=&quot;12.4 GB used of 64 GB&quot; icon=&quot;storage&quot; leading=&quot;icon-container&quot; icon-container-color=&quot;tertiary&quot; trailing-icon=&quot;chevron_right&quot; />
  </MList>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="overflow-hidden">
          <MList>
            <MListItem title="Account" subtitle="Privacy, security, language" icon="person" leading="icon-container" icon-container-color="primary" trailing-icon="chevron_right" />
            <MListItem title="Notifications" subtitle="Alerts, sounds, vibration" icon="notifications" leading="icon-container" icon-container-color="secondary" trailing-icon="chevron_right" />
            <MListItem title="Storage" subtitle="12.4 GB used of 64 GB" icon="storage" leading="icon-container" icon-container-color="tertiary" trailing-icon="chevron_right" />
            <MListItem title="Battery" subtitle="87% — About 14h left" icon="battery_5_bar" leading="icon-container" icon-container-color="success" trailing-icon="chevron_right" />
          </MList>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="With Switches"
      description="Toggle settings using trailing switches."
      :code="`<template>
  <MList>
    <MListItem title=&quot;Dark Mode&quot; icon=&quot;dark_mode&quot; trailing=&quot;switch&quot; :trailing-value=&quot;darkMode&quot; @update:trailing-value=&quot;darkMode = $event&quot; />
    <MListItem title=&quot;Notifications&quot; icon=&quot;notifications&quot; trailing=&quot;switch&quot; :trailing-value=&quot;notifications&quot; @update:trailing-value=&quot;notifications = $event&quot; />
    <MListItem title=&quot;Auto-update&quot; icon=&quot;system_update&quot; trailing=&quot;switch&quot; :trailing-value=&quot;autoUpdate&quot; @update:trailing-value=&quot;autoUpdate = $event&quot; />
  </MList>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="overflow-hidden">
          <MList>
            <MListItem title="Dark Mode" icon="dark_mode" trailing="switch" :trailing-value="darkMode" @update:trailing-value="darkMode = $event" />
            <MListItem title="Notifications" icon="notifications" trailing="switch" :trailing-value="notifications" @update:trailing-value="notifications = $event" />
            <MListItem title="Auto-update" icon="system_update" trailing="switch" :trailing-value="autoUpdate" @update:trailing-value="autoUpdate = $event" />
          </MList>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Navigation List"
      description="Nav variant with rounded active items, ideal for drawers."
      :code="`<template>
  <MList :nav=&quot;true&quot; :selectable=&quot;true&quot; :selected=&quot;selected&quot; @update:selected=&quot;selected = $event&quot;>
    <MListItem title=&quot;Inbox&quot; icon=&quot;inbox&quot; value=&quot;inbox&quot; />
    <MListItem title=&quot;Starred&quot; icon=&quot;star&quot; value=&quot;starred&quot; />
    <MListItem title=&quot;Sent&quot; icon=&quot;send&quot; value=&quot;sent&quot; />
    <MListSubheader>Labels</MListSubheader>
    <MListItem title=&quot;Important&quot; icon=&quot;label_important&quot; value=&quot;important&quot; />
    <MListItem title=&quot;Work&quot; icon=&quot;label&quot; value=&quot;work&quot; />
  </MList>
</template>`"
    >
      <div class="w-full max-w-xs">
        <MCard variant="outlined" class="overflow-hidden">
          <MList :nav="true" :selectable="true" :selected="listSelected" @update:selected="listSelected = $event">
            <MListItem title="Inbox" icon="inbox" value="inbox" />
            <MListItem title="Starred" icon="star" value="starred" />
            <MListItem title="Sent" icon="send" value="sent" />
            <MListSubheader>Labels</MListSubheader>
            <MListItem title="Important" icon="label_important" value="important" />
            <MListItem title="Work" icon="label" value="work" />
          </MList>
        </MCard>
        <p v-if="listSelected" class="mt-2 text-body-medium text-on-surface-variant">
          Selected: {{ listSelected }}
        </p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Dense & Sections"
      description="Compact list with subheaders dividing sections."
      :code="`<template>
  <MList :dense=&quot;true&quot; :dividers=&quot;true&quot;>
    <MListSubheader>Folders</MListSubheader>
    <MListItem title=&quot;Photos&quot; icon=&quot;photo_library&quot; trailing-text=&quot;245&quot; />
    <MListItem title=&quot;Documents&quot; icon=&quot;description&quot; trailing-text=&quot;18&quot; />
    <MListSubheader>Files</MListSubheader>
    <MListItem title=&quot;resume.pdf&quot; icon=&quot;picture_as_pdf&quot; trailing-text=&quot;2.4 MB&quot; />
    <MListItem title=&quot;notes.txt&quot; icon=&quot;text_snippet&quot; trailing-text=&quot;12 KB&quot; />
  </MList>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="overflow-hidden">
          <MList :dense="true" :dividers="true">
            <MListSubheader>Folders</MListSubheader>
            <MListItem title="Photos" icon="photo_library" trailing-text="245" />
            <MListItem title="Documents" icon="description" trailing-text="18" />
            <MListItem title="Downloads" icon="download" trailing-text="7" />
            <MListSubheader>Files</MListSubheader>
            <MListItem title="resume.pdf" icon="picture_as_pdf" trailing-text="2.4 MB" />
            <MListItem title="notes.txt" icon="text_snippet" trailing-text="12 KB" />
          </MList>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Disabled Items"
      description="Items can be individually disabled."
      :code="`<template>
  <MList>
    <MListItem title=&quot;Available&quot; icon=&quot;check_circle&quot; :clickable=&quot;true&quot; />
    <MListItem title=&quot;Unavailable&quot; icon=&quot;block&quot; :disabled=&quot;true&quot; />
    <MListItem title=&quot;Premium only&quot; icon=&quot;lock&quot; :disabled=&quot;true&quot; subtitle=&quot;Upgrade to unlock&quot; />
  </MList>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="overflow-hidden">
          <MList>
            <MListItem title="Available" icon="check_circle" :clickable="true" />
            <MListItem title="Unavailable" icon="block" :disabled="true" />
            <MListItem title="Premium only" icon="lock" :disabled="true" subtitle="Upgrade to unlock" />
          </MList>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Expandable Items"
      description="Collapsible children, similar to MNavigationDrawer sections."
      :code="`<template>
  <MList>
    <MListItem title=&quot;Inbox&quot; icon=&quot;inbox&quot; :expandable=&quot;true&quot;>
      <template #children>
        <MListItem title=&quot;Primary&quot; icon=&quot;label&quot; />
        <MListItem title=&quot;Social&quot; icon=&quot;group&quot; />
        <MListItem title=&quot;Promotions&quot; icon=&quot;local_offer&quot; />
      </template>
    </MListItem>
    <MListItem title=&quot;Sent&quot; icon=&quot;send&quot; />
  </MList>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="overflow-hidden">
          <MList>
            <MListItem title="Inbox" icon="inbox" :expandable="true">
              <template #children>
                <MListItem title="Primary" icon="label" />
                <MListItem title="Social" icon="group" />
                <MListItem title="Promotions" icon="local_offer" />
              </template>
            </MListItem>
            <MListItem title="Starred" icon="star" :expandable="true">
              <template #children>
                <MListItem title="Work" icon="work" />
                <MListItem title="Personal" icon="person" />
              </template>
            </MListItem>
            <MListItem title="Sent" icon="send" />
            <MListItem title="Trash" icon="delete" />
          </MList>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Segmented"
      description="Each item has its own background and rounded corners, visually grouping them as separate segments."
      :code="`<MList :segmented=&quot;true&quot; :selectable=&quot;true&quot; v-model:selected=&quot;selected&quot;>
  <MListItem title=&quot;General&quot; icon=&quot;settings&quot; value=&quot;general&quot; />
  <MListItem title=&quot;Privacy&quot; icon=&quot;lock&quot; value=&quot;privacy&quot; />
</MList>`"
    >
      <div class="grid w-full gap-6 sm:grid-cols-2">
        <MCard class="p-0">
          <p class="px-4 pt-4 pb-1 text-title-small font-medium text-on-surface">Settings</p>
          <MList :segmented="true" :selectable="true" v-model:selected="listSelected">
            <MListItem title="General" subtitle="App preferences" icon="settings" value="general" />
            <MListItem title="Notifications" subtitle="Alerts and sounds" icon="notifications" value="notifications" />
            <MListItem title="Privacy" subtitle="Data and permissions" icon="lock" value="privacy" />
            <MListItem title="Storage" subtitle="Manage local data" icon="storage" value="storage" />
          </MList>
        </MCard>
        <MCard class="p-0">
          <p class="px-4 pt-4 pb-1 text-title-small font-medium text-on-surface">Account</p>
          <MList :segmented="true">
            <MListItem title="Profile" subtitle="fadel@example.com" icon="person" :clickable="true" trailing-icon="chevron_right" />
            <MListItem title="Security" subtitle="Password and 2FA" icon="shield" :clickable="true" trailing-icon="chevron_right" />
            <MListItem title="Sign out" icon="logout" :clickable="true" />
          </MList>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">MList Props</h3>
    <PropsTable :props="listProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MList Events</h3>
    <EventsTable :events="listEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MList Slots</h3>
    <SlotsTable :slots="listSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MListItem Props</h3>
    <PropsTable :props="listItemProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MListItem Events</h3>
    <EventsTable :events="listItemEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MListItem Slots</h3>
    <SlotsTable :slots="listItemSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MListSubheader Props</h3>
    <PropsTable :props="listSubheaderProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">MListSubheader Slots</h3>
    <SlotsTable :slots="listSubheaderSlots" />

    <ComponentPager current="MList" />
  </div>
</template>
