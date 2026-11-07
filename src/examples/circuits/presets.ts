// Circuits to start from, built with a small helper so the wiring reads like a netlist.
import type { FlowEdge } from '@m3ui-vue/m3ui-vue/flow'
import type { Params } from './parts'
import type { PartNode } from './sim'

export interface Preset {
  id: string
  name: string
  description: string
  nodes: PartNode[]
  edges: FlowEdge[]
  /** Switch / pin values */
  state?: Record<string, { value: number }>
  /** Clock speed it runs best at */
  hz?: number
  /** The main circuit's id and name (else 'main', 'Main') */
  mainId?: string
  mainName?: string
  /** More circuits of the project, which the main one (or each other) can place as subcircuits */
  circuits?: { id: string; name: string; nodes: PartNode[]; edges: FlowEdge[]; state?: Record<string, { value: number }> }[]
  /** The circuit shown first */
  open?: string
}

function builder() {
  const nodes: PartNode[] = []
  const edges: FlowEdge[] = []
  const part = (id: string, kind: string, x: number, y: number, params: Params = {}, label?: string) => {
    nodes.push({ id, type: 'part', position: { x, y }, data: { kind, params, label } })
    return id
  }
  // From output `o` of `a` to input `i` of `b`
  const wire = (a: string, o: number, b: string, i: number) => {
    edges.push({ id: `${a}.${o}-${b}.${i}`, source: a, sourceHandle: `o${o}`, target: b, targetHandle: `i${i}` })
  }
  return { nodes, edges, part, wire }
}

function srLatch(): Preset {
  const { nodes, edges, part, wire } = builder()
  part('S', 'button', 0, 0, {}, 'Set')
  part('R', 'button', 0, 200, {}, 'Reset')
  part('n1', 'nor', 200, 20)
  part('n2', 'nor', 200, 180)
  part('Q', 'led', 400, 40, { color: 'primary' }, 'Q')
  part('Qn', 'led', 400, 200, { color: 'tertiary' }, 'Q̅')
  wire('S', 0, 'n1', 0)
  wire('n2', 0, 'n1', 1)
  wire('R', 0, 'n2', 1)
  wire('n1', 0, 'n2', 0)
  wire('n2', 0, 'Q', 0)
  wire('n1', 0, 'Qn', 0)
  return { id: 'latch', name: 'SR latch', description: 'Two NOR gates feeding each other remember one bit. Hold Set or Reset; it starts unknown (X) until you do.', nodes, edges }
}

function adder4(): Preset {
  const { nodes, edges, part, wire } = builder()
  const state: Record<string, { value: number }> = {}
  part('c0', 'const', 0, 1000, { width: 1, value: 0 }, 'Carry in')
  for (let i = 0; i < 4; i++) {
    const y = i * 240
    part(`a${i}`, 'switch', 0, y, {}, `A${i}`)
    part(`b${i}`, 'switch', 0, y + 80, {}, `B${i}`)
    part(`x1${i}`, 'xor', 180, y)
    part(`x2${i}`, 'xor', 360, y + 20)
    part(`g1${i}`, 'and', 180, y + 100)
    part(`g2${i}`, 'and', 360, y + 120)
    part(`o${i}`, 'or', 540, y + 120)
    part(`s${i}`, 'led', 560, y + 20, {}, `S${i}`)
    wire(`a${i}`, 0, `x1${i}`, 0)
    wire(`b${i}`, 0, `x1${i}`, 1)
    wire(`a${i}`, 0, `g1${i}`, 0)
    wire(`b${i}`, 0, `g1${i}`, 1)
    wire(`x1${i}`, 0, `x2${i}`, 0)
    wire(`x1${i}`, 0, `g2${i}`, 0)
    const carry = i === 0 ? 'c0' : `o${i - 1}`
    wire(carry, 0, `x2${i}`, 1)
    wire(carry, 0, `g2${i}`, 1)
    wire(`g1${i}`, 0, `o${i}`, 0)
    wire(`g2${i}`, 0, `o${i}`, 1)
    wire(`x2${i}`, 0, `s${i}`, 0)
  }
  state.a0 = { value: 1 }
  state.a1 = { value: 1 }
  state.b0 = { value: 1 }
  state.b2 = { value: 1 }
  part('cout', 'led', 740, 860, { color: 'error' }, 'Carry out')
  wire('o3', 0, 'cout', 0)
  for (const [id, src, x] of [['A', 'a', 760], ['B', 'b', 900], ['S', 's', 1040]] as const) {
    part(`m${id}`, 'merge', x, 260, { width: 4, parts: 4 })
    part(`h${id}`, 'hex', x, 440, {}, id === 'S' ? 'A + B' : id)
    for (let i = 0; i < 4; i++) wire(src === 's' ? `x2${i}` : `${src}${i}`, 0, `m${id}`, i)
    wire(`m${id}`, 0, `h${id}`, 0)
  }
  return {
    id: 'adder',
    name: '4-bit adder',
    description: 'Four full adders made of XOR, AND and OR gates, the carry rippling from one to the next. Flip the A and B switches.',
    nodes,
    edges,
    state,
  }
}

