<script setup lang="ts">
import { ref, computed } from 'vue'
import { MShader, MCard, MChip, MButton, MSegmentedButton, MIconButton, MIcon, MSlider } from '@m3ui-vue/m3ui-vue'
import type { SegmentedOption } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

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

const isPaused = ref(false)

const shaderProps: PropDef[] = [
  { name: 'code', type: 'string', description: 'GLSL fragment shader (Shadertoy-style: define `mainImage(out vec4 fragColor, in vec2 fragCoord)`). Runs on WebGL2, the always-available baseline. Required — there is no default.' },
  { name: 'wgsl', type: 'string', description: 'Optional WGSL fragment shader (define `fs_main`). Runs on WebGPU when available and selected.' },
  { name: 'renderer', type: "'auto' | 'webgpu' | 'webgl'", default: "'auto'", description: "'auto' uses WebGPU when `wgsl` is set and supported, else WebGL2" },
  { name: 'uniforms', type: 'Record<string, number | number[]>', description: 'Custom uniforms. Keys are locked in at mount; values update every frame.' },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the render loop and the shader clock' },
  { name: 'pixelRatio', type: 'number', default: 'devicePixelRatio (capped at 2)', description: 'Backing store resolution multiplier' },
]

const shaderEvents: EventDef[] = [
  { name: 'ready', payload: "renderer: 'webgpu' | 'webgl'", description: 'Emitted once the backend has initialized — which backend ended up driving the canvas' },
  { name: 'error', payload: 'message: string', description: 'Emitted on a shader compile/link error, or a WebGPU runtime error' },
]

const shaderSlots: SlotDef[] = [
  { name: 'loading', description: 'Shown while the backend initializes (default: MSpinner)' },
  { name: 'fallback', description: 'Shown when neither WebGL2 nor WebGPU is available at all' },
  { name: 'error', scope: '{ message }', description: 'Shown on a shader compile/link/runtime error, with the message' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MShader</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A canvas container for hand-written shaders. Give it a GLSL fragment shader (Shadertoy-style — it
      runs on WebGL2 and works everywhere) and, optionally, a WGSL fragment shader that runs on WebGPU
      when the browser supports it. <code class="text-body-small">renderer="auto"</code> picks WebGPU
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
      :script="`const uSpeed = ref(1)     // custom uniform, float — animation &amp; orbit speed
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
      title="paused prop"
      description="paused freezes both the render loop and the shader clock from mount, as a declarative alternative to the exposed pause()/play() methods used above."
      flush
      :code="`<template>
  <MShader :code=&quot;plasma&quot; :paused=&quot;isPaused&quot; class=&quot;h-40 w-full overflow-hidden rounded-xl&quot; />
  <MIconButton :icon=&quot;isPaused ? 'play_arrow' : 'pause'&quot; @click=&quot;isPaused = !isPaused&quot; />
</template>`"
    >
      <div class="flex w-full flex-col gap-3">
        <div class="h-40 w-full overflow-hidden rounded-xl">
          <MShader :code="plasmaCode" :paused="isPaused" />
        </div>
        <MIconButton :icon="isPaused ? 'play_arrow' : 'pause'" variant="tonal" :label="isPaused ? 'Play' : 'Pause'" @click="isPaused = !isPaused" />
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
    <EventsTable :events="shaderEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="shaderSlots" />

    <p class="mt-4 text-body-medium text-on-surface-variant">
      <strong class="text-on-surface">Exposed (via template ref):</strong>
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">pause()</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">play()</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">restart()</code> for
      imperative playback control, plus
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">canvas</code> /
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">renderer</code> /
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">status</code> /
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">context()</code> — the raw
      canvas element, active backend, current status, and the raw
      <code class="text-body-small">WebGL2RenderingContext</code>/<code class="text-body-small">GPUDevice</code>
      for advanced use.
    </p>

    <ComponentPager current="MShader" />
  </div>
</template>
