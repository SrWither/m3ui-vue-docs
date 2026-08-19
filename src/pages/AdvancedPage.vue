<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  MCalendar, MScheduler, MKanban, MCommandPalette, MSpotlightSearch,
  MButton, MCard, MChip, MShader, MSlider, MSegmentedButton, MIconButton, MIcon,
} from '@m3ui-vue/m3ui-vue'
import { MChart } from '@m3ui-vue/m3ui-vue/chart'
import type { CalendarEvent, SchedulerEvent, KanbanColumn, CommandItem, SpotlightResult, SegmentedOption } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import type { PropDef } from '@/components/PropsTable.vue'

/* ── MCalendar ────────────────────────────────────────────────────────── */

const calendarEvents: CalendarEvent[] = [
  { id: '1', title: 'Team Meeting', date: '2026-06-05', color: 'primary', icon: 'groups' },
  { id: '2', title: 'Release v2', date: '2026-06-12', color: 'success', icon: 'rocket_launch' },
  { id: '3', title: 'Code Review', date: '2026-06-18', color: 'tertiary', icon: 'code' },
  { id: '4', title: 'Bug Bash', date: '2026-06-25', color: 'error', icon: 'bug_report' },
]

const calendarProps: PropDef[] = [
  { name: 'events', type: 'CalendarEvent[]', default: '[]', description: 'Array of { id, title, date (YYYY-MM-DD), color?, icon? }' },
  { name: 'locale', type: 'string', default: "'es-ES'", description: 'Locale for month/day names' },
  { name: 'todayLabel', type: 'string', default: "'Today'", description: 'Label for Today button' },
  { name: 'prevMonthLabel', type: 'string', default: "'Previous month'", description: 'Aria label for previous month button' },
  { name: 'nextMonthLabel', type: 'string', default: "'Next month'", description: 'Aria label for next month button' },
]

/* ── MScheduler ───────────────────────────────────────────────────────── */

function getWeekDate(dayOffset: number, hour: number, min = 0) {
  const d = new Date()
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff + dayOffset)
  d.setHours(hour, min, 0, 0)
  return d.toISOString()
}

const schedulerEvents: SchedulerEvent[] = [
  { id: '1', title: 'Standup', start: getWeekDate(0, 9), end: getWeekDate(0, 9, 30), color: 'primary' },
  { id: '2', title: 'Design Review', start: getWeekDate(1, 14), end: getWeekDate(1, 15, 30), color: 'tertiary' },
  { id: '3', title: 'Sprint Planning', start: getWeekDate(3, 10), end: getWeekDate(3, 12), color: 'secondary' },
]

const schedulerProps: PropDef[] = [
  { name: 'events', type: 'SchedulerEvent[]', default: '[]', description: 'Array of { id, title, start (ISO datetime), end (ISO datetime), color? }' },
  { name: 'view', type: "'week' | 'day'", default: "'week'", description: 'View mode' },
  { name: 'startHour', type: 'number', default: '7', description: 'First visible hour' },
  { name: 'endHour', type: 'number', default: '22', description: 'Last visible hour' },
  { name: 'locale', type: 'string', default: "'es-ES'", description: 'Locale for date formatting' },
  { name: 'prevLabel', type: 'string', default: "'Previous'", description: 'Aria label for previous navigation' },
  { name: 'nextLabel', type: 'string', default: "'Next'", description: 'Aria label for next navigation' },
  { name: 'todayLabel', type: 'string', default: "'Today'", description: 'Label for Today button' },
  { name: 'dayViewLabel', type: 'string', default: "'Day'", description: 'Label for Day view toggle' },
  { name: 'weekViewLabel', type: 'string', default: "'Week'", description: 'Label for Week view toggle' },
]

/* ── MKanban ──────────────────────────────────────────────────────────── */

const kanbanColumns = ref<KanbanColumn[]>([
  {
    id: 'todo', title: 'To Do', color: 'primary',
    cards: [
      { id: '1', title: 'Design system tokens', tag: 'Design' },
      { id: '2', title: 'Write unit tests', tag: 'Dev' },
    ],
  },
  {
    id: 'progress', title: 'In Progress', color: 'tertiary',
    cards: [
      { id: '3', title: 'Build components', tag: 'Dev' },
    ],
  },
  {
    id: 'done', title: 'Done', color: 'success',
    cards: [
      { id: '4', title: 'Project setup', tag: 'Ops' },
      { id: '5', title: 'CI pipeline', tag: 'Ops' },
    ],
  },
])

const kanbanProps: PropDef[] = [
  { name: 'modelValue', type: 'KanbanColumn[]', description: 'Array of columns with cards (v-model)' },
]

/* ── MCommandPalette ──────────────────────────────────────────────────── */

const paletteOpen = ref(false)

const commandItems: CommandItem[] = [
  { id: 'new', label: 'New File', icon: 'add', shortcut: 'Ctrl+N', group: 'File' },
  { id: 'open', label: 'Open File', icon: 'folder_open', shortcut: 'Ctrl+O', group: 'File' },
  { id: 'save', label: 'Save', icon: 'save', shortcut: 'Ctrl+S', group: 'File' },
  { id: 'theme', label: 'Toggle Theme', icon: 'dark_mode', group: 'Preferences' },
  { id: 'search', label: 'Search', icon: 'search', shortcut: 'Ctrl+F', group: 'Edit' },
  { id: 'replace', label: 'Find & Replace', icon: 'find_replace', shortcut: 'Ctrl+H', group: 'Edit' },
]

const commandPaletteProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state (v-model)' },
  { name: 'items', type: 'CommandItem[]', description: 'Array of { id, label, icon?, shortcut?, group?, disabled?, onSelect? }' },
  { name: 'placeholder', type: 'string', default: "'Search command...'", description: 'Search placeholder' },
  { name: 'noResultsText', type: 'string', default: "'No results'", description: 'Empty state text' },
  { name: 'hotkey', type: 'string', default: "'k'", description: 'Keyboard shortcut key (with Cmd/Ctrl)' },
  { name: 'navigateHint', type: 'string', default: "'navigate'", description: 'Hint text for arrow keys' },
  { name: 'selectHint', type: 'string', default: "'select'", description: 'Hint text for enter key' },
  { name: 'closeHint', type: 'string', default: "'close'", description: 'Hint text for escape key' },
]

