/*
 * The "audio files": every track is a short song generated live with the Web Audio API from
 * the track's genre, tempo, key and seed. Same seed, same song, so it behaves like a recording:
 * you can pause, seek and come back to it.
 *
 * A look-ahead scheduler (the classic "A Tale of Two Clocks" pattern) queues the notes of the
 * next fraction of a second on the audio clock; the playback position is read from that same
 * clock. Each play gets its own output bus, so pausing or seeking just fades that bus out and
 * drops it along with whatever notes it had already queued.
 */
import type { Track } from './catalog'
import { rng } from './rng'

type Style = Track['genre']

interface Song {
  track: Track
  step: number // seconds per 16th note
  bars: number
  chords: number[][] // 4 chords (MIDI notes), one per bar, repeating
  melody: Array<{ step: number; note: number; len: number }> // a 4-bar phrase, steps 0–63
  arp: boolean
}

interface StyleSpec {
  kick: number[]
  snare: number[]
  hat: number[]
  bass: number[]
  swing: number
  pad: OscillatorType
  lead: OscillatorType
  bassWave: OscillatorType
  cutoff: number
}

const styles: Record<Style, StyleSpec> = {
  lofi: { kick: [0, 7, 10], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14], bass: [0, 7, 10], swing: 0.3, pad: 'triangle', lead: 'sine', bassWave: 'sine', cutoff: 1400 },
  synthwave: { kick: [0, 8], snare: [4, 12], hat: [2, 6, 10, 14], bass: [0, 2, 4, 6, 8, 10, 12, 14], swing: 0, pad: 'sawtooth', lead: 'sawtooth', bassWave: 'sawtooth', cutoff: 1800 },
  ambient: { kick: [], snare: [], hat: [], bass: [0], swing: 0, pad: 'sawtooth', lead: 'sine', bassWave: 'sine', cutoff: 700 },
  house: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14], bass: [2, 6, 10, 14], swing: 0.08, pad: 'sawtooth', lead: 'square', bassWave: 'triangle', cutoff: 1200 },
  chiptune: { kick: [0, 6, 8], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14], bass: [0, 2, 4, 6, 8, 10, 12, 14], swing: 0, pad: 'square', lead: 'square', bassWave: 'triangle', cutoff: 3200 },
}

const MAJOR = [0, 2, 4, 5, 7, 9, 11]
const MINOR = [0, 2, 3, 5, 7, 8, 10]
// Chord progressions as scale degrees (0 = I/i).
const PROGRESSIONS = [
  [0, 5, 3, 4],
  [0, 4, 5, 3],
  [5, 3, 0, 4],
  [0, 3, 5, 4],
  [1, 4, 0, 0],
]

const songs = new Map<string, Song>()

function songFor(track: Track): Song {
  const cached = songs.get(track.id)
  if (cached) return cached
  const r = rng(track.seed * 7919)
  const scale = track.minor ? MINOR : MAJOR
  const note = (degree: number, octave = 0) => track.root + 12 * (octave + Math.floor(degree / 7)) + scale[((degree % 7) + 7) % 7]!
  const prog = PROGRESSIONS[Math.floor(r() * PROGRESSIONS.length)]!
  const sevenths = track.genre === 'lofi' || track.genre === 'ambient'
  const chords = prog.map((d) => [note(d), note(d + 2), note(d + 4), ...(sevenths ? [note(d + 6)] : [])])

  // A 4-bar melody: a random walk on the scale, landing on chord tones on the beat.
  const melody: Song['melody'] = []
  const density = { lofi: 0.35, synthwave: 0.45, ambient: 0.12, house: 0.3, chiptune: 0.6 }[track.genre]
  let degree = 4 + Math.floor(r() * 3)
  for (let s = 0; s < 64; s += 2) {
    if (r() > density && s % 16 !== 0) continue
    const onBeat = s % 4 === 0
    degree += Math.round((r() - 0.5) * 4)
    degree = Math.max(0, Math.min(11, degree))
    if (onBeat) degree = prog[Math.floor(s / 16)]! + [0, 2, 4][Math.floor(r() * 3)]! + 7 * (degree > 6 ? 1 : 0)
    melody.push({ step: s, note: note(degree, 1), len: track.genre === 'ambient' ? 8 : r() < 0.3 ? 4 : 2 })
  }

  const song: Song = {
    track,
    step: 60 / track.bpm / 4,
    bars: Math.round((track.duration * track.bpm) / 240),
    chords,
    melody,
    arp: track.genre === 'synthwave' || track.genre === 'chiptune' || (track.genre === 'house' && r() < 0.5),
  }
  songs.set(track.id, song)
  return song
}

