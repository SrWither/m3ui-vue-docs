/*
 * The "videos": every one is a fragment shader played by MShader. Instead of MShader's own clock
 * (iTime) they read `uTime`, the player's position in seconds, so pausing, seeking and the
 * playback speed change what you see. `uA`/`uB`/`uC` are the video's three colors and `uSeed`
 * makes two videos of the same kind differ. thumbs.ts renders the same code for thumbnails.
 */

export type Scene = 'aurora' | 'waves' | 'tunnel' | 'plasma' | 'stars' | 'blobs' | 'horizon' | 'rings'

export const scenes: Scene[] = ['aurora', 'waves', 'tunnel', 'plasma', 'stars', 'blobs', 'horizon', 'rings']

/** The uniforms every scene reads, with the shape MShader locks in at mount. */
export interface SceneUniforms {
  uTime: number
  uA: [number, number, number]
  uB: [number, number, number]
  uC: [number, number, number]
  uSeed: number
  [key: string]: number | number[]
}

const common = /* glsl */ `
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed * 17.0) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
vec2 uvOf(vec2 fragCoord) { return (fragCoord - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y); }
`

const bodies: Record<Scene, string> = {
  // Curtains of light over a night sky.
  aurora: /* glsl */ `
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.xy;
  vec2 p = uvOf(fragCoord);
  float t = uTime * 0.15;
  vec3 col = mix(uC * 0.15, uC * 0.35, uv.y);
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float y = 0.15 + fi * 0.12 + 0.12 * sin(p.x * (1.5 + fi) + t * (1.0 + fi * 0.4) + uSeed);
    float band = exp(-pow((p.y - y) * (6.0 + fi * 2.0), 2.0)) * (0.6 + 0.4 * fbm(vec2(p.x * 3.0 + t * 2.0, fi)));
    col += mix(uA, uB, fi / 2.0) * band * 0.9;
  }
  float stars = step(0.996, hash(floor(fragCoord / 2.0))) * (0.5 + 0.5 * sin(uTime * 3.0 + hash(floor(fragCoord)) * 6.28));
  col += stars * (1.0 - uv.y * 0.3) * 0.8;
  col *= smoothstep(-0.55, -0.2, p.y) * 0.85 + 0.15;
  fragColor = vec4(col, 1.0);
}`,
  // Layered sea swells at sunset.
  waves: /* glsl */ `
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.xy;
  vec2 p = uvOf(fragCoord);
  float t = uTime * 0.6;
  vec3 col = mix(uB, uA, smoothstep(-0.1, 0.6, p.y));
  float sun = smoothstep(0.17, 0.15, length(p - vec2(0.25, 0.22)));
  col = mix(col, vec3(1.0, 0.95, 0.85), sun * 0.9);
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float h = -0.05 - fi * 0.09 + 0.03 * sin(p.x * (4.0 + fi * 1.7) + t * (1.0 + fi * 0.3) + fi * 2.0 + uSeed)
      + 0.015 * sin(p.x * 13.0 - t * 2.0 + fi);
    float layer = smoothstep(h + 0.004, h - 0.004, p.y);
    vec3 water = mix(uC, uC * 0.35, fi / 4.0);
    col = mix(col, water + 0.08 * sin(p.x * 30.0 + t * 3.0), layer);
  }
  col *= 0.85 + 0.15 * uv.y;
  fragColor = vec4(col, 1.0);
}`,
  // Flying down a glowing tunnel.
  tunnel: /* glsl */ `
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 p = uvOf(fragCoord);
  float r = length(p) + 1e-3;
  float a = atan(p.y, p.x);
  float z = 0.35 / r + uTime * 1.2;
  float ang = a / 6.28318 * 8.0 + uTime * 0.2 + uSeed;
  float tiles = step(0.5, fract(z)) * step(0.5, fract(ang)) + step(fract(z), 0.5) * step(fract(ang), 0.5);
  vec3 col = mix(uA, uB, tiles);
  col = mix(col, uC, 0.5 + 0.5 * sin(z * 0.7));
  float glow = smoothstep(0.02, 0.0, abs(fract(z) - 0.5) - 0.47);
  col += glow * uB * 0.6;
  col *= smoothstep(0.0, 0.6, r) * 1.2;
  fragColor = vec4(col, 1.0);
}`,
  // Old-school demoscene plasma.
  plasma: /* glsl */ `
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 p = uvOf(fragCoord) * 3.0;
  float t = uTime * 0.7;
  float v = sin(p.x + t + uSeed) + sin((p.y + t) * 0.8) + sin((p.x + p.y + t) * 0.6)
    + sin(length(p + vec2(sin(t * 0.5), cos(t * 0.4)) * 1.5) * 2.0);
  v = v * 0.25 + 0.5;
  vec3 col = mix(uA, uB, smoothstep(0.0, 0.5, v));
  col = mix(col, uC, smoothstep(0.5, 1.0, v));
  col += 0.08 * sin(v * 40.0);
  fragColor = vec4(col, 1.0);
}`,
  // A warp through a starfield, with a nebula behind.
  stars: /* glsl */ `
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 p = uvOf(fragCoord);
  float t = uTime * 0.25;
  vec3 col = uC * 0.12 + uA * 0.35 * fbm(p * 2.0 + vec2(t * 0.3, uSeed)) * fbm(p * 3.0 - t * 0.2);
  for (int layer = 0; layer < 4; layer++) {
    float fl = float(layer);
    float depth = fract(t * 0.6 + fl / 4.0);
    float scale = mix(16.0, 1.5, depth);
    vec2 q = p * scale + fl * 7.0;
    vec2 id = floor(q);
    vec2 f = fract(q) - 0.5;
    float h = hash(id + fl);
    vec2 off = vec2(hash(id + 3.1), hash(id + 5.7)) - 0.5;
    float d = length(f - off * 0.7);
    float s = smoothstep(0.08 * depth + 0.01, 0.0, d) * step(0.6, h);
    col += s * mix(uB, vec3(1.0), 0.6) * smoothstep(0.0, 0.3, depth) * smoothstep(1.0, 0.85, depth) * 1.5;
  }
  fragColor = vec4(col, 1.0);
}`,
  // Lava-lamp metaballs.
  blobs: /* glsl */ `
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 p = uvOf(fragCoord);
  float t = uTime * 0.45;
  float field = 0.0;
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    vec2 c = 0.45 * vec2(sin(t * (0.6 + fi * 0.13) + fi * 1.7 + uSeed), cos(t * (0.5 + fi * 0.11) + fi * 2.3));
    field += 0.018 / dot(p - c, p - c);
  }
  vec3 col = mix(uC * 0.25, uC * 0.5, fragCoord.y / iResolution.y);
  float inside = smoothstep(0.9, 1.0, field);
  col = mix(col, mix(uA, uB, clamp(field * 0.25, 0.0, 1.0)), inside);
  col += smoothstep(1.0, 1.04, field) * smoothstep(1.12, 1.04, field) * 0.35;
  fragColor = vec4(col, 1.0);
}`,
  // A retro sun over a neon grid racing toward you.
  horizon: /* glsl */ `
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 p = uvOf(fragCoord);
  vec3 col = mix(uC * 0.6, uA * 0.6, smoothstep(-0.1, 0.5, p.y));
  vec2 sp = p - vec2(0.0, 0.12);
  float sun = smoothstep(0.26, 0.25, length(sp));
  float stripes = step(0.0, sin(sp.y * 70.0 + uTime * 2.0)) + step(0.05, sp.y);
  col = mix(col, mix(uB, vec3(1.0, 0.9, 0.5), smoothstep(-0.25, 0.25, sp.y)), sun * min(stripes, 1.0));
  if (p.y < 0.0) {
    float z = 0.15 / (-p.y + 0.02);
    vec2 g = vec2(p.x * z, z + uTime * 1.5);
    vec2 gl = abs(fract(g) - 0.5) / fwidth(g);
    float line = 1.0 - min(min(gl.x, gl.y), 1.0);
    col = mix(uC * 0.2, uB, line * smoothstep(8.0, 1.0, z));
    col += uA * 0.25 * smoothstep(-0.12, 0.0, p.y);
  }
  fragColor = vec4(col, 1.0);
}`,
  // Ripples spreading from a few drops.
  rings: /* glsl */ `
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 p = uvOf(fragCoord);
  float t = uTime;
  vec3 col = mix(uC * 0.3, uC * 0.55, fragCoord.y / iResolution.y);
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float period = 3.0 + fi;
    float cycle = floor((t + fi * 1.3) / period);
    float age = mod(t + fi * 1.3, period);
    vec2 c = (vec2(hash(vec2(cycle, fi)), hash(vec2(fi, cycle + 4.0))) - 0.5) * vec2(1.2, 0.7);
    float d = length(p - c);
    float wave = sin((d - age * 0.25) * 60.0) * exp(-abs(d - age * 0.25) * 18.0) * exp(-age * 0.6);
    col += mix(uA, uB, fi / 3.0) * max(wave, 0.0) * 0.8;
  }
  fragColor = vec4(col, 1.0);
}`,
}

export const sceneCode = (scene: Scene) => common + bodies[scene]

/** '#rrggbb' to the 0..1 triple a vec3 uniform takes. */
export const rgb = (hex: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number]
