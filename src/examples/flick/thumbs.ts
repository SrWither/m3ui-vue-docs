/*
 * Thumbnails: one frame of each video's own shader, rendered once into an image. A browser only
 * allows a handful of live WebGL contexts (around 16), so a grid of MShader cards would run out;
 * instead one shared off-screen context draws every frame here, and only the player plays live.
 * Without WebGL2 a thumbnail falls back to a gradient in the video's colors.
 */
import { rgb, sceneCode, type Scene } from './shaders'

export interface ThumbSpec {
  id: string
  scene: Scene
  colors: [string, string, string]
  seed: number
  /** Position in seconds the frame is taken at. */
  time: number
  vertical?: boolean
}

const cache = new Map<string, string>()
let gl: WebGL2RenderingContext | null | undefined
let canvas: HTMLCanvasElement
const programs = new Map<Scene, WebGLProgram | null>()

const VERTEX = `#version 300 es
void main() {
  vec2 pos = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
}`

// The same preamble MShader puts in front of the code, so a scene compiles the same way in both.
const fragment = (scene: Scene) => `#version 300 es
precision highp float;
uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;
uniform int iFrame;
uniform float uTime;
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
uniform float uSeed;
out vec4 fragColor;
${sceneCode(scene)}
void main() { mainImage(fragColor, gl_FragCoord.xy); }`

function context() {
  if (gl !== undefined) return gl
  canvas = document.createElement('canvas')
  gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true })
  return gl
}

function program(scene: Scene) {
  if (programs.has(scene)) return programs.get(scene)!
  const g = gl!
  const shader = (type: number, src: string) => {
    const s = g.createShader(type)!
    g.shaderSource(s, src)
    g.compileShader(s)
    return s
  }
  const p = g.createProgram()!
  g.attachShader(p, shader(g.VERTEX_SHADER, VERTEX))
  g.attachShader(p, shader(g.FRAGMENT_SHADER, fragment(scene)))
  g.linkProgram(p)
  const ok = g.getProgramParameter(p, g.LINK_STATUS)
  programs.set(scene, ok ? p : null)
  return ok ? p : null
}

function gradient({ colors: [a, b, c], vertical }: ThumbSpec) {
  const [w, h] = vertical ? [180, 320] : [320, 180]
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='.55' stop-color='${b}'/><stop offset='1' stop-color='${c}'/></linearGradient></defs><rect width='${w}' height='${h}' fill='url(#g)'/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/** A data URL with the frame of `spec.time`, cached per id and time. */
export function thumbnail(spec: ThumbSpec): string {
  const key = `${spec.id}@${Math.round(spec.time)}`
  const hit = cache.get(key)
  if (hit) return hit
  const g = context()
  const p = g && program(spec.scene)
  let url: string
  if (!g || !p) {
    url = gradient(spec)
  } else {
    const [w, h] = spec.vertical ? [270, 480] : [480, 270]
    canvas.width = w
    canvas.height = h
    g.viewport(0, 0, w, h)
    g.useProgram(p)
    const loc = (n: string) => g.getUniformLocation(p, n)
    g.uniform3f(loc('iResolution'), w, h, 1)
    g.uniform1f(loc('uTime'), spec.time)
    g.uniform3f(loc('uA'), ...rgb(spec.colors[0]))
    g.uniform3f(loc('uB'), ...rgb(spec.colors[1]))
    g.uniform3f(loc('uC'), ...rgb(spec.colors[2]))
    g.uniform1f(loc('uSeed'), spec.seed)
    g.drawArrays(g.TRIANGLES, 0, 3)
    url = canvas.toDataURL('image/jpeg', 0.82)
  }
  cache.set(key, url)
  return url
}
