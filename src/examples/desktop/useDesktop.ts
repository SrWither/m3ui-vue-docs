import { computed, reactive, ref, type Component } from 'vue'

/*
 * Desktop state, module-level so every part (icons, taskbar, start menu, apps like the
 * terminal) shares one desktop. Windows are MWindow instances rendered by DesktopExample.vue.
 *
 * Window lifecycle, like a real desktop:
 * - open(id):  starts the app (adds it to the taskbar) or brings it back / to the front
 * - hide(id):  "minimize" to the taskbar; the window instance stays, so it keeps its place
 * - quit(id):  closes it and removes it from the taskbar
 */

export interface DesktopApp {
  id: string
  title: string
  icon: string
  /** Tile color on the desktop and in the start menu. */
  tone: 'primary' | 'secondary' | 'tertiary' | 'error'
  component: () => Promise<{ default: Component }>
  width: number
  height: number
  /** Shown as a desktop icon (all apps are in the start menu). */
  onDesktop?: boolean
}

export const apps: DesktopApp[] = [
  { id: 'welcome', title: 'Welcome', icon: 'waving_hand', tone: 'tertiary', width: 440, height: 400, component: () => import('./apps/WelcomeApp.vue') },
  { id: 'files', title: 'Files', icon: 'folder', tone: 'primary', width: 560, height: 360, onDesktop: true, component: () => import('./apps/FilesApp.vue') },
  { id: 'notes', title: 'Notes', icon: 'sticky_note_2', tone: 'tertiary', width: 520, height: 340, onDesktop: true, component: () => import('./apps/NotesApp.vue') },
  { id: 'tasks', title: 'Tasks', icon: 'view_kanban', tone: 'secondary', width: 680, height: 400, onDesktop: true, component: () => import('./apps/TasksApp.vue') },
  { id: 'calendar', title: 'Calendar', icon: 'calendar_month', tone: 'primary', width: 460, height: 440, onDesktop: true, component: () => import('./apps/CalendarApp.vue') },
  { id: 'music', title: 'Music', icon: 'headphones', tone: 'error', width: 360, height: 460, onDesktop: true, component: () => import('./apps/MusicApp.vue') },
  { id: 'calculator', title: 'Calculator', icon: 'calculate', tone: 'secondary', width: 300, height: 420, onDesktop: true, component: () => import('./apps/CalculatorApp.vue') },
  { id: 'terminal', title: 'Terminal', icon: 'terminal', tone: 'primary', width: 540, height: 320, onDesktop: true, component: () => import('./apps/TerminalApp.vue') },
  { id: 'settings', title: 'Settings', icon: 'settings', tone: 'tertiary', width: 520, height: 440, onDesktop: true, component: () => import('./apps/SettingsApp.vue') },
]

export const appById = (id: string) => apps.find((a) => a.id === id)

/** Apps in taskbar order (order they were started). */
const running = ref<string[]>([])
/** Window visibility per app (v-model of each MWindow). */
const visible = reactive<Record<string, boolean>>({})
/** The app whose window is in front. */
const active = ref<string | null>(null)
/** Bumped to ask a window to come to the front (DesktopExample.vue calls MWindow's focus()). */
const focusRequest = ref<{ id: string; n: number } | null>(null)

export type Wallpaper = 'aurora' | 'shapes' | 'plain'
const wallpaper = ref<Wallpaper>('aurora')

let focusCounter = 0
function requestFocus(id: string) {
  focusRequest.value = { id, n: ++focusCounter }
}

function open(id: string) {
  if (!appById(id)) return
  if (!running.value.includes(id)) running.value.push(id)
  visible[id] = true
  active.value = id
  requestFocus(id)
}

function hide(id: string) {
  visible[id] = false
  if (active.value === id) active.value = topVisible(id)
}

function quit(id: string) {
  visible[id] = false
  running.value = running.value.filter((r) => r !== id)
  if (active.value === id) active.value = topVisible(id)
}

/** Some other visible app to treat as active after one goes away (taskbar highlight). */
function topVisible(except: string) {
  return [...running.value].reverse().find((r) => r !== except && visible[r]) ?? null
}

/** Taskbar click: show a hidden app, focus a background one, hide the active one. */
function toggle(id: string) {
  if (!visible[id]) return open(id)
  if (active.value === id) return hide(id)
  active.value = id
  requestFocus(id)
}

export function useDesktop() {
  return {
    apps,
    running,
    visible,
    active,
    focusRequest,
    wallpaper,
    open,
    hide,
    quit,
    toggle,
    runningApps: computed(() => running.value.map((id) => appById(id)!)),
  }
}
