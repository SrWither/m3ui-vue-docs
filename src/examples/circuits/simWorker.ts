/// <reference lib="webworker" />
// The simulation off the main thread, for fast clocks: the page sends the circuit and every part's state, this runs
// the clock (as fast as it can for Max) and sends back, a few times a frame, what's needed to draw it. The user's
// changes (a switch, a key, a memory word) come in as data (ops.ts). On stop it sends the whole state back.
import { Simulator, type PartNode } from './sim'
import { setCircuitResolver, type CircuitDef } from './library'
import type { FlowEdge } from '@m3ui-vue/m3ui-vue/flow'
import type { PokeOp } from './ops'

type In =
  | { type: 'start'; nodes: PartNode[]; edges: FlowEdge[]; circuits: CircuitDef[]; state: ReturnType<Simulator['exportState']>; hz: number }
  | { type: 'hz'; hz: number }
  | { type: 'poke'; id: string; op: PokeOp }
  | { type: 'stop' }

const sim = new Simulator()
let hz = Infinity
let running = false
let owed = 0
let last = 0
let ticks = 0
/** How long one slice runs before it reports and lets messages in */
const SLICE = 14
// A message to ourselves runs the next slice right after pending messages, without setTimeout's 4ms clamp
const channel = new MessageChannel()
channel.port1.onmessage = () => slice()
const next = () => (hz === Infinity ? channel.port2.postMessage(0) : setTimeout(slice, 8))

function slice() {
  if (!running) return
  const start = performance.now()
  let done = 0
  if (hz === Infinity) {
    while (performance.now() - start < SLICE && !sim.oscillating) {
      for (let i = 0; i < 32 && !sim.oscillating; i++) {
        sim.tick()
        done++
      }
    }
  } else {
    owed += ((start - last) / 1000) * hz * 2
    while (done < Math.floor(owed) && !sim.oscillating) {
      sim.tick()
      done++
      if ((done & 63) === 0 && performance.now() - start > SLICE) break
    }
    // A backlog it couldn't run is dropped, as on the main thread
    owed = Math.min(owed - done, 1)
  }
  last = start
  ticks += done
  postMessage({ type: 'frame', ticks: done, ...sim.exportState(false) })
  sim.drain()
  if (sim.oscillating) running = false
  else next()
}

self.onmessage = (e: MessageEvent<In>) => {
  const m = e.data
  if (m.type === 'start') {
    setCircuitResolver((id) => m.circuits.find((c) => c.id === id))
    sim.build(m.nodes, m.edges)
    sim.importState(m.state)
    hz = m.hz
    running = true
    owed = 1
    last = performance.now()
    next()
  } else if (m.type === 'hz') {
    hz = m.hz
    owed = 0
    last = performance.now()
  } else if (m.type === 'poke') sim.poke(m.id, m.op)
  else if (m.type === 'stop') {
    running = false
    postMessage({ type: 'final', ticks: 0, ...sim.exportState(true) })
  }
}