function counter(): Preset {
  const { nodes, edges, part, wire } = builder()
  part('clk', 'clock', 0, 0)
  for (let i = 0; i < 4; i++) {
    part(`t${i}`, 'tff', 180 + i * 200, 0)
    part(`l${i}`, 'led', 200 + i * 200, 160, {}, `Q${i}`)
    wire(i === 0 ? 'clk' : `t${i - 1}`, i === 0 ? 0 : 1, `t${i}`, 1)
    wire(`t${i}`, 0, `l${i}`, 0)
  }
  part('m', 'merge', 1000, 0, { width: 4, parts: 4 })
  for (let i = 0; i < 4; i++) wire(`t${i}`, 0, 'm', i)
  part('h', 'hex', 1180, 0, {}, 'Ripple')
  wire('m', 0, 'h', 0)
  part('c', 'counter', 180, 300, { width: 8 })
  part('p', 'probe', 400, 300, { width: 8 }, 'Counter')
  wire('clk', 0, 'c', 1)
  wire('c', 0, 'p', 0)
  return {
    id: 'counter',
    name: 'Counters',
    description: 'Four T flip-flops, each clocked by the one before it (a ripple counter), next to the built-in 8-bit counter. Press play.',
    nodes,
    edges,
  }
}

// Tiny8: an 8-bit accumulator CPU. Instruction = op (high nibble) | a (low nibble). Program in a ROM, data in a RAM.
//   0 OUT  out ← acc      1 LDA a  acc ← ram[a]       2 ADD a  acc ← acc + ram[a]   3 SUB a  acc ← acc − ram[a]
//   4 STA a  ram[a] ← acc  5 LDI a  acc ← a             6 JMP a  pc ← a               7 JZ a   pc ← a if acc = 0
function tiny8(id: string, name: string, description: string, program: number[], data: number[]): Preset {
  const { nodes, edges, part, wire } = builder()
  part('clk', 'clock', 0, 0)
  part('pc', 'pc', 160, 0, { width: 4 })
  part('rom', 'rom', 380, 0, { select: 4, width: 8, contents: program, asm: true }, 'Program')
  part('ins', 'split', 600, 0, { width: 8, parts: 2 }, 'Instruction')
  part('opb', 'split', 780, 120, { width: 4, parts: 4 }, 'Opcode bits')
  part('op3', 'merge', 960, 120, { width: 3, parts: 3 }, 'Opcode')
  part('dec', 'decoder', 1140, 120, { select: 3 })
  part('ram', 'ram', 780, 400, { select: 4, width: 8, contents: data }, 'Data')
  part('add', 'adder', 1000, 400, { width: 8 })
  part('sub', 'subtractor', 1000, 540, { width: 8 })
  part('hi0', 'const', 600, 700, { width: 4, value: 0 })
  part('imm', 'merge', 780, 660, { width: 8, parts: 2 }, 'Immediate')
  part('mux', 'mux', 1240, 400, { select: 3, width: 8 }, 'ALU result')
  part('acc', 'register', 1460, 400, { width: 8 }, 'Accumulator')
  part('z8', 'const', 1460, 640, { width: 8, value: 0 })
  part('zero', 'comparator', 1640, 600, { width: 8 }, 'acc = 0?')
  part('jz', 'and', 1400, 140)
  part('jmp', 'or', 1560, 120)
  part('out', 'register', 1700, 380, { width: 8 }, 'Output')
  part('outp', 'probe', 1900, 380, { width: 8 }, 'Output')
  part('outs', 'split', 1900, 500, { width: 8, parts: 2 })
  part('h1', 'hex', 2080, 480)
  part('h0', 'hex', 2180, 480)
  part('accp', 'probe', 1700, 260, { width: 8 }, 'Accumulator')
  part('pcp', 'probe', 160, 200, { width: 4 }, 'PC')

  // Fetch: the PC addresses the program, the instruction splits into op and a
  wire('clk', 0, 'pc', 3)
  wire('pc', 0, 'rom', 0)
  wire('pc', 0, 'pcp', 0)
  wire('rom', 0, 'ins', 0)
  wire('ins', 1, 'opb', 0)
  for (let i = 0; i < 3; i++) wire('opb', i, 'op3', i)
  wire('op3', 0, 'dec', 0)
  // Execute: memory, arithmetic, and the mux that picks the accumulator's next value
  wire('ins', 0, 'ram', 0)
  wire('acc', 0, 'ram', 1)
  wire('dec', 4, 'ram', 2)
  wire('clk', 0, 'ram', 3)
  wire('acc', 0, 'add', 0)
  wire('ram', 0, 'add', 1)
  wire('acc', 0, 'sub', 0)
  wire('ram', 0, 'sub', 1)
  wire('ins', 0, 'imm', 0)
  wire('hi0', 0, 'imm', 1)
  for (const i of [0, 4, 6, 7]) wire('acc', 0, 'mux', i)
  wire('ram', 0, 'mux', 1)
  wire('add', 0, 'mux', 2)
  wire('sub', 0, 'mux', 3)
  wire('imm', 0, 'mux', 5)
  wire('op3', 0, 'mux', 8)
  wire('mux', 0, 'acc', 0)
  wire('clk', 0, 'acc', 2)
  // Jumps: JMP always, JZ when the accumulator is 0
  wire('acc', 0, 'zero', 0)
  wire('z8', 0, 'zero', 1)
  wire('dec', 7, 'jz', 0)
  wire('zero', 1, 'jz', 1)
  wire('dec', 6, 'jmp', 0)
  wire('jz', 0, 'jmp', 1)
  wire('jmp', 0, 'pc', 1)
  wire('ins', 0, 'pc', 0)
  // Output
  wire('acc', 0, 'out', 0)
  wire('dec', 0, 'out', 1)
  wire('clk', 0, 'out', 2)
  wire('out', 0, 'outp', 0)
  wire('out', 0, 'outs', 0)
  wire('outs', 1, 'h1', 0)
  wire('outs', 0, 'h0', 0)
  wire('acc', 0, 'accp', 0)
  return { id, name, description, nodes, edges }
}

