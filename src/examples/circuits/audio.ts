// Sound: one Web Audio context for the whole example, a voice per sound part. The parts' eval stays pure (it only
// writes what it wants to sound like into its state); SoundView applies that to its voice once per frame.
// Browsers only start audio after a user gesture, so the context resumes on the first press anywhere.

let ctx: AudioContext | null = null
let master: GainNode | null = null
let muted = false
const MASTER = 0.25

export function audio() {
  if (!ctx) {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = muted ? 0 : MASTER
    master.connect(ctx.destination)
    const wake = () => ctx?.resume()
    window.addEventListener('pointerdown', wake, { capture: true })
    window.addEventListener('keydown', wake, { capture: true })
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return { ctx, out: master! }
}
export function setMuted(m: boolean) {
  muted = m
  if (master && ctx) master.gain.setTargetAtTime(m ? 0 : MASTER, ctx.currentTime, 0.01)
}

export type Wave = 'square' | 'triangle' | 'sawtooth' | 'noise'
export const WAVES: Wave[] = ['square', 'triangle', 'sawtooth', 'noise']
/** Square duty cycles, as the NES pulse channels have them */
export const DUTIES = [0.125, 0.25, 0.5, 0.75]
export const midiToHz = (n: number) => 440 * 2 ** ((n - 69) / 12)

const pulses = new Map<number, PeriodicWave>()
function pulse(c: AudioContext, duty: number) {
  let w = pulses.get(duty)
  if (!w) {
    // A pulse wave's Fourier series: b_n = 2 / (nπ) · sin(nπ·duty)
    const n = 64
    const real = new Float32Array(n)
    const imag = new Float32Array(n)
    for (let k = 1; k < n; k++) imag[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * duty)
    w = c.createPeriodicWave(real, imag)
    pulses.set(duty, w)
  }
  return w
}
let noiseBuf: AudioBuffer | null = null
function noise(c: AudioContext) {
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate)
    const d = noiseBuf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  return noiseBuf
}

/** What a tone part wants to sound like right now */
export interface Tone { on: boolean; hz: number; volume: number; wave: Wave; duty: number }

/** A voice that follows a Tone: an oscillator (or looped noise) through its own gain */
export function createVoice() {
  const { ctx: c, out } = audio()
  const gain = c.createGain()
  gain.gain.value = 0
  gain.connect(out)
  let osc: OscillatorNode | null = null
  let src: AudioBufferSourceNode | null = null
  let kind = ''
  function source(t: Tone) {
    const want = t.wave === 'noise' ? 'noise' : t.wave === 'square' ? `sq${t.duty}` : t.wave
    if (want === kind) return
    osc?.stop()
    src?.stop()
    osc = src = null
    kind = want
    if (t.wave === 'noise') {
      src = c.createBufferSource()
      src.buffer = noise(c)
      src.loop = true
      src.connect(gain)
      src.start()
    } else {
      osc = c.createOscillator()
      if (t.wave === 'square') osc.setPeriodicWave(pulse(c, t.duty))
      else osc.type = t.wave
      osc.connect(gain)
      osc.start()
    }
  }
  return {
    set(t: Tone) {
      source(t)
      const now = c.currentTime
      const hz = Math.min(20000, Math.max(1, t.hz))
      // Short glides so a change doesn't click
      if (osc) osc.frequency.setTargetAtTime(hz, now, 0.002)
      if (src) src.playbackRate.setTargetAtTime(Math.min(16, Math.max(0.05, hz / 1000)), now, 0.002)
      gain.gain.setTargetAtTime(t.on ? t.volume : 0, now, 0.004)
    },
    stop() {
      gain.gain.setTargetAtTime(0, c.currentTime, 0.01)
      setTimeout(() => {
        osc?.stop()
        src?.stop()
        gain.disconnect()
      }, 80)
    },
  }
}

/** A PCM stream: blocks of samples (-1…1) queued one after another at `rate` per second */
export function createStream() {
  const { ctx: c, out } = audio()
  let next = 0
  return {
    push(samples: number[], rate: number) {
      if (!samples.length) return
      const buf = c.createBuffer(1, samples.length, Math.min(96000, Math.max(3000, rate)))
      buf.getChannelData(0).set(samples)
      const s = c.createBufferSource()
      s.buffer = buf
      s.connect(out)
      // Keep up with the clock: never schedule in the past, nor pile up more than half a second ahead
      const now = c.currentTime
      if (next < now + 0.02 || next > now + 0.5) next = now + 0.05
      s.start(next)
      next += buf.duration
    },
  }
}
