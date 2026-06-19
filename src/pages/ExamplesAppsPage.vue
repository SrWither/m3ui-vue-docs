<script setup lang="ts">
import { ref, computed } from "vue";
import {
  MCard,
  MButton,
  MIconButton,
  MIcon,
  MAvatar,
  MBadge,
  MDivider,
  MAppBar,
  MTextField,
  MChip,
  MTooltip,
  MDataTable,
  MDialog,
  MSelect,
  MConfirmDialog,
  useToast,
} from "@m3ui-vue/m3ui-vue";
import ComponentDemo from "@/components/ComponentDemo.vue";

// ── Chat ──
const chatMessage = ref("");
const chatSearch = ref("");
const chatSelected = ref(0);

const contacts = [
  {
    name: "Ana García",
    status: "online",
    lastMsg: "Sure, let me check that!",
    time: "2m",
    unread: 3,
  },
  {
    name: "Carlos López",
    status: "online",
    lastMsg: "The deploy is done",
    time: "15m",
    unread: 0,
  },
  {
    name: "María Torres",
    status: "offline",
    lastMsg: "See you tomorrow",
    time: "1h",
    unread: 0,
  },
  {
    name: "Pedro Ruiz",
    status: "online",
    lastMsg: "Can you review my PR?",
    time: "3h",
    unread: 1,
  },
  {
    name: "Laura Díaz",
    status: "offline",
    lastMsg: "Thanks for the help!",
    time: "Yesterday",
    unread: 0,
  },
];

const chatMessages = ref([
  {
    from: "them",
    text: "Hey! Have you seen the new design specs?",
    time: "10:30 AM",
  },
  { from: "me", text: "Not yet, which ones?", time: "10:32 AM" },
  {
    from: "them",
    text: "The ones for the dashboard redesign. I just uploaded them to Figma.",
    time: "10:33 AM",
  },
  {
    from: "me",
    text: "Oh nice, I'll check them out right now",
    time: "10:35 AM",
  },
  {
    from: "them",
    text: "Pay attention to the sidebar navigation, I changed the spacing",
    time: "10:35 AM",
  },
  {
    from: "me",
    text: "Got it. The new layout looks much cleaner!",
    time: "10:41 AM",
  },
  { from: "them", text: "Sure, let me check that!", time: "10:42 AM" },
]);

function sendMessage() {
  const text = chatMessage.value.trim();
  if (!text) return;
  chatMessages.value.push({ from: "me", text, time: "Now" });
  chatMessage.value = "";
}

// ── Data Table CRUD ──
const toast = useToast();

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
}

const users = ref<User[]>([
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Admin",
    status: "Active",
    department: "Engineering",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "Editor",
    status: "Active",
    department: "Design",
  },
  {
    id: 3,
    name: "Carol White",
    email: "carol@example.com",
    role: "Viewer",
    status: "Inactive",
    department: "Marketing",
  },
  {
    id: 4,
    name: "David Brown",
    email: "david@example.com",
    role: "Editor",
    status: "Active",
    department: "Engineering",
  },
  {
    id: 5,
    name: "Eva Martinez",
    email: "eva@example.com",
    role: "Admin",
    status: "Active",
    department: "Product",
  },
  {
    id: 6,
    name: "Frank Lee",
    email: "frank@example.com",
    role: "Viewer",
    status: "Inactive",
    department: "Design",
  },
  {
    id: 7,
    name: "Grace Kim",
    email: "grace@example.com",
    role: "Editor",
    status: "Active",
    department: "Engineering",
  },
  {
    id: 8,
    name: "Henry Davis",
    email: "henry@example.com",
    role: "Viewer",
    status: "Active",
    department: "Marketing",
  },
  {
    id: 9,
    name: "Iris Patel",
    email: "iris@example.com",
    role: "Admin",
    status: "Active",
    department: "Product",
  },
  {
    id: 10,
    name: "Jack Wilson",
    email: "jack@example.com",
    role: "Editor",
    status: "Inactive",
    department: "Engineering",
  },
]);