function byteRam(): Preset {
  const { nodes, edges, part, wire } = builder()
  part('A', 'pin', 0, 0, { width: 4 }, 'Address')
  part('D', 'pin', 0, 120, { width: 16 }, 'Data in')
  part('size', 'pin', 0, 240, { width: 2 }, 'Size (0 byte, 1 half)')
  part('we', 'switch', 0, 340, {}, 'Write enable')
  part('clk', 'button', 0, 420, {}, 'Clock')
  part('ram', 'ram', 340, 80, { select: 4, width: 16, addressing: 'byte', contents: [0x34, 0x12, 0x78, 0x56, 0xbc, 0x9a, 0xf0, 0xde] }, 'Byte RAM')
  part('q', 'probe', 560, 120, { width: 16 }, 'Read')
  wire('A', 0, 'ram', 0)
  wire('D', 0, 'ram', 1)
  wire('we', 0, 'ram', 2)
  wire('clk', 0, 'ram', 3)
  wire('size', 0, 'ram', 4)
  wire('ram', 0, 'q', 0)
  return {
    id: 'bytes',
    name: 'Byte-addressed RAM',
    description: 'A 16-bit RAM where every address is a byte: size 0 reads or writes one byte, size 1 two (little-endian, so address 0 reads 0x1234). Turn on write enable and press Clock to store.',
    nodes,
    edges,
    state: { size: { value: 1 }, D: { value: 0xbeef } },
  }
}

// A joypad moves a cursor that paints: x and y registers step by ±1 through an adder, a subtractor and a mux
// picked by the pad's arrows
function sketch(): Preset {
  const { nodes, edges, part, wire } = builder()
  part('clk', 'clock', 0, 0)
  part('pad', 'joypad', 0, 120)
  part('bits', 'split', 240, 100, { width: 8, parts: 8 }, 'Buttons')
  part('one', 'const', 240, 440, { width: 5, value: 1 })
  for (const [axis, y0, plus, minus] of [['x', 0, 7, 6], ['y', 300, 5, 4]] as const) {
    part(`${axis}sel`, 'merge', 440, y0 + 20, { width: 2, parts: 2 }, axis === 'x' ? 'Right / Left' : 'Down / Up')
    part(`${axis}inc`, 'adder', 440, y0 + 120, { width: 5 }, `${axis} + 1`)
    part(`${axis}dec`, 'subtractor', 620, y0 + 120, { width: 5 }, `${axis} − 1`)
    part(`${axis}mux`, 'mux', 820, y0, { select: 2, width: 5 }, `next ${axis}`)
    part(axis, 'register', 1000, y0 + 40, { width: 5 }, axis)
    wire('bits', plus, `${axis}sel`, 0)
    wire('bits', minus, `${axis}sel`, 1)
    wire(axis, 0, `${axis}inc`, 0)
    wire('one', 0, `${axis}inc`, 1)
    wire(axis, 0, `${axis}dec`, 0)
    wire('one', 0, `${axis}dec`, 1)
    wire(axis, 0, `${axis}mux`, 0)
    wire(`${axis}inc`, 0, `${axis}mux`, 1)
    wire(`${axis}dec`, 0, `${axis}mux`, 2)
    wire(axis, 0, `${axis}mux`, 3)
    wire(`${axis}sel`, 0, `${axis}mux`, 4)
    wire(`${axis}mux`, 0, axis, 0)
    wire('clk', 0, axis, 2)
  }
  part('ink', 'pin', 1000, 520, { width: 3 }, 'Color (RGB)')
  part('pen', 'const', 1000, 620, { width: 1, value: 1 })
  part('scr', 'screen', 1240, 0, { cols: 32, rows: 32, mode: 'rgb3' }, 'Sketch')
  wire('pad', 0, 'bits', 0)
  wire('x', 0, 'scr', 0)
  wire('y', 0, 'scr', 1)
  wire('ink', 0, 'scr', 2)
  wire('pen', 0, 'scr', 3)
  wire('clk', 0, 'scr', 4)
  wire('bits', 2, 'scr', 5)
  return {
    id: 'sketch',
    name: 'Sketch (joypad + screen)',
    description: 'Press play, click the joypad and draw with the arrows (or WASD): two registers step the cursor through an adder, a subtractor and a mux. Select clears; the input pin picks the color.',
    nodes,
    edges,
    state: { ink: { value: 6 } },
    hz: 10,
  }
}