/* ── MSpotlightSearch ─────────────────────────────────────────────────── */

const spotlightOpen = ref(false)
const spotlightResults = ref<SpotlightResult[]>([])

const allResults: SpotlightResult[] = [
  { id: '1', title: 'MButton', description: 'Action buttons with variants', icon: 'smart_button', category: 'Components' },
  { id: '2', title: 'MCard', description: 'Content containers', icon: 'dashboard', category: 'Components' },
  { id: '3', title: 'MDialog', description: 'Modal dialogs', icon: 'web_asset', category: 'Components' },
  { id: '4', title: 'Setup Guide', description: 'Getting started', icon: 'book', category: 'Docs' },
  { id: '5', title: 'Color Palettes', description: 'Theme colors', icon: 'palette', category: 'Styles' },
]

function onSearch(q: string) {
  if (!q.trim()) { spotlightResults.value = []; return }
  const lower = q.toLowerCase()
  spotlightResults.value = allResults.filter(r => r.title.toLowerCase().includes(lower) || r.description?.toLowerCase().includes(lower))
}

/* ── MChart ──────────────────────────────────────────────────────────── */

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [12, 19, 8, 15, 22, 17],
      backgroundColor: 'rgba(103, 80, 164, 0.6)',
      borderColor: 'rgb(103, 80, 164)',
      borderWidth: 2,
    },
    {
      label: 'Expenses',
      data: [8, 12, 6, 10, 14, 11],
      backgroundColor: 'rgba(0, 150, 136, 0.6)',
      borderColor: 'rgb(0, 150, 136)',
      borderWidth: 2,
    },
    {
      label: 'Profit',
      data: [4, 7, 2, 5, 8, 6],
      backgroundColor: 'rgba(255, 152, 0, 0.6)',
      borderColor: 'rgb(255, 152, 0)',
      borderWidth: 2,
    },
  ],
}

const pieData = {
  labels: ['Vue', 'React', 'Angular', 'Svelte', 'Solid'],
  datasets: [{
    data: [35, 28, 18, 12, 7],
    backgroundColor: [
      'rgb(103, 80, 164)',
      'rgb(0, 150, 136)',
      'rgb(233, 30, 99)',
      'rgb(255, 152, 0)',
      'rgb(33, 150, 243)',
    ],
  }],
}

const radarData = {
  labels: ['Speed', 'DX', 'Ecosystem', 'Bundle Size', 'Learning Curve', 'Community'],
  datasets: [
    {
      label: 'Vue',
      data: [90, 95, 80, 85, 90, 85],
      backgroundColor: 'rgba(103, 80, 164, 0.2)',
      borderColor: 'rgb(103, 80, 164)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(103, 80, 164)',
    },
    {
      label: 'React',
      data: [85, 80, 95, 70, 75, 95],
      backgroundColor: 'rgba(0, 150, 136, 0.2)',
      borderColor: 'rgb(0, 150, 136)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(0, 150, 136)',
    },
  ],
}

const chartProps: PropDef[] = [
  { name: 'type', type: "'line' | 'bar' | 'pie' | 'doughnut' | 'radar'", description: 'Chart type' },
  { name: 'data', type: 'Record<string, any>', description: 'Chart.js data object with labels and datasets' },
  { name: 'options', type: 'Record<string, any>', description: 'Chart.js options' },
  { name: 'height', type: 'string', default: "'300px'", description: 'Chart height' },
]