const freq = (midi: number) => 440 * 2 ** ((midi - 69) / 12)

// Which parts play in each bar: intro, verse, chorus, verse, chorus…, outro.
function arrangement(bar: number, bars: number) {
  const section = Math.floor(bar / 8)
  const last = bar >= bars - 4
  const intro = section === 0
  const chorus = !intro && !last && section % 2 === 0
  return {
    pad: true,
    drums: !intro && !last,
    hats: !last || bar < bars - 2,
    bass: !intro && !last,
    melody: chorus || (intro && bar >= 4) || last,
    arp: !intro && !last,
  }
}

let ctx: AudioContext | null = null
let master: GainNode
let volume = 0.8
let analyser: AnalyserNode
let delay: DelayNode
let noise: AudioBuffer

function init() {
  if (ctx) return ctx
  ctx = new AudioContext()
  master = ctx.createGain()
  master.gain.value = volume * volume * 0.6
  const comp = ctx.createDynamicsCompressor()
  analyser = ctx.createAnalyser()
  analyser.fftSize = 128
  analyser.smoothingTimeConstant = 0.8
  master.connect(comp).connect(analyser).connect(ctx.destination)
  // A little echo for the lead.
  delay = ctx.createDelay(1)
  const feedback = ctx.createGain()
  feedback.gain.value = 0.3
  delay.connect(feedback).connect(delay)
  delay.connect(master)
  noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const data = noise.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return ctx
}

function env(g: GainNode, t: number, peak: number, attack: number, hold: number, release: number) {
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(peak, t + attack)
  g.gain.setValueAtTime(peak, t + attack + hold)
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + hold + release)
  return t + attack + hold + release
}

function tone(bus: GainNode, type: OscillatorType, f: number, t: number, peak: number, a: number, h: number, rel: number, cutoff = 0, detune = 0, send = false) {
  const c = ctx!
  const o = c.createOscillator()
  o.type = type
  o.frequency.value = f
  o.detune.value = detune
  const g = c.createGain()
  let out: AudioNode = o
  if (cutoff) {
    const lp = c.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = cutoff
    out = out.connect(lp)
  }
  out.connect(g).connect(bus)
  if (send) g.connect(delay)
  const end = env(g, t, peak, a, h, rel)
  o.start(t)
  o.stop(end + 0.05)
}

function hit(bus: GainNode, kind: 'kick' | 'snare' | 'hat', t: number, level: number) {
  const c = ctx!
  if (kind === 'kick') {
    const o = c.createOscillator()
    const g = c.createGain()
    o.frequency.setValueAtTime(140, t)
    o.frequency.exponentialRampToValueAtTime(42, t + 0.12)
    o.connect(g).connect(bus)
    env(g, t, 0.9 * level, 0.002, 0.02, 0.28)
    o.start(t)
    o.stop(t + 0.4)
    return
  }
  const src = c.createBufferSource()
  src.buffer = noise
  const f = c.createBiquadFilter()
  f.type = kind === 'hat' ? 'highpass' : 'bandpass'
  f.frequency.value = kind === 'hat' ? 7000 : 1800
  const g = c.createGain()
  src.connect(f).connect(g).connect(bus)
  const end = env(g, t, (kind === 'hat' ? 0.12 : 0.35) * level, 0.001, 0.005, kind === 'hat' ? 0.04 : 0.14)
  src.start(t, Math.random() * 0.5)
  src.stop(end + 0.02)
}