// A counter sweeps every pixel; the color is x XOR y XOR the frame, through the NES palette
function pattern(): Preset {
  const { nodes, edges, part, wire } = builder()
  part('clk', 'clock', 0, 0)
  part('n', 'counter', 160, 0, { width: 18 }, 'Pixel')
  part('xyz', 'split', 380, 0, { width: 18, parts: 3 }, 'x · y · frame')
  part('mix', 'xor', 600, 120, { inputs: 3, width: 6 })
  part('on', 'const', 600, 260, { width: 1, value: 1 })
  part('scr', 'screen', 820, 0, { cols: 64, rows: 64, mode: 'nes', pixel: 4 }, 'Pattern')
  wire('clk', 0, 'n', 1)
  wire('n', 0, 'xyz', 0)
  wire('xyz', 0, 'scr', 0)
  wire('xyz', 1, 'scr', 1)
  for (let i = 0; i < 3; i++) wire('xyz', i, 'mix', i)
  wire('mix', 0, 'scr', 2)
  wire('on', 0, 'scr', 3)
  wire('clk', 0, 'scr', 4)
  return {
    id: 'pattern',
    name: 'Screen pattern',
    description: 'An 18-bit counter split into x, y and a frame number paints a 64×64 screen pixel by pixel, each one colored x XOR y XOR frame from the NES palette. Press play.',
    nodes,
    edges,
    hz: 5000,
  }
}