const spotlightSearchProps: PropDef[] = [
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state (v-model)' },
  { name: 'results', type: 'SpotlightResult[]', default: '[]', description: 'Search results to display' },
  { name: 'placeholder', type: 'string', default: "'Search...'", description: 'Search placeholder' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading spinner' },
  { name: 'noResultsText', type: 'string', default: "'No results'", description: 'Empty state text' },
  { name: 'hotkey', type: 'string', default: "'/'", description: 'Keyboard shortcut' },
  { name: 'debounce', type: 'number', default: '0', description: 'Debounce delay in ms for search event' },
  { name: 'navigateHint', type: 'string', default: "'navigate'", description: 'Hint text for arrow keys' },
  { name: 'openHint', type: 'string', default: "'open'", description: 'Hint text for enter key' },
  { name: 'closeHint', type: 'string', default: "'close'", description: 'Hint text for escape key' },
]

/* ── MShader ──────────────────────────────────────────────────────────── */

const plasmaCode = `void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.xy;
  vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0.0, 2.0, 4.0));
  fragColor = vec4(col, 1.0);
}`

const sceneGlsl = `// Raymarched scene: three orbiting metaballs over a reflective checkered floor,
// with soft shadows, specular highlights and fresnel rim lighting.

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float map(vec3 p, float t) {
  vec3 c1 = vec3(sin(t * 0.7) * 0.9, cos(t * 0.9) * 0.35 + 0.15, cos(t * 0.5) * 0.9);
  vec3 c2 = vec3(sin(t * 0.5 + 2.0) * 0.8, cos(t * 0.6 + 1.0) * 0.3 + 0.05, cos(t * 0.8 + 2.0) * 0.8);
  vec3 c3 = vec3(sin(t * 0.4 + 4.0) * 0.7, cos(t * 0.4 + 3.0) * 0.4, cos(t * 0.6 + 4.0) * 0.7);
  float d = length(p - c1) - 0.5;
  d = smin(d, length(p - c2) - 0.4, 0.4);
  d = smin(d, length(p - c3) - 0.35, 0.4);
  d = min(d, p.y + 1.2); // floor plane
  return d;
}

vec3 calcNormal(vec3 p, float t) {
  vec2 e = vec2(0.001, 0.0);
  return normalize(vec3(
    map(p + e.xyy, t) - map(p - e.xyy, t),
    map(p + e.yxy, t) - map(p - e.yxy, t),
    map(p + e.yyx, t) - map(p - e.yyx, t)
  ));
}

float softShadow(vec3 ro, vec3 rd, float t) {
  float res = 1.0;
  float dist = 0.02;
  for (int i = 0; i < 20; i++) {
    float h = map(ro + rd * dist, t);
    res = min(res, 12.0 * h / dist);
    dist += clamp(h, 0.02, 0.2);
    if (h < 0.001 || dist > 6.0) break;
  }
  return clamp(res, 0.0, 1.0);
}

vec3 hue2rgb(float h) {
  vec3 p = abs(fract(h + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0);
  return clamp(p - 1.0, 0.0, 1.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
  float t = iTime * uSpeed;

  // orbit camera: auto-rotates over time, steered further by the mouse position
  float az = t * 0.15 + (iMouse.x / iResolution.x - 0.5) * 3.0;
  float el = clamp(0.45 + (iMouse.y / iResolution.y - 0.5) * 1.0, 0.1, 1.2);
  vec3 ro = vec3(cos(az) * cos(el), sin(el), sin(az) * cos(el)) * 4.0;
  vec3 fwd = normalize(vec3(0.0, -0.1, 0.0) - ro);
  vec3 right = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(right, fwd);
  vec3 rd = normalize(fwd * 1.6 + uv.x * right + uv.y * up);

  vec3 col = mix(vec3(0.02, 0.02, 0.05), hue2rgb(uHue + 0.55) * 0.15, 0.5 + 0.5 * rd.y);

  float dist = 0.0;
  bool hit = false;
  vec3 p = ro;
  for (int i = 0; i < 70; i++) {
    p = ro + rd * dist;
    float d = map(p, t);
    if (d < 0.001) { hit = true; break; }
    dist += d;
    if (dist > 18.0) break;
  }

  if (hit) {
    vec3 n = calcNormal(p, t);
    vec3 lightPos = vec3(3.0 * cos(t * 0.6), 3.5, 3.0 * sin(t * 0.6));
    vec3 l = normalize(lightPos - p);
    float diff = max(dot(n, l), 0.0);
    float sh = softShadow(p + n * 0.02, l, t);
    vec3 v = normalize(ro - p);
    float spec = pow(max(dot(n, normalize(l + v)), 0.0), 32.0);

    vec3 base;
    if (p.y < -1.19) {
      float chk = fract((floor(p.x * 1.5) + floor(p.z * 1.5)) * 0.5) * 2.0;
      base = mix(vec3(0.08, 0.08, 0.1), vec3(0.16, 0.16, 0.2), chk);
    } else {
      float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
      base = mix(hue2rgb(uHue), hue2rgb(uHue + 0.5), fres);
    }

    col = base * (0.15 + 0.85 * diff * sh) + spec * sh * 0.6;
    col = mix(col, vec3(0.02, 0.02, 0.05), smoothstep(6.0, 18.0, dist));
  }

  fragColor = vec4(pow(col, vec3(0.4545)), 1.0);
}`

const sceneWgsl = `struct M3Uniforms { time: f32, resolution: vec2f, mouse: vec4f, frame: f32 }
@group(0) @binding(0) var<uniform> u: M3Uniforms;
// Custom uniforms are packed by declaration order, one vec4 slot each: [0]=uSpeed, [1]=uHue.
@group(0) @binding(1) var<uniform> custom: array<vec4f, 2>;

fn smin(a: f32, b: f32, k: f32) -> f32 {
  let h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

fn map(p: vec3f, t: f32) -> f32 {
  let c1 = vec3f(sin(t * 0.7) * 0.9, cos(t * 0.9) * 0.35 + 0.15, cos(t * 0.5) * 0.9);
  let c2 = vec3f(sin(t * 0.5 + 2.0) * 0.8, cos(t * 0.6 + 1.0) * 0.3 + 0.05, cos(t * 0.8 + 2.0) * 0.8);
  let c3 = vec3f(sin(t * 0.4 + 4.0) * 0.7, cos(t * 0.4 + 3.0) * 0.4, cos(t * 0.6 + 4.0) * 0.7);
  var d = length(p - c1) - 0.5;
  d = smin(d, length(p - c2) - 0.4, 0.4);
  d = smin(d, length(p - c3) - 0.35, 0.4);
  d = min(d, p.y + 1.2);
  return d;
}

fn calcNormal(p: vec3f, t: f32) -> vec3f {
  let e = vec2f(0.001, 0.0);
  return normalize(vec3f(
    map(p + e.xyy, t) - map(p - e.xyy, t),
    map(p + e.yxy, t) - map(p - e.yxy, t),
    map(p + e.yyx, t) - map(p - e.yyx, t),
  ));
}

fn softShadow(ro: vec3f, rd: vec3f, t: f32) -> f32 {
  var res = 1.0;
  var dist = 0.02;
  for (var i = 0; i < 20; i = i + 1) {
    let h = map(ro + rd * dist, t);
    res = min(res, 12.0 * h / dist);
    dist = dist + clamp(h, 0.02, 0.2);
    if (h < 0.001 || dist > 6.0) { break; }
  }
  return clamp(res, 0.0, 1.0);
}

fn hue2rgb(h: f32) -> vec3f {
  let p = abs(fract(vec3f(h) + vec3f(0.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0);
  return clamp(p - vec3f(1.0), vec3f(0.0), vec3f(1.0));
}

@fragment
fn fs_main(@builtin(position) coord: vec4f) -> @location(0) vec4f {
  let uSpeed = custom[0].x;
  let uHue = custom[1].x;
  // WebGPU's builtin(position) is top-left/y-down; flip to match GLSL's bottom-left/y-up gl_FragCoord.
  let fragCoord = vec2f(coord.x, u.resolution.y - coord.y);
  let uv = (fragCoord - 0.5 * u.resolution) / u.resolution.y;
  let t = u.time * uSpeed;

  let az = t * 0.15 + (u.mouse.x / u.resolution.x - 0.5) * 3.0;
  let el = clamp(0.45 + (u.mouse.y / u.resolution.y - 0.5) * 1.0, 0.1, 1.2);
  let ro = vec3f(cos(az) * cos(el), sin(el), sin(az) * cos(el)) * 4.0;
  let fwd = normalize(vec3f(0.0, -0.1, 0.0) - ro);
  let right = normalize(cross(fwd, vec3f(0.0, 1.0, 0.0)));
  let up = cross(right, fwd);
  let rd = normalize(fwd * 1.6 + uv.x * right + uv.y * up);

  var col = mix(vec3f(0.02, 0.02, 0.05), hue2rgb(uHue + 0.55) * 0.15, vec3f(0.5 + 0.5 * rd.y));

  var dist = 0.0;
  var hit = false;
  var p = ro;
  for (var i = 0; i < 70; i = i + 1) {
    p = ro + rd * dist;
    let d = map(p, t);
    if (d < 0.001) { hit = true; break; }
    dist = dist + d;
    if (dist > 18.0) { break; }
  }

  if (hit) {
    let n = calcNormal(p, t);
    let lightPos = vec3f(3.0 * cos(t * 0.6), 3.5, 3.0 * sin(t * 0.6));
    let l = normalize(lightPos - p);
    let diff = max(dot(n, l), 0.0);
    let sh = softShadow(p + n * 0.02, l, t);
    let v = normalize(ro - p);
    let spec = pow(max(dot(n, normalize(l + v)), 0.0), 32.0);

    var base: vec3f;
    if (p.y < -1.19) {
      let chk = fract((floor(p.x * 1.5) + floor(p.z * 1.5)) * 0.5) * 2.0;
      base = mix(vec3f(0.08, 0.08, 0.1), vec3f(0.16, 0.16, 0.2), vec3f(chk));
    } else {
      let fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
      base = mix(hue2rgb(uHue), hue2rgb(uHue + 0.5), vec3f(fres));
    }

    col = base * (0.15 + 0.85 * diff * sh) + vec3f(spec * sh * 0.6);
    col = mix(col, vec3f(0.02, 0.02, 0.05), vec3f(smoothstep(6.0, 18.0, dist)));
  }

  return vec4f(pow(col, vec3f(0.4545)), 1.0);
}`

const shaderRef = ref<InstanceType<typeof MShader> | null>(null)
const shaderRenderer = ref<string | null>(null)
const uSpeed = ref(1)
const uHue = ref(0.62)

function onShaderReady(renderer: 'webgpu' | 'webgl') {
  shaderRenderer.value = renderer
}

// 2D domain-warped paint swirl, in the spirit of hypnotic card-game backgrounds (Balatro et al.) —
// a handful of rotate-and-warp iterations feeding a cosine color palette. GLSL/WebGL2 only: this
// example is about compositing MShader into a real layout, not about the dual-backend story.
const swirlGlsl = `vec3 palette(float t, float hue) {
  vec3 a = vec3(0.55);
  vec3 b = vec3(0.45);
  vec3 c = vec3(1.0);
  vec3 d = vec3(hue, hue + 0.33, hue + 0.67);
  return a + b * cos(6.28318 * (c * t + d));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
  float t = iTime * uSpeed * 0.3;

  vec2 p = uv * 1.6;
  float swirl = 0.0;
  float amp = 1.0;
  for (int i = 0; i < 5; i++) {
    float ang = swirl * 0.6 + t * (0.5 + float(i) * 0.15);
    float s = sin(ang);
    float c = cos(ang);
    p = mat2(c, -s, s, c) * p;
    p += 0.35 * vec2(sin(p.y * 1.4 + t), cos(p.x * 1.4 - t)) / amp;
    swirl += sin(p.x * 2.0 + p.y * 2.0 + t) * amp;
    amp *= 0.55;
  }

  float radial = length(uv);
  vec3 col = palette(swirl * 0.5 + 0.5 - radial * 0.4, uHue);
  col *= 0.7 + 0.5 * smoothstep(1.3, 0.0, radial);
  fragColor = vec4(col, 1.0);
}`

const heroMode = ref<'calm' | 'energetic'>('calm')
const heroSpeed = computed(() => (heroMode.value === 'calm' ? 0.4 : 1.6))
const heroHue = ref(0.78)
const heroModeOptions: SegmentedOption[] = [
  { value: 'calm', label: 'Calm' },
  { value: 'energetic', label: 'Energetic', icon: 'bolt' },
]
function shuffleHeroHue() {
  heroHue.value = Math.random()
}

const shaderProps: PropDef[] = [
  { name: 'code', type: 'string', description: 'Required GLSL fragment shader (Shadertoy-style: define `mainImage(out vec4 fragColor, in vec2 fragCoord)`). Runs on WebGL2, the always-available baseline.' },
  { name: 'wgsl', type: 'string', description: 'Optional WGSL fragment shader (define `fs_main`). Runs on WebGPU when available and selected.' },
  { name: 'renderer', type: "'auto' | 'webgpu' | 'webgl'", default: "'auto'", description: "'auto' uses WebGPU when `wgsl` is set and supported, else WebGL2" },
  { name: 'uniforms', type: 'Record<string, number | number[]>', description: 'Custom uniforms. Keys are locked in at mount; values update every frame.' },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the render loop and the shader clock' },
  { name: 'pixelRatio', type: 'number', default: 'devicePixelRatio (capped at 2)', description: 'Backing store resolution multiplier' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Advanced</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Complex interactive components for calendars, kanban boards, schedulers, and search.
    </p>

    <!-- ── MCalendar ──────────────────────────────────────────────────────── -->
    <h2 id="mcalendar" class="mb-4 text-headline-small font-medium">MCalendar</h2>

    <ComponentDemo
      title="Calendar with Events"
      description="Monthly calendar view with color-coded events and icons."
      :code="`<MCalendar :events=&quot;events&quot; locale=&quot;en-US&quot; />`"
      :script="`import type { CalendarEvent } from '@m3ui-vue/m3ui-vue'

const events: CalendarEvent[] = [
  { id: '1', title: 'Team Meeting', date: '2026-06-05', color: 'primary', icon: 'groups' },
  { id: '2', title: 'Release v2', date: '2026-06-12', color: 'success', icon: 'rocket_launch' },
  { id: '3', title: 'Code Review', date: '2026-06-18', color: 'tertiary', icon: 'code' },
  { id: '4', title: 'Bug Bash', date: '2026-06-25', color: 'error', icon: 'bug_report' },
]`"
    >
      <div class="w-full">
        <MCalendar :events="calendarEvents" locale="en-US" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="calendarProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <MCard variant="outlined" class="overflow-x-auto p-4">
      <table class="w-full text-body-medium">
        <thead>
          <tr class="border-b border-outline-variant text-left">
            <th class="pb-2 pr-4 font-medium">Event</th>
            <th class="pb-2 font-medium">Payload</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-outline-variant/50">
            <td class="py-2 pr-4 font-mono text-body-small">dateClick</td>
            <td class="py-2 text-on-surface-variant">string (YYYY-MM-DD)</td>
          </tr>
          <tr>
            <td class="py-2 pr-4 font-mono text-body-small">eventClick</td>
            <td class="py-2 text-on-surface-variant">CalendarEvent</td>
          </tr>
        </tbody>
      </table>
    </MCard>

    <!-- ── MScheduler ─────────────────────────────────────────────────────── -->
    <h2 id="mscheduler" class="mb-4 mt-14 text-headline-small font-medium">MScheduler</h2>

    <ComponentDemo
      title="Weekly Scheduler"
      description="Week view scheduler with time-based events. Events are placed on the grid based on their start/end ISO datetimes."
      :code="`<MScheduler :events=&quot;events&quot; view=&quot;week&quot; :start-hour=&quot;8&quot; :end-hour=&quot;18&quot; locale=&quot;en-US&quot; />`"
      :script="`import type { SchedulerEvent } from '@m3ui-vue/m3ui-vue'

function getWeekDate(dayOffset: number, hour: number, min = 0) {
  const d = new Date()
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff + dayOffset)
  d.setHours(hour, min, 0, 0)
  return d.toISOString()
}

const events: SchedulerEvent[] = [
  { id: '1', title: 'Standup', start: getWeekDate(0, 9), end: getWeekDate(0, 9, 30), color: 'primary' },
  { id: '2', title: 'Design Review', start: getWeekDate(1, 14), end: getWeekDate(1, 15, 30), color: 'tertiary' },
  { id: '3', title: 'Sprint Planning', start: getWeekDate(3, 10), end: getWeekDate(3, 12), color: 'secondary' },
]`"
    >
      <div class="w-full">
        <MScheduler :events="schedulerEvents" view="week" :start-hour="8" :end-hour="18" locale="en-US" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="schedulerProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <MCard variant="outlined" class="overflow-x-auto p-4">
      <table class="w-full text-body-medium">
        <thead>
          <tr class="border-b border-outline-variant text-left">
            <th class="pb-2 pr-4 font-medium">Event</th>
            <th class="pb-2 font-medium">Payload</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-outline-variant/50">
            <td class="py-2 pr-4 font-mono text-body-small">eventClick</td>
            <td class="py-2 text-on-surface-variant">SchedulerEvent</td>
          </tr>
          <tr>
            <td class="py-2 pr-4 font-mono text-body-small">slotClick</td>
            <td class="py-2 text-on-surface-variant">{ date, hour }</td>
          </tr>
        </tbody>
      </table>
    </MCard>

    <!-- ── MKanban ────────────────────────────────────────────────────────── -->
    <h2 id="mkanban" class="mb-4 mt-14 text-headline-small font-medium">MKanban</h2>

    <ComponentDemo
      title="Kanban Board"
      description="Drag-and-drop kanban board with customizable card rendering via the #card slot."
      :code="`<MKanban v-model=&quot;columns&quot;>
    <template #card=&quot;{ card }&quot;>
      <p class=&quot;text-body-medium&quot;>{{ card.title }}</p>
      <MChip tone=&quot;primary&quot; class=&quot;mt-1&quot;>{{ card.tag }}</MChip>
    </template>
  </MKanban>`"
      :script="`import { ref } from 'vue'
import type { KanbanColumn } from '@m3ui-vue/m3ui-vue'

const columns = ref&lt;KanbanColumn[]&gt;([
  {
    id: 'todo', title: 'To Do', color: 'primary',
    cards: [
      { id: '1', title: 'Design system tokens', tag: 'Design' },
      { id: '2', title: 'Write unit tests', tag: 'Dev' },
    ],
  },
  {
    id: 'progress', title: 'In Progress', color: 'tertiary',
    cards: [
      { id: '3', title: 'Build components', tag: 'Dev' },
    ],
  },
  {
    id: 'done', title: 'Done', color: 'success',
    cards: [
      { id: '4', title: 'Project setup', tag: 'Ops' },
      { id: '5', title: 'CI pipeline', tag: 'Ops' },
    ],
  },
])`"
    >
      <div class="w-full">
        <MKanban v-model="kanbanColumns">
          <template #card="{ card }">
            <p class="text-body-medium">{{ card.title }}</p>
            <MChip tone="primary" class="mt-1">{{ card.tag }}</MChip>
          </template>
        </MKanban>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="kanbanProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <MCard variant="outlined" class="overflow-x-auto p-4">
      <table class="w-full text-body-medium">
        <thead>
          <tr class="border-b border-outline-variant text-left">
            <th class="pb-2 pr-4 font-medium">Event</th>
            <th class="pb-2 font-medium">Payload</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-outline-variant/50">
            <td class="py-2 pr-4 font-mono text-body-small">cardMove</td>
            <td class="py-2 text-on-surface-variant">{ cardId, fromColumn, toColumn, toIndex }</td>
          </tr>
          <tr>
            <td class="py-2 pr-4 font-mono text-body-small">cardClick</td>
            <td class="py-2 text-on-surface-variant">{ card, columnId }</td>
          </tr>
        </tbody>
      </table>
    </MCard>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <MCard variant="outlined" class="overflow-x-auto p-4">
      <table class="w-full text-body-medium">
        <thead>
          <tr class="border-b border-outline-variant text-left">
            <th class="pb-2 pr-4 font-medium">Slot</th>
            <th class="pb-2 font-medium">Props</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="py-2 pr-4 font-mono text-body-small">#card</td>
            <td class="py-2 text-on-surface-variant">{ card, columnId }</td>
          </tr>
        </tbody>
      </table>
    </MCard>

    <!-- ── MCommandPalette ────────────────────────────────────────────────── -->
    <h2 id="mcommandpalette" class="mb-4 mt-14 text-headline-small font-medium">MCommandPalette</h2>

    <ComponentDemo
      title="Command Palette"
      description="A searchable command palette with keyboard shortcut support. Press Ctrl+K to open, or use the button below."
      :code="`<MButton @click=&quot;open = true&quot;>Open Command Palette</MButton>
  <MCommandPalette v-model=&quot;open&quot; :items=&quot;items&quot; />`"
      :script="`import { ref } from 'vue'
import type { CommandItem } from '@m3ui-vue/m3ui-vue'

const open = ref(false)

const items: CommandItem[] = [
  { id: 'new', label: 'New File', icon: 'add', shortcut: 'Ctrl+N', group: 'File' },
  { id: 'open', label: 'Open File', icon: 'folder_open', shortcut: 'Ctrl+O', group: 'File' },
  { id: 'save', label: 'Save', icon: 'save', shortcut: 'Ctrl+S', group: 'File' },
  { id: 'theme', label: 'Toggle Theme', icon: 'dark_mode', group: 'Preferences' },
  { id: 'search', label: 'Search', icon: 'search', shortcut: 'Ctrl+F', group: 'Edit' },
  { id: 'replace', label: 'Find &amp; Replace', icon: 'find_replace', shortcut: 'Ctrl+H', group: 'Edit' },
]`"
    >
      <MButton @click="paletteOpen = true">Open Command Palette</MButton>
      <MCommandPalette v-model="paletteOpen" :items="commandItems" />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="commandPaletteProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <MCard variant="outlined" class="overflow-x-auto p-4">
      <table class="w-full text-body-medium">
        <thead>
          <tr class="border-b border-outline-variant text-left">
            <th class="pb-2 pr-4 font-medium">Event</th>
            <th class="pb-2 font-medium">Payload</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="py-2 pr-4 font-mono text-body-small">select</td>
            <td class="py-2 text-on-surface-variant">CommandItem</td>
          </tr>
        </tbody>
      </table>
    </MCard>

    <!-- ── MSpotlightSearch ───────────────────────────────────────────────── -->
    <h2 id="mspotlightsearch" class="mb-4 mt-14 text-headline-small font-medium">MSpotlightSearch</h2>

    <ComponentDemo
      title="Spotlight Search"
      description="A spotlight-style search overlay with filtered results. Press / to open, or use the button below."
      :code="`<script setup>
import { ref } from 'vue'
import type { SpotlightResult } from '@m3ui-vue/m3ui-vue'

const open = ref(false)
const results = ref&lt;SpotlightResult[]&gt;([])

const allResults: SpotlightResult[] = [
  { id: '1', title: 'MButton', description: 'Action buttons with variants', icon: 'smart_button', category: 'Components' },
  { id: '2', title: 'MCard', description: 'Content containers', icon: 'dashboard', category: 'Components' },
  { id: '3', title: 'MDialog', description: 'Modal dialogs', icon: 'web_asset', category: 'Components' },
  { id: '4', title: 'Setup Guide', description: 'Getting started', icon: 'book', category: 'Docs' },
  { id: '5', title: 'Color Palettes', description: 'Theme colors', icon: 'palette', category: 'Styles' },
]

function onSearch(q: string) {
  if (!q.trim()) { results.value = []; return }
  const lower = q.toLowerCase()
  results.value = allResults.filter(r =&gt;
    r.title.toLowerCase().includes(lower) || r.description?.toLowerCase().includes(lower)
  )
}
<\/script>

<template>
  <MButton @click=&quot;open = true&quot;>Open Spotlight</MButton>
  <MSpotlightSearch
    v-model=&quot;open&quot;
    :results=&quot;results&quot;
    placeholder=&quot;Search components...&quot;
    @search=&quot;onSearch&quot;
  />
</template>`"
    >
      <MButton @click="spotlightOpen = true">Open Spotlight</MButton>
      <MSpotlightSearch
        v-model="spotlightOpen"
        :results="spotlightResults"
        placeholder="Search components..."
        @search="onSearch"
      />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="spotlightSearchProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <MCard variant="outlined" class="overflow-x-auto p-4">
      <table class="w-full text-body-medium">
        <thead>
          <tr class="border-b border-outline-variant text-left">
            <th class="pb-2 pr-4 font-medium">Event</th>
            <th class="pb-2 font-medium">Payload</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-outline-variant/50">
            <td class="py-2 pr-4 font-mono text-body-small">search</td>
            <td class="py-2 text-on-surface-variant">string (search query)</td>
          </tr>
          <tr>
            <td class="py-2 pr-4 font-mono text-body-small">select</td>
            <td class="py-2 text-on-surface-variant">SpotlightResult</td>
          </tr>
        </tbody>
      </table>
    </MCard>

    <!-- ── MChart ──────────────────────────────────────────────────────── -->
    <h2 id="mchart" class="mb-4 mt-14 text-headline-small font-medium">MChart</h2>

    <ComponentDemo
      title="Bar & Line"
      description="Multi-dataset charts with custom colors per series."
      :code="`<script setup>
const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    { label: 'Revenue', data: [12, 19, 8, 15, 22, 17], backgroundColor: 'rgba(103, 80, 164, 0.6)', borderColor: 'rgb(103, 80, 164)' },
    { label: 'Expenses', data: [8, 12, 6, 10, 14, 11], backgroundColor: 'rgba(0, 150, 136, 0.6)', borderColor: 'rgb(0, 150, 136)' },
    { label: 'Profit', data: [4, 7, 2, 5, 8, 6], backgroundColor: 'rgba(255, 152, 0, 0.6)', borderColor: 'rgb(255, 152, 0)' },
  ],
}
<\/script>