const tableColumns = [
  { key: "id", label: "ID", sortable: true, width: "w-16" },
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "role", label: "Role", sortable: true },
  { key: "department", label: "Department", sortable: true },
  { key: "status", label: "Status" },
  { key: "actions", label: "" },
];

const activeFilters = ref<string[]>([]);
const roleFilters = ["Admin", "Editor", "Viewer"];
const statusFilter = ref<string | number | null>(null);

const filteredUsers = computed(() => {
  let result = users.value;
  if (activeFilters.value.length > 0) {
    result = result.filter((u) => activeFilters.value.includes(u.role));
  }
  if (statusFilter.value) {
    result = result.filter((u) => u.status === statusFilter.value);
  }
  return result;
});

function toggleFilter(role: string) {
  const idx = activeFilters.value.indexOf(role);
  if (idx >= 0) activeFilters.value.splice(idx, 1);
  else activeFilters.value.push(role);
}

const selectedUsers = ref<Record<string, any>[]>([]);
const deleteDialogOpen = ref(false);
const userToDelete = ref<User | null>(null);
const editDialogOpen = ref(false);
const editForm = ref({ name: "", email: "", role: "", department: "" });
const editingUser = ref<User | null>(null);
const addDialogOpen = ref(false);
const addForm = ref({ name: "", email: "", role: "", department: "" });

const roleOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Editor", value: "Editor" },
  { label: "Viewer", value: "Viewer" },
];

const deptOptions = [
  { label: "Engineering", value: "Engineering" },
  { label: "Design", value: "Design" },
  { label: "Marketing", value: "Marketing" },
  { label: "Product", value: "Product" },
];