// Squash: a ball bounces around a 32×32 screen and a paddle on the left wall, moved with the joypad, sends it back.
// Each frame takes eight clock cycles, counted by `phase` and decoded: 0 clears the back buffer, 1 paints the ball,
// 2–4 the paddle's three pixels, 5 shows the frame (vsync) and moves everything (it's every counter's clock)
function squash(): Preset {
  const { nodes, edges, part, wire } = builder()
  const k = (id: string, x: number, y: number, width: number, value: number) => part(id, 'const', x, y, { width, value })
  // The frame signal (phase 5) reaches every counter through tunnels rather than long wires
  let frames = 0
  const frame = (to: string, i: number, x: number, y: number) => {
    const id = part(`frame${frames++}`, 'tunnel', x, y, { width: 1 }, 'frame')
    wire(id, 0, to, i)
  }
  // The frame's phases
  part('clk', 'clock', 0, 0)
  part('phase', 'counter', 160, 0, { width: 3 }, 'Phase')
  part('dec', 'decoder', 380, 0, { select: 3 })
  wire('clk', 0, 'phase', 1)
  wire('phase', 0, 'dec', 0)
  // The paddle: Up and Down move it a pixel a frame, from row 0 to 29 (its top; it's 3 tall)
  part('pad', 'joypad', 0, 260)
  part('btn', 'split', 240, 260, { width: 8, parts: 8 }, 'Buttons')
  part('move', 'or', 440, 340)
  part('py', 'counter', 600, 300, { width: 5, max: 29, overflow: 'stay', updown: true }, 'Paddle y')
  wire('pad', 0, 'btn', 0)
  wire('btn', 4, 'move', 0)
  wire('btn', 5, 'move', 1)
  part('frameOut', 'tunnel', 520, 100, { width: 1 }, 'frame')
  wire('dec', 5, 'frameOut', 0)
  wire('move', 0, 'py', 0)
  frame('py', 1, 440, 240)
  wire('btn', 5, 'py', 3)
  // The ball: a counter per axis, counting up while its T flip-flop's Q̅ is 1, turned around a step before each wall
  // (so it touches the wall on the next frame and leaves it on the one after)
  const axis = (a: 'x' | 'y', y0: number, high: number, low: number) => {
    part(`b${a}`, 'counter', 600, y0, { width: 5, overflow: 'stay', updown: true }, `Ball ${a}`)
    k(`${a}hi`, 800, y0 + 20, 5, high)
    k(`${a}lo`, 800, y0 + 120, 5, low)
    part(`${a}atHi`, 'comparator', 960, y0, { width: 5 })
    part(`${a}atLo`, 'comparator', 960, y0 + 120, { width: 5 })
    part(`${a}turnHi`, 'and', 1160, y0)
    part(`${a}turnLo`, 'and', 1160, y0 + 100)
    part(`${a}turn`, 'or', 1320, y0 + 40)
    part(`${a}dir`, 'tff', 1480, y0, {}, `${a} direction`)
    frame(`b${a}`, 1, 440, y0 + 20)
    wire(`${a}dir`, 1, `b${a}`, 3)
    wire(`b${a}`, 0, `${a}atHi`, 0)
    wire(`${a}hi`, 0, `${a}atHi`, 1)
    wire(`b${a}`, 0, `${a}atLo`, 0)
    wire(`${a}lo`, 0, `${a}atLo`, 1)
    wire(`${a}atHi`, 1, `${a}turnHi`, 0)
    wire(`${a}dir`, 1, `${a}turnHi`, 1)
    wire(`${a}atLo`, 1, `${a}turnLo`, 0)
    wire(`${a}dir`, 0, `${a}turnLo`, 1)
    wire(`${a}turnHi`, 0, `${a}turn`, 0)
    wire(`${a}turnLo`, 0, `${a}turn`, 1)
    wire(`${a}turn`, 0, `${a}dir`, 0)
    frame(`${a}dir`, 1, 1340, y0 - 40)
  }
  axis('x', 520, 30, 2)
  axis('y', 760, 30, 1)
  // Bouncing off the left side: a hit if the ball is level with the paddle (0 ≤ y − paddle < 3), else a miss
  part('dy', 'subtractor', 960, 1000, { width: 5 }, 'Ball − paddle')
  k('three', 960, 1120, 5, 3)
  part('level', 'comparator', 1160, 1000, { width: 5 })
  part('noHit', 'not', 1320, 1100)
  part('hit', 'and', 1480, 980)
  part('miss', 'and', 1480, 1080)
  part('hits', 'counter', 1640, 960, { width: 8 }, 'Hits')
  part('misses', 'counter', 1640, 1100, { width: 8 }, 'Misses')
  part('hitsOut', 'probe', 1860, 960, { width: 8, radix: 'dec' }, 'Hits')
  part('missesOut', 'probe', 1860, 1100, { width: 8, radix: 'dec' }, 'Misses')
  wire('by', 0, 'dy', 0)
  wire('py', 0, 'dy', 1)
  wire('dy', 0, 'level', 0)
  wire('three', 0, 'level', 1)
  wire('level', 0, 'noHit', 0)
  wire('xturnLo', 0, 'hit', 0)
  wire('level', 0, 'hit', 1)
  wire('xturnLo', 0, 'miss', 0)
  wire('noHit', 0, 'miss', 1)
  wire('hit', 0, 'hits', 0)
  frame('hits', 1, 1520, 900)
  wire('miss', 0, 'misses', 0)
  frame('misses', 1, 1520, 1180)
  wire('hits', 0, 'hitsOut', 0)
  wire('misses', 0, 'missesOut', 0)
  // What phases 1–4 paint: the ball at (x, y), or the paddle's pixel (0, paddle + phase − 2)
  part('ext', 'extender', 820, 0, { width: 3, to: 5 })
  part('row', 'adder', 1000, 0, { width: 5 }, 'Paddle + phase')
  k('minus2', 1000, 140, 5, 30)
  part('prow', 'adder', 1180, 0, { width: 5 }, '− 2')
  k('col0', 1180, 160, 5, 0)
  k('ballColor', 1180, 240, 3, 6)
  k('padColor', 1180, 320, 3, 3)
  part('sx', 'mux', 1380, 0, { select: 1, width: 5 }, 'x')
  part('sy', 'mux', 1380, 120, { select: 1, width: 5 }, 'y')
  part('sc', 'mux', 1380, 240, { select: 1, width: 3 }, 'color')
  part('paint', 'or', 1380, 340, { inputs: 4 })
  part('scr', 'screen', 1640, 0, { cols: 32, rows: 32, mode: 'rgb3', buffered: true }, 'Squash')
  wire('phase', 0, 'ext', 0)
  wire('py', 0, 'row', 0)
  wire('ext', 0, 'row', 1)
  wire('row', 0, 'prow', 0)
  wire('minus2', 0, 'prow', 1)
  wire('col0', 0, 'sx', 0)
  wire('bx', 0, 'sx', 1)
  wire('prow', 0, 'sy', 0)
  wire('by', 0, 'sy', 1)
  wire('padColor', 0, 'sc', 0)
  wire('ballColor', 0, 'sc', 1)
  for (const m of ['sx', 'sy', 'sc']) wire('dec', 1, m, 2)
  for (let i = 0; i < 4; i++) wire('dec', i + 1, 'paint', i)
  wire('sx', 0, 'scr', 0)
  wire('sy', 0, 'scr', 1)
  wire('sc', 0, 'scr', 2)
  wire('paint', 0, 'scr', 3)
  wire('clk', 0, 'scr', 4)
  wire('dec', 0, 'scr', 5)
  wire('dec', 5, 'scr', 6)
  return {
    id: 'squash',
    name: 'Squash (a game in gates)',
    description: 'A game made only of counters, comparators and gates: press play, click the joypad and keep the ball in with Up and Down (or W and S). Eight clock cycles make a frame, drawn into a double-buffered screen.',
    nodes,
    edges,
    hz: 100,
  }
}