<template>
  <MChart type=&quot;bar&quot; :data=&quot;data&quot; height=&quot;280px&quot; />
  <MChart type=&quot;line&quot; :data=&quot;data&quot; height=&quot;280px&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MCard variant="outlined" class="p-4">
          <p class="mb-2 text-label-medium font-medium text-on-surface-variant">Bar</p>
          <MChart type="bar" :data="chartData" height="260px" />
        </MCard>
        <MCard variant="outlined" class="p-4">
          <p class="mb-2 text-label-medium font-medium text-on-surface-variant">Line</p>
          <MChart type="line" :data="chartData" height="260px" />
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Pie & Doughnut"
      description="Circular charts with distinct colors per segment."
      :code="`<script setup>
const data = {
  labels: ['Vue', 'React', 'Angular', 'Svelte', 'Solid'],
  datasets: [{
    data: [35, 28, 18, 12, 7],
    backgroundColor: ['rgb(103,80,164)', 'rgb(0,150,136)', 'rgb(233,30,99)', 'rgb(255,152,0)', 'rgb(33,150,243)'],
  }],
}
<\/script>

<template>
  <MChart type=&quot;pie&quot; :data=&quot;data&quot; height=&quot;280px&quot; />
  <MChart type=&quot;doughnut&quot; :data=&quot;data&quot; height=&quot;280px&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MCard variant="outlined" class="p-4">
          <p class="mb-2 text-label-medium font-medium text-on-surface-variant">Pie</p>
          <MChart type="pie" :data="pieData" height="260px" />
        </MCard>
        <MCard variant="outlined" class="p-4">
          <p class="mb-2 text-label-medium font-medium text-on-surface-variant">Doughnut</p>
          <MChart type="doughnut" :data="pieData" height="260px" />
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Radar"
      description="Multi-axis comparison chart, ideal for comparing feature sets."
      :code="`<script setup>