const statusOptions = [
  { label: "All", value: "" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

function openEdit(user: User) {
  editingUser.value = user;
  editForm.value = {
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
  };
  editDialogOpen.value = true;
}

function saveEdit() {
  if (!editingUser.value) return;
  Object.assign(editingUser.value, editForm.value);
  editDialogOpen.value = false;
  toast.show("User updated");
}

function confirmDelete(user: User) {
  userToDelete.value = user;
  deleteDialogOpen.value = true;
}

function doDelete() {
  if (!userToDelete.value) return;
  users.value = users.value.filter((u) => u.id !== userToDelete.value!.id);
  deleteDialogOpen.value = false;
  toast.show("User deleted");
}

function openAdd() {
  addForm.value = { name: "", email: "", role: "", department: "" };
  addDialogOpen.value = true;
}

function saveAdd() {
  const maxId = Math.max(...users.value.map((u) => u.id), 0);
  users.value.push({
    id: maxId + 1,
    name: addForm.value.name,
    email: addForm.value.email,
    role: addForm.value.role,
    department: addForm.value.department,
    status: "Active",
  });
  addDialogOpen.value = false;
  toast.show("User added");
}

function bulkDelete() {
  const ids = new Set(selectedUsers.value.map((u: any) => u.id));
  users.value = users.value.filter((u) => !ids.has(u.id));
  selectedUsers.value = [];
  toast.show(` ${ids.size} users deleted`);
}
</script>

<template>
  <div class="flex flex-col">
    <div class="mb-10 text-center self-center">
      <h1 class="text-display-small font-medium text-on-surface">
        App Examples
      </h1>
      <p class="mx-auto mt-3 max-w-2xl text-body-large text-on-surface-variant">
        Real-world application patterns built by composing multiple components
        together.
      </p>
    </div>

    <!-- ── Chat ──────────────────────────────────────────────────── -->
    <h2 class="mb-4 w-full text-headline-small font-medium">Chat App</h2>

    <ComponentDemo
      title="Messaging"
      description="Contact list with online status, message bubbles, and input area."
      flush
      :code="`<template>
  <div class=&quot;flex h-[600px] overflow-hidden rounded-xl border border-outline-variant&quot;>
    &lt;!-- Contact list --&gt;
    <div class=&quot;flex w-72 flex-col border-r border-outline-variant bg-surface&quot;>
      <div class=&quot;p-3&quot;>
        <MTextField placeholder=&quot;Search...&quot; leading-icon=&quot;search&quot; variant=&quot;outlined&quot; />
      </div>
      <div class=&quot;flex-1 overflow-auto&quot;>
        <div
          v-for=&quot;contact in contacts&quot;
          class=&quot;flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-on-surface/4&quot;
        >
          <MBadge :dot=&quot;contact.status === 'online'&quot; color=&quot;success&quot; overlap>
            <MAvatar :name=&quot;contact.name&quot; :size=&quot;40&quot; />
          </MBadge>
          <div class=&quot;min-w-0 flex-1&quot;>
            <span class=&quot;text-body-medium font-medium&quot;>{{ contact.name }}</span>
            <p class=&quot;truncate text-body-small text-on-surface-variant&quot;>{{ contact.lastMsg }}</p>
          </div>
        </div>
      </div>
    </div>

    &lt;!-- Chat area --&gt;
    <div class=&quot;flex min-w-0 flex-1 flex-col&quot;>
      <MAppBar elevated>
        <template #leading>
          <MAvatar :name=&quot;selectedContact.name&quot; :size=&quot;36&quot; />
        </template>
        <span class=&quot;text-title-medium font-medium&quot;>{{ selectedContact.name }}</span>
      </MAppBar>
      <div class=&quot;flex-1 overflow-auto p-4&quot;>
        &lt;!-- Messages --&gt;
      </div>
      <div class=&quot;border-t border-outline-variant p-3&quot;>
        <MTextField v-model=&quot;message&quot; placeholder=&quot;Type a message...&quot; variant=&quot;outlined&quot;>
          <template #trailing>
            <MIconButton icon=&quot;send&quot; @click=&quot;send&quot; />
          </template>
        </MTextField>
      </div>
    </div>
  </div>
</template>`"
    >
      <div class="flex h-150 overflow-hidden rounded-b-md">
        <!-- Contact list -->
        <div
          class="hidden w-72 flex-col border-r border-outline-variant bg-surface sm:flex"
        >
          <div class="p-3">
            <MTextField
              v-model="chatSearch"
              label="Search..."
              leading-icon="search"
              variant="outlined"
            />
          </div>
          <div class="flex-1 overflow-auto">
            <div
              v-for="(contact, i) in contacts"
              :key="i"
              class="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors"
              :class="
                chatSelected === i
                  ? 'bg-secondary-container'
                  : 'hover:bg-on-surface/4'
              "
              @click="chatSelected = i"
            >
              <span class="relative inline-flex">
                <MAvatar :name="contact.name" :size="40" />
                <span
                  v-if="contact.status === 'online'"
                  class="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-surface bg-success"
                />
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-3">
                  <span
                    class="min-w-0 flex-1 truncate text-body-medium font-medium"
                    >{{ contact.name }}</span
                  >
                  <span
                    class="shrink-0 text-body-small leading-5 text-on-surface-variant"
                    >{{ contact.time }}</span
                  >
                </div>
                <div class="mt-0.5 flex items-center gap-3">
                  <p
                    class="min-w-0 flex-1 truncate text-body-small text-on-surface-variant"
                  >
                    {{ contact.lastMsg }}
                  </p>
                  <div class="-mt-2 flex h-5 shrink-0 items-center">
                    <MBadge v-if="contact.unread" :count="contact.unread" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat area -->
        <div class="flex min-w-0 flex-1 flex-col">
          <MAppBar elevated>
            <template #leading>
              <span class="relative inline-flex">
                <MAvatar :name="contacts[chatSelected]!.name" :size="36" />
                <span
                  v-if="contacts[chatSelected]!.status === 'online'"
                  class="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-surface bg-success"
                />
              </span>
            </template>
            <div>
              <span class="text-title-medium font-medium">{{
                contacts[chatSelected]!.name
              }}</span>
              <p class="text-body-small text-on-surface-variant">
                {{
                  contacts[chatSelected]!.status === "online"
                    ? "Online"
                    : "Offline"
                }}
              </p>
            </div>
            <template #trailing>
              <MTooltip text="Call">
                <MIconButton icon="call" label="Call" />
              </MTooltip>
              <MTooltip text="Video">
                <MIconButton icon="videocam" label="Video" />
              </MTooltip>
              <MTooltip text="More">
                <MIconButton icon="more_vert" label="More" />
              </MTooltip>
            </template>
          </MAppBar>

          <div
            class="flex flex-1 flex-col gap-3 overflow-auto bg-surface-container-lowest p-4"
          >
            <div
              v-for="(msg, i) in chatMessages"
              :key="i"
              class="flex"
              :class="msg.from === 'me' ? 'justify-end' : 'justify-start'"
            >
              <div
                class="max-w-[75%] rounded-2xl px-4 py-2.5"
                :class="
                  msg.from === 'me'
                    ? 'rounded-br-md bg-primary-container text-on-primary-container'
                    : 'rounded-bl-md bg-surface-container-high text-on-surface'
                "
              >
                <p class="text-body-medium">{{ msg.text }}</p>
                <p class="mt-1 text-right text-body-small opacity-60">
                  {{ msg.time }}
                </p>
              </div>
            </div>
          </div>

          <div class="border-t border-outline-variant bg-surface p-3">
            <form class="flex items-center gap-2" @submit.prevent="sendMessage">
              <MTooltip text="Attach">
                <MIconButton icon="attach_file" type="button" label="Attach" />
              </MTooltip>
              <MTextField
                v-model="chatMessage"
                label="Type a message..."
                variant="outlined"
                class="flex-1"
                @keydown.enter.exact.prevent="sendMessage"
              />
              <MTooltip text="Send">
                <MIconButton icon="send" type="submit" label="Send" />
              </MTooltip>
            </form>
          </div>
        </div>
      </div>
    </ComponentDemo>

    <!-- ── Data Table CRUD ────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 w-full text-headline-small font-medium">
      Data Table CRUD
    </h2>

    <ComponentDemo
      title="User Management"
      description="Filterable data table with role chips, inline actions, bulk delete, and add/edit dialogs."
      flush
      :code="`<template>
  <div class=&quot;flex flex-col gap-4 p-6&quot;>
    &lt;!-- Toolbar --&gt;
    <div class=&quot;flex flex-wrap items-center gap-3&quot;>
      <div class=&quot;flex gap-2&quot;>
        <MChip v-for=&quot;role in roles&quot; :selected=&quot;filters.includes(role)&quot; @click=&quot;toggleFilter(role)&quot;>
          {{ role }}
        </MChip>
      </div>
      <MSelect v-model=&quot;status&quot; :options=&quot;statusOptions&quot; label=&quot;Status&quot; variant=&quot;outlined&quot; />
      <div class=&quot;ml-auto flex gap-2&quot;>
        <MButton v-if=&quot;selected.length&quot; variant=&quot;tonal&quot; tone=&quot;error&quot; @click=&quot;bulkDelete&quot;>
          Delete ({{ selected.length }})
        </MButton>
        <MButton leading-icon=&quot;add&quot; @click=&quot;openAdd&quot;>Add User</MButton>
      </div>
    </div>

    &lt;!-- Table --&gt;
    <MDataTable :columns=&quot;columns&quot; :rows=&quot;filteredUsers&quot; v-model=&quot;selected&quot; selectable>
      <template #cell-status=&quot;{ value }&quot;>
        <MChip :tone=&quot;value === 'Active' ? 'success' : 'neutral'&quot;>{{ value }}</MChip>
      </template>
      <template #cell-actions=&quot;{ row }&quot;>
        <MIconButton icon=&quot;edit&quot; @click=&quot;openEdit(row)&quot; />
        <MIconButton icon=&quot;delete&quot; @click=&quot;confirmDelete(row)&quot; />
      </template>
    </MDataTable>
  </div>
</template>`"
    >
      <div class="flex flex-col gap-4 rounded-b-md bg-surface p-6">
        <!-- Toolbar -->
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex flex-wrap gap-2">
            <MChip
              v-for="role in roleFilters"
              :key="role"
              :selected="activeFilters.includes(role)"
              @click="toggleFilter(role)"
            >
              {{ role }}
            </MChip>
          </div>
          <div class="max-w-52 flex-1">
            <MSelect
              v-model="statusFilter"
              :options="statusOptions"
              label="Status"
              variant="outlined"
            />
          </div>
          <div class="ml-auto flex gap-2">
            <MButton
              v-if="selectedUsers.length"
              variant="tonal"
              tone="error"
              leading-icon="delete_sweep"
              @click="bulkDelete"
            >
              Delete ({{ selectedUsers.length }})
            </MButton>
            <MButton leading-icon="person_add" @click="openAdd"
              >Add User</MButton
            >
          </div>
        </div>

        <div
          v-if="activeFilters.length || statusFilter"
          class="flex flex-wrap items-center gap-2"
        >
          <span class="text-body-small text-on-surface-variant">Filters:</span>
          <MChip
            v-for="f in activeFilters"
            :key="f"
            closable
            tone="primary"
            @close="toggleFilter(f)"
          >
            {{ f }}
          </MChip>
          <MChip
            v-if="statusFilter"
            closable
            tone="secondary"
            @close="statusFilter = null"
          >
            {{ statusFilter }}
          </MChip>
        </div>

        <!-- Table -->
        <MDataTable
          :columns="tableColumns"
          :rows="filteredUsers"
          v-model="selectedUsers"
          selectable
          :per-page="5"
        >
          <template #cell-role="{ value }">
            <MChip
              :tone="
                value === 'Admin'
                  ? 'error'
                  : value === 'Editor'
                    ? 'primary'
                    : 'neutral'
              "
            >
              {{ value }}
            </MChip>
          </template>
          <template #cell-status="{ value }">
            <MChip :tone="value === 'Active' ? 'success' : 'neutral'">
              {{ value }}
            </MChip>
          </template>
          <template #cell-actions="{ row }">
            <div class="flex gap-1" @click.stop>
              <MTooltip text="Edit">
                <MIconButton icon="edit" @click="openEdit(row as User)" label="Edit" />
              </MTooltip>
              <MTooltip text="Delete">
                <MIconButton
                  icon="delete"
                  @click="confirmDelete(row as User)"
                  label="Delete"
                />
              </MTooltip>
            </div>
          </template>
        </MDataTable>
      </div>

      <!-- Edit Dialog -->
      <MDialog v-model="editDialogOpen" title="Edit User">
        <div class="flex flex-col gap-4 p-4">
          <MTextField
            v-model="editForm.name"
            label="Name"
            variant="outlined"
            leading-icon="person"
          />
          <MTextField
            v-model="editForm.email"
            label="Email"
            variant="outlined"
            leading-icon="mail"
          />
          <MSelect
            v-model="editForm.role"
            :options="roleOptions"
            label="Role"
            variant="outlined"
          />
          <MSelect
            v-model="editForm.department"
            :options="deptOptions"
            label="Department"
            variant="outlined"
          />
        </div>
        <template #actions>
          <MButton variant="text" @click="editDialogOpen = false"
            >Cancel</MButton
          >
          <MButton @click="saveEdit">Save</MButton>
        </template>
      </MDialog>

      <!-- Add Dialog -->
      <MDialog v-model="addDialogOpen" title="Add User">
        <div class="flex flex-col gap-4 p-4">
          <MTextField
            v-model="addForm.name"
            label="Name"
            variant="outlined"
            leading-icon="person"
          />
          <MTextField
            v-model="addForm.email"
            label="Email"
            variant="outlined"
            leading-icon="mail"
          />
          <MSelect
            v-model="addForm.role"
            :options="roleOptions"
            label="Role"
            variant="outlined"
          />
          <MSelect
            v-model="addForm.department"
            :options="deptOptions"
            label="Department"
            variant="outlined"
          />
        </div>
        <template #actions>
          <MButton variant="text" @click="addDialogOpen = false"
            >Cancel</MButton
          >
          <MButton @click="saveAdd">Add</MButton>
        </template>
      </MDialog>

      <!-- Delete Confirmation -->
      <MConfirmDialog
        v-model="deleteDialogOpen"
        title="Delete User"
        :message="`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`"
        confirm-text="Delete"
        tone="error"
        icon="warning"
        @confirm="doDelete"
      />
    </ComponentDemo>
  </div>
</template>