// Type into the keyboard: each clock edge moves one key from its queue to the terminal
function echo(): Preset {
  const { nodes, edges, part, wire } = builder()
  part('clk', 'clock', 0, 0)
  part('kb', 'keyboard', 160, 0)
  part('tty', 'tty', 420, 0, { cols: 32, rows: 8 })
  part('cls', 'button', 160, 200, {}, 'Clear')
  wire('kb', 1, 'kb', 0)
  wire('clk', 0, 'kb', 1)
  wire('kb', 0, 'tty', 0)
  wire('kb', 1, 'tty', 1)
  wire('clk', 0, 'tty', 2)
  wire('cls', 0, 'tty', 3)
  return {
    id: 'echo',
    name: 'Keyboard → terminal',
    description: 'Press play and type into the keyboard: on each clock edge the first key in its queue goes to the terminal (avail drives both read and we).',
    nodes,
    edges,
    hz: 20,
  }
}

// A full adder as a circuit of its own, placed eight times: a ripple-carry adder for two 8-bit numbers
function rippleAdder(): Preset {
  const fa = builder()
  fa.part('A', 'pin', 0, 0, { width: 1 }, 'A')
  fa.part('B', 'pin', 0, 100, { width: 1 }, 'B')
  fa.part('Cin', 'pin', 0, 200, { width: 1 }, 'Cin')
  fa.part('x1', 'xor', 200, 20)
  fa.part('x2', 'xor', 380, 40)
  fa.part('g1', 'and', 200, 140)
  fa.part('g2', 'and', 380, 160)
  fa.part('o', 'or', 560, 160)
  fa.part('S', 'outpin', 560, 40, { width: 1 }, 'S')
  fa.part('Cout', 'outpin', 740, 180, { width: 1 }, 'Cout')
  fa.wire('A', 0, 'x1', 0)
  fa.wire('B', 0, 'x1', 1)
  fa.wire('A', 0, 'g1', 0)
  fa.wire('B', 0, 'g1', 1)
  fa.wire('x1', 0, 'x2', 0)
  fa.wire('Cin', 0, 'x2', 1)
  fa.wire('x1', 0, 'g2', 0)
  fa.wire('Cin', 0, 'g2', 1)
  fa.wire('g1', 0, 'o', 0)
  fa.wire('g2', 0, 'o', 1)
  fa.wire('x2', 0, 'S', 0)
  fa.wire('o', 0, 'Cout', 0)

  const { nodes, edges, part, wire } = builder()
  part('A', 'pin', 0, 0, { width: 8 }, 'A')
  part('B', 'pin', 0, 200, { width: 8 }, 'B')
  part('cin', 'switch', 0, 400, {}, 'Carry in')
  part('sa', 'split', 260, 0, { width: 8, parts: 8 })
  part('sb', 'split', 260, 260, { width: 8, parts: 8 })
  part('m', 'merge', 760, 300, { width: 8, parts: 8 }, 'Sum')
  part('tS', 'tunnel', 920, 380, { width: 8 }, 'sum')
  part('tR', 'tunnel', 1080, 100, { width: 8 }, 'sum')
  part('p', 'probe', 1220, 80, { width: 8 }, 'A + B')
  part('cout', 'led', 1240, 200, { color: 'error' }, 'Carry out')
  for (let i = 0; i < 8; i++) {
    part(`fa${i}`, 'sub', 480, i * 120 - 40, { circuit: 'fa' }, `FA${i}`)
    wire('sa', i, `fa${i}`, 0)
    wire('sb', i, `fa${i}`, 1)
    wire(i === 0 ? 'cin' : `fa${i - 1}`, i === 0 ? 0 : 1, `fa${i}`, 2)
    wire(`fa${i}`, 0, 'm', i)
  }
  wire('A', 0, 'sa', 0)
  wire('B', 0, 'sb', 0)
  wire('m', 0, 'tS', 0)
  wire('tR', 0, 'p', 0)
  wire('fa7', 1, 'cout', 0)
  return {
    id: 'ripple',
    name: '8-bit adder (subcircuits)',
    description: 'A full adder built once, as its own circuit (see the Circuits list), placed eight times with the carry rippling through. A tunnel named "sum" carries the result without a wire. Double-click an adder to open it.',
    nodes,
    edges,
    state: { A: { value: 0x5a }, B: { value: 0x3c } },
    circuits: [{ id: 'fa', name: 'Full adder', nodes: fa.nodes, edges: fa.edges }],
  }
}