const data = {
  labels: ['Speed', 'DX', 'Ecosystem', 'Bundle Size', 'Learning Curve', 'Community'],
  datasets: [
    { label: 'Vue', data: [90, 95, 80, 85, 90, 85], backgroundColor: 'rgba(103,80,164,0.2)', borderColor: 'rgb(103,80,164)' },
    { label: 'React', data: [85, 80, 95, 70, 75, 95], backgroundColor: 'rgba(0,150,136,0.2)', borderColor: 'rgb(0,150,136)' },
  ],
}
<\/script>

<template>
  <MChart type=&quot;radar&quot; :data=&quot;data&quot; height=&quot;350px&quot; />
</template>`"
    >
      <div class="mx-auto w-full max-w-lg">
        <MCard variant="outlined" class="p-4">
          <p class="mb-2 text-label-medium font-medium text-on-surface-variant">Radar</p>
          <MChart type="radar" :data="radarData" height="320px" />
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="chartProps" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Peer Dependencies</p>
      <pre class="rounded-lg bg-surface-container p-3 text-body-small"><code>chart.js  vue-chartjs</code></pre>
    </MCard>

    <!-- ── MShader ────────────────────────────────────────────────────────── -->
    <h2 id="mshader" class="mb-4 mt-14 text-headline-small font-medium">MShader</h2>
    <p class="mb-6 text-body-large text-on-surface-variant">
      A canvas container for hand-written shaders. Give it a GLSL fragment shader (Shadertoy-style — it
      runs on WebGL2 and works everywhere) and, optionally, a WGSL fragment shader that runs on WebGPU
      when the browser supports it. <code class="text-body-small">renderer=&quot;auto&quot;</code> picks WebGPU
      whenever both a <code class="text-body-small">wgsl</code> source and browser support are present,
      otherwise it falls back to WebGL2 — so the same component works as a drop-in on old and new browsers alike.
    </p>

    <ComponentDemo
      title="Basic: animated plasma (GLSL / WebGL2)"
      description="The classic Shadertoy starter shader — iTime, iResolution and a mainImage() function are all MShader needs."
      flush
      :code="`<template>
  <MShader :code=&quot;plasma&quot; class=&quot;h-72 w-full overflow-hidden rounded-xl&quot; />