/** Queues everything that sounds on one 16th-note step. */
function playStep(bus: GainNode, song: Song, step: number, t: number) {
  const s = styles[song.track.genre]
  const bar = Math.floor(step / 16)
  const pos = step % 16
  const parts = arrangement(bar, song.bars)
  const chord = song.chords[bar % 4]!
  const barLen = song.step * 16
  // Swing pushes every other 8th note late.
  if (pos % 4 === 2) t += s.swing * song.step

  if (pos === 0 && parts.pad) {
    const level = song.track.genre === 'ambient' ? 0.07 : 0.045
    const attack = song.track.genre === 'ambient' ? barLen * 0.5 : 0.08
    for (const n of chord) {
      tone(bus, s.pad, freq(n), t, level, attack, barLen - attack - 0.1, 0.6, s.cutoff, -7)
      if (s.pad === 'sawtooth') tone(bus, s.pad, freq(n), t, level, attack, barLen - attack - 0.1, 0.6, s.cutoff, 7)
    }
  }
  if (parts.drums) {
    if (s.kick.includes(pos)) hit(bus, 'kick', t, 1)
    if (s.snare.includes(pos)) hit(bus, 'snare', t, song.track.genre === 'lofi' ? 0.7 : 1)
  }
  if (parts.hats && s.hat.includes(pos) && song.track.genre !== 'ambient' && bar > 1) hit(bus, 'hat', t, pos % 4 === 0 ? 1 : 0.6)
  if (parts.bass && s.bass.includes(pos)) {
    const root = chord[0]! - 12 + (song.track.genre === 'chiptune' && pos % 4 === 2 ? 12 : 0)
    const len = song.track.genre === 'ambient' ? barLen : song.step * (s.bass.length > 4 ? 1.6 : 3)
    tone(bus, s.bassWave, freq(root), t, 0.22, 0.01, len * 0.6, len * 0.4, s.bassWave === 'sawtooth' ? 500 : 0)
  }
  if (parts.arp && song.arp && pos % 2 === 0) {
    const n = chord[(pos / 2) % chord.length]! + 12
    tone(bus, song.track.genre === 'chiptune' ? 'square' : 'sawtooth', freq(n), t, 0.03, 0.005, song.step * 0.5, 0.12, 2400)
  }
  if (parts.melody) {
    const phraseStep = step % 64
    for (const m of song.melody) {
      if (m.step !== phraseStep) continue
      const len = m.len * song.step
      tone(bus, s.lead, freq(m.note), t, s.lead === 'sine' ? 0.12 : 0.05, 0.01, len * 0.7, len * 0.6, s.lead === 'sawtooth' ? 2600 : 0, 0, true)
    }
  }
}

// --- Transport ---------------------------------------------------------------------------

let song: Song | null = null
let bus: GainNode | null = null
let startedAt = 0 // ctx time at which position 0 would have been
let nextStep = 0
let timer: number | undefined
let pausedAt = 0
let ended: (() => void) | null = null

const LOOKAHEAD = 0.25

function schedule() {
  if (!ctx || !song || !bus) return
  // Background tabs only run timers about once a second: queue further ahead there.
  const horizon = ctx.currentTime + (document.hidden ? 1.6 : LOOKAHEAD)
  const total = song.bars * 16
  while (nextStep < total && startedAt + nextStep * song.step < horizon) {
    playStep(bus, song, nextStep, startedAt + nextStep * song.step)
    nextStep++
  }
  if (ctx.currentTime - startedAt >= song.track.duration) {
    stopBus()
    pausedAt = song.track.duration
    ended?.()
  }
}

function stopBus() {
  clearInterval(timer)
  timer = undefined
  if (bus && ctx) {
    const old = bus
    old.gain.setTargetAtTime(0, ctx.currentTime, 0.02)
    setTimeout(() => old.disconnect(), 200)
  }
  bus = null
}

export const engine = {
  /** Loads a track (stopped at 0). */
  load(track: Track) {
    stopBus()
    song = songFor(track)
    pausedAt = 0
  },
  play(from = pausedAt) {
    if (!song) return
    const c = init()
    void c.resume()
    stopBus()
    bus = c.createGain()
    bus.connect(master)
    startedAt = c.currentTime + 0.05 - from
    nextStep = Math.ceil(from / song.step - 0.001)
    schedule()
    timer = window.setInterval(schedule, 50)
  },
  pause() {
    pausedAt = this.position()
    stopBus()
  },
  seek(to: number) {
    if (!song) return
    pausedAt = Math.max(0, Math.min(to, song.track.duration - 0.5))
    if (bus) this.play(pausedAt)
  },
  position() {
    if (!song) return 0
    if (!bus || !ctx) return pausedAt
    return Math.max(0, Math.min(song.track.duration, ctx.currentTime - startedAt))
  },
  setVolume(v: number) {
    volume = v
    // Perceived loudness is closer to logarithmic: square the slider value.
    if (ctx) master.gain.setTargetAtTime(v * v * 0.6, ctx.currentTime, 0.03)
  },
  onEnded(fn: () => void) {
    ended = fn
  },
  /** Frequency bars (0–255) for the visualizer, or null before anything played. */
  levels(out: Uint8Array<ArrayBuffer>) {
    if (!ctx) return false
    analyser.getByteFrequencyData(out)
    return true
  },
  bins: 64,
  stop() {
    stopBus()
    pausedAt = 0
  },
}