// Every ALU operation on two input pins, with its flags
function aluDemo(): Preset {
  const { nodes, edges, part, wire } = builder()
  part('A', 'pin', 0, 0, { width: 8 }, 'A')
  part('B', 'pin', 0, 120, { width: 8 }, 'B')
  part('op', 'pin', 0, 240, { width: 4 }, 'op')
  part('cin', 'switch', 0, 340, {}, 'cin')
  part('alu', 'alu', 260, 60, { width: 8 })
  part('y', 'probe', 500, 40, { width: 8, signed: true }, 'Y')
  ;['Z', 'N', 'C', 'V'].forEach((f, i) => {
    part(f, 'led', 520, 140 + i * 60, { color: i === 3 ? 'error' : 'tertiary' }, f)
    wire('alu', i + 1, f, 0)
  })
  wire('A', 0, 'alu', 0)
  wire('B', 0, 'alu', 1)
  wire('op', 0, 'alu', 2)
  wire('cin', 0, 'alu', 3)
  wire('alu', 0, 'y', 0)
  return {
    id: 'alu',
    name: 'ALU',
    description: 'Pick an operation with op: 0 add, 1 subtract, 2 AND, 3 OR, 4 XOR, 5 NOT, 6–10 shifts and rotations, 11 +1, 12 −1, 13 B, 14 multiply, 15 compare. The LEDs are the zero, negative, carry and overflow flags.',
    nodes,
    edges,
    state: { A: { value: 100 }, B: { value: 50 } },
  }
}

// A 64 KiB ROM holding a message, read out by a 16-bit counter onto the terminal
function message(): Preset {
  const { nodes, edges, part, wire } = builder()
  const text = 'Hello from a 64 KiB ROM!\nLoad your own .bin or .hex into it\nfrom its settings.\n'
  part('clk', 'clock', 0, 0)
  part('n', 'counter', 160, 0, { width: 16 }, 'Address')
  part('rom', 'rom', 380, 0, { select: 16, width: 7, contents: [...text].map((ch) => ch.charCodeAt(0)) }, 'Message')
  part('z', 'const', 380, 180, { width: 7, value: 0 })
  part('cmp', 'comparator', 600, 120, { width: 7 }, 'char ≠ 0')
  part('tty', 'tty', 820, 0, { cols: 40, rows: 6 })
  wire('clk', 0, 'n', 1)
  wire('n', 0, 'rom', 0)
  wire('rom', 0, 'cmp', 1)
  wire('z', 0, 'cmp', 0)
  wire('rom', 0, 'tty', 0)
  wire('cmp', 0, 'tty', 1)
  wire('clk', 0, 'tty', 2)
  return {
    id: 'message',
    name: 'Message ROM (64 KiB)',
    description: 'A counter walks a ROM with 16 address bits and sends every character that isn\'t 0 to the terminal. Press play; open the ROM\'s settings to page through it or load a file.',
    nodes,
    edges,
    hz: 50,
  }
}