</template>`"
      :script="`const plasma = \`void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.xy;
  vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0.0, 2.0, 4.0));
  fragColor = vec4(col, 1.0);
}\``"
    >
      <div class="h-72 w-full overflow-hidden rounded-xl">
        <MShader :code="plasmaCode" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Advanced: raymarched scene, WGSL + WebGL2, custom uniforms, camera control"
      description="A full raymarched 3D scene — three orbiting metaballs over a reflective checkered floor, soft shadows, specular highlights and fresnel rim lighting — written twice, once in GLSL and once in WGSL, sharing two reactive custom uniforms. renderer='auto' runs the WGSL/WebGPU path when supported, otherwise the GLSL/WebGL2 path, with no change needed from the consumer."
      flush
      :code="`<template>
  <MShader
    ref=&quot;shaderRef&quot;
    :code=&quot;glsl&quot;
    :wgsl=&quot;wgsl&quot;
    :uniforms=&quot;{ uSpeed, uHue }&quot;
    class=&quot;h-80 w-full overflow-hidden rounded-xl&quot;
    @ready=&quot;renderer = $event&quot;
  />
</template>`"
      :script="`const uSpeed = ref(1)     // custom uniform, float — animation & orbit speed
const uHue = ref(0.62)   // custom uniform, float — material color theme
const renderer = ref&lt;string | null&gt;(null)

// GLSL: custom uniform types are inferred from the JS value (number -> float, etc.)
const glsl = \`${sceneGlsl.replace(/`/g, '\\`')}\`

// WGSL: custom uniforms are packed one vec4 slot per key, in declaration order —
// declare a matching array<vec4f, N> in the shader and read .x for scalars.
const wgsl = \`${sceneWgsl.replace(/`/g, '\\`')}\``"
    >
      <div class="w-full">
        <div class="h-80 w-full overflow-hidden rounded-xl">
          <MShader
            ref="shaderRef"
            :code="sceneGlsl"
            :wgsl="sceneWgsl"
            :uniforms="{ uSpeed, uHue }"
            @ready="onShaderReady"
          />
        </div>
        <div class="mt-4 flex flex-wrap items-center gap-4">
          <MChip :tone="shaderRenderer === 'webgpu' ? 'tertiary' : 'primary'">
            Renderer: {{ shaderRenderer ?? 'loading…' }}
          </MChip>
          <MButton size="sm" variant="outlined" @click="shaderRef?.pause()">Pause</MButton>
          <MButton size="sm" variant="outlined" @click="shaderRef?.play()">Play</MButton>
          <MButton size="sm" variant="text" @click="shaderRef?.restart()">Restart</MButton>
          <div class="flex items-center gap-2">
            <span class="text-label-medium text-on-surface-variant">Speed</span>
            <MSlider v-model="uSpeed" :min="0.1" :max="3" :step="0.1" class="w-32" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-label-medium text-on-surface-variant">Hue</span>
            <MSlider v-model="uHue" :min="0" :max="1" :step="0.01" class="w-32" />
          </div>
        </div>
        <p class="mt-3 text-body-small text-on-surface-variant">
          Move the mouse over the canvas to orbit the camera — position feeds into
          <code class="text-body-small">iMouse</code> (GLSL) / <code class="text-body-small">u.mouse</code>
          (WGSL) in both shaders, on top of the automatic time-based rotation.
        </p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Real-world: animated hero background"
      description="The pattern for using MShader inside an actual layout: an absolutely-positioned wrapper behind the content (not a class override on MShader itself), a scrim for text contrast, and ordinary M3 components on top — including a couple of controls wired straight into the shader's own uniforms."
      flush
      :code="`<template>
  <div class=&quot;relative h-[420px] w-full overflow-hidden rounded-2xl&quot;>
    <!-- background layer: MShader fills its own wrapper, positioned behind the content -->
    <div class=&quot;absolute inset-0&quot;>
      <MShader :code=&quot;swirl&quot; :uniforms=&quot;{ uSpeed: heroSpeed, uHue: heroHue }&quot; />
    </div>
    <!-- scrim for text legibility -->
    <div class=&quot;pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20&quot;></div>

    <!-- ordinary app UI, composited on top -->
    <div class=&quot;relative z-10 flex h-full flex-col items-center justify-center gap-4 px-8 text-center&quot;>
      <span class=&quot;rounded-full bg-white/15 px-3 py-1 text-label-medium text-white ring-1 ring-white/25&quot;>Live shader background</span>
      <h3 class=&quot;text-display-small font-semibold text-white drop-shadow-lg&quot;>Ship interfaces that feel alive</h3>
      <p class=&quot;max-w-md text-body-large text-white/85&quot;>MShader drops in as a background layer, no different from an image or a video.</p>
      <div class=&quot;flex flex-wrap items-center justify-center gap-3&quot;>
        <MButton size=&quot;lg&quot;>Get started</MButton>
        <MButton size=&quot;lg&quot; variant=&quot;elevated&quot;>View docs</MButton>
      </div>
    </div>

    <!-- controls sit in a frosted panel, not directly on the image, so normal M3 theming keeps its contrast -->
    <div class=&quot;absolute bottom-4 right-4 z-10 flex items-center gap-3 rounded-full bg-surface/90 p-2 pl-4 shadow-elevation-2 backdrop-blur-sm&quot;>
      <MSegmentedButton v-model=&quot;mode&quot; :options=&quot;modeOptions&quot; density=&quot;compact&quot; />
      <MIconButton icon=&quot;shuffle&quot; variant=&quot;filled&quot; label=&quot;Shuffle colors&quot; @click=&quot;heroHue = Math.random()&quot; />
    </div>
  </div>