// Ode to Joy on two voices: a counter steps through a melody ROM and a bass ROM, each driving a synthesizer
// (the melody's gate is the clock, so its notes are short), and a piano with its own voice to play along
function musicBox(): Preset {
  const { nodes, edges, part, wire } = builder()
  const phrase = [76, 76, 77, 79, 79, 77, 76, 74, 72, 72, 74, 76]
  const melody = [...phrase, 76, 74, 74, 0, ...phrase, 74, 72, 72, 0]
  const bass = [48, 48, 48, 48, 43, 43, 43, 43, 48, 48, 48, 48, 43, 43, 43, 0, 48, 48, 48, 48, 43, 43, 43, 43, 48, 48, 43, 43, 43, 48, 48, 0]
  part('clk', 'clock', 0, 0)
  part('n', 'counter', 160, 0, { width: 5 }, 'Step')
  part('mel', 'rom', 380, 0, { select: 5, width: 7, contents: melody }, 'Melody')
  part('bas', 'rom', 380, 200, { select: 5, width: 7, contents: bass }, 'Bass')
  part('duty', 'const', 380, 400, { width: 2, value: 1 })
  part('tri', 'const', 380, 480, { width: 2, value: 1 })
  part('bvol', 'const', 380, 560, { width: 4, value: 12 })
  part('s1', 'synth', 640, 0, {}, 'Lead (square 25%)')
  part('s2', 'synth', 640, 200, {}, 'Bass (triangle)')
  part('kb', 'piano', 0, 420, { value: 60 }, 'Play along')
  part('saw', 'const', 140, 560, { width: 2, value: 2 })
  part('s3', 'synth', 380, 660, {}, 'Piano (sawtooth)')
  part('hn', 'probe', 640, 420, { width: 7 }, 'Lead note')
  wire('clk', 0, 'n', 1)
  wire('n', 0, 'mel', 0)
  wire('n', 0, 'bas', 0)
  wire('mel', 0, 's1', 0)
  wire('duty', 0, 's1', 3)
  wire('clk', 0, 's1', 4)
  wire('bas', 0, 's2', 0)
  wire('bvol', 0, 's2', 1)
  wire('tri', 0, 's2', 2)
  wire('kb', 0, 's3', 0)
  wire('saw', 0, 's3', 2)
  wire('kb', 1, 's3', 4)
  wire('mel', 0, 'hn', 0)
  return {
    id: 'music',
    name: 'Music box (sound)',
    description: 'Press play (with the sound on): a counter walks two ROMs of MIDI notes into two synthesizers, a square lead and a triangle bass. Click the piano and play along with the keyboard (Z S X D C…, Q 2 W 3 E…).',
    nodes,
    edges,
    hz: 4,
  }
}

// Digital audio: a 5-bit counter as the top bits of an 8-bit sawtooth, sampled 8000 times a second
function pcmTone(): Preset {
  const { nodes, edges, part, wire } = builder()
  part('clk', 'clock', 0, 0)
  part('n', 'counter', 160, 0, { width: 5 }, 'Phase')
  part('on', 'switch', 380, 200, {}, 'Sound')
  part('spk', 'pcm', 600, 0, { rate: 8000 }, 'Speaker')
  // Phase × 8: widened to 8 bits and shifted left by 3
  part('x', 'shifter', 160, 300, { width: 8, shift: 'shl' })
  part('e', 'extender', 0, 300, { width: 5, to: 8 })
  part('d', 'const', 0, 420, { width: 3, value: 3 })
  wire('clk', 0, 'n', 1)
  wire('n', 0, 'e', 0)
  wire('e', 0, 'x', 0)
  wire('d', 0, 'x', 1)
  wire('x', 0, 'spk', 0)
  wire('on', 0, 'spk', 1)
  wire('clk', 0, 'spk', 2)
  return {
    id: 'pcm',
    name: 'PCM sawtooth (sound)',
    description: 'Digital audio: a 5-bit counter, widened and shifted left by 3, is an 8-bit sample rising 250 times a second, played by the PCM speaker at 8000 samples per second. Press play and turn on Sound.',
    nodes,
    edges,
    hz: 8000,
  }
}

const blank = (): Preset => ({ id: 'blank', name: 'Blank', description: 'An empty canvas: add parts from the palette and wire their pins.', nodes: [], edges: [] })

export const presets: Preset[] = [
  tiny8(
    'cpu',
    'Tiny8 CPU · Fibonacci',
    'An 8-bit accumulator CPU: a program counter fetches from a ROM, a decoder and a mux pick what the accumulator becomes, a RAM holds the data. It prints the Fibonacci numbers. Press play.',
    // a = 0, b = 1; loop: out a; tmp = a + b; a = b; b = tmp
    [0x50, 0x4e, 0x51, 0x4f, 0x1e, 0x00, 0x2f, 0x4d, 0x1f, 0x4e, 0x1d, 0x4f, 0x64, 0x00, 0x00, 0x00],
    [],
  ),
  tiny8(
    'countdown',
    'Tiny8 CPU · Countdown',
    'The same CPU running another program: counts down from 9 with SUB, stops with JZ and loops on itself at 0.',
    // acc = 9; loop: out; acc -= ram[15]; if acc = 0 goto end; goto loop; end: out; goto end
    [0x59, 0x00, 0x3f, 0x75, 0x61, 0x00, 0x66, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    Object.assign(Array(16).fill(0), { 15: 1 }),
  ),
  squash(),
  adder4(),
  rippleAdder(),
  aluDemo(),
  message(),
  musicBox(),
  pcmTone(),
  sketch(),
  pattern(),
  echo(),
  counter(),
  srLatch(),
  byteRam(),
  blank(),
]