</template>`"
      :script="`const heroMode = ref<'calm' | 'energetic'>('calm')
const heroSpeed = computed(() => (heroMode.value === 'calm' ? 0.4 : 1.6))
const heroHue = ref(0.78)
const modeOptions = [
  { value: 'calm', label: 'Calm' },
  { value: 'energetic', label: 'Energetic', icon: 'bolt' },
]

const swirl = \`${swirlGlsl.replace(/`/g, '\\`')}\``"
    >
      <div class="relative h-[420px] w-full overflow-hidden rounded-2xl">
        <div class="absolute inset-0">
          <MShader :code="swirlGlsl" :uniforms="{ uSpeed: heroSpeed, uHue: heroHue }" />
        </div>
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20"></div>

        <div class="relative z-10 flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-label-medium text-white ring-1 ring-white/25 backdrop-blur-sm">
            <MIcon name="auto_awesome" :size="14" />
            Live shader background
          </span>
          <h3 class="text-display-small font-semibold text-white drop-shadow-lg">Ship interfaces that feel alive</h3>
          <p class="max-w-md text-body-large text-white/85">
            MShader drops in as a background layer, no different from an image or a video — everything
            you see moving is a single fragment shader, reacting to the controls in the corner.
          </p>
          <div class="mt-1 flex flex-wrap items-center justify-center gap-3">
            <MButton size="lg">Get started</MButton>
            <MButton size="lg" variant="elevated">View docs</MButton>
          </div>
        </div>

        <div class="absolute bottom-4 right-4 z-10 flex items-center gap-3 rounded-full bg-surface/90 p-2 pl-4 shadow-elevation-2 backdrop-blur-sm">
          <span class="hidden text-label-medium text-on-surface-variant sm:inline">Mood</span>
          <MSegmentedButton v-model="heroMode" :options="heroModeOptions" density="compact" />
          <MIconButton icon="shuffle" variant="filled" label="Shuffle colors" @click="shuffleHeroHue" />
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="shaderProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <MCard variant="outlined" class="overflow-x-auto p-4">
      <table class="w-full text-body-medium">
        <thead>
          <tr class="border-b border-outline-variant text-left">
            <th class="pb-2 pr-4 font-medium">Event</th>
            <th class="pb-2 font-medium">Payload</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-outline-variant/50">
            <td class="py-2 pr-4 font-mono text-body-small">ready</td>
            <td class="py-2 text-on-surface-variant">renderer: 'webgpu' | 'webgl' — which backend ended up driving the canvas</td>
          </tr>
          <tr>
            <td class="py-2 pr-4 font-mono text-body-small">error</td>
            <td class="py-2 text-on-surface-variant">message: string — shader compile/link error, or a WebGPU runtime error</td>
          </tr>
        </tbody>
      </table>
    </MCard>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots &amp; exposed methods</h3>
    <MCard variant="outlined" class="overflow-x-auto p-4">
      <table class="w-full text-body-medium">
        <thead>
          <tr class="border-b border-outline-variant text-left">
            <th class="pb-2 pr-4 font-medium">Name</th>
            <th class="pb-2 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-outline-variant/50">
            <td class="py-2 pr-4 font-mono text-body-small">#loading</td>
            <td class="py-2 text-on-surface-variant">Shown while the backend initializes (default: MSpinner)</td>
          </tr>
          <tr class="border-b border-outline-variant/50">
            <td class="py-2 pr-4 font-mono text-body-small">#fallback</td>
            <td class="py-2 text-on-surface-variant">Shown when neither WebGL2 nor WebGPU is available at all</td>
          </tr>
          <tr class="border-b border-outline-variant/50">
            <td class="py-2 pr-4 font-mono text-body-small">#error{ message }</td>
            <td class="py-2 text-on-surface-variant">Shown on a shader compile/link/runtime error, with the message</td>
          </tr>
          <tr class="border-b border-outline-variant/50">
            <td class="py-2 pr-4 font-mono text-body-small">pause() / play() / restart()</td>
            <td class="py-2 text-on-surface-variant">Imperative playback control via a template ref</td>
          </tr>
          <tr>
            <td class="py-2 pr-4 font-mono text-body-small">canvas / renderer / status / context()</td>
            <td class="py-2 text-on-surface-variant">Raw canvas element, active backend, current status, and the raw WebGL2RenderingContext/GPUDevice for advanced use</td>
          </tr>
        </tbody>
      </table>
    </MCard>
  </div>
</template>
