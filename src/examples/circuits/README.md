# Circuits example

Bitloom, a digital logic simulator in the spirit of Logisim Evolution, built only with
[m3ui-vue](https://m3ui.dev) components on `MFlow` from the library's `/flow` entry point. Live at
[m3ui.dev/examples/circuits](https://m3ui.dev/examples/circuits).

## Structure

```
circuits/
├── CircuitsExample.vue   layout: top bar, the palette, the circuit (MFlow), the inspector (sheets on phones)
├── logic.ts              signals: buses up to 32 bits of 0/1/Z/X as bit masks, gate logic, resolving drivers
├── parts.ts              every kind of part: pins from its parameters, how it computes, the state it keeps
├── devices.ts            screen, joypad, keyboard and terminal
├── sim.ts                the netlist and the event-driven propagation
├── geometry.ts           each part's size and where its pins sit, on a 20px pitch
├── useCircuit.ts         the circuit, its simulation, the clock, editing, saving and opening JSON
├── presets.ts            circuits to start from: the Tiny8 CPU (two programs), a 4-bit adder made of gates,
│                         counters, an SR latch, a byte-addressed RAM
└── components/
    ├── PartView.vue      a part on the canvas: gate shapes, boxes with named pins, live inputs and displays
    ├── DeviceView.vue    a screen's canvas, a terminal's text, a keyboard's field, a joypad's buttons
    ├── Wire.vue          a wire, colored by what it carries
    ├── Palette.vue       the parts, by category: click to add, or drag onto the canvas
    ├── Inspector.vue     the selection's settings; a ROM's or RAM's words as a hex grid
    └── TopBar.vue        circuit, clock controls and speed, save/open, theme, docs and source
```

## How it works

- **Signals** (`logic.ts`) are up to 32 bits, each 0, 1, Z (floating: nothing drives it) or X (unknown, or two
  drivers that disagree), kept as bit masks so a bus goes through a gate in one step. Gates use three-valued
  logic (AND with a 0 is 0 even next to an X), so a latch built from NOR gates starts at X and settles once set.
  An input driven by several outputs (tri-state buffers sharing a bus) resolves them bit by bit.
- **The simulation** (`sim.ts`) rebuilds the netlist when the circuit's structure changes (not when a part moves)
  and propagates events with a unit delay: each round evaluates the parts whose inputs changed, all from the values
  before the round, then commits their outputs. So every flip-flop, register, counter, program counter and RAM sees a
  clock edge with its inputs as they were just before it, and a loop that never settles is caught as an
  oscillation. The clock runs on `requestAnimationFrame`, several ticks per frame at high speeds.
- **Parts**: switches, buttons, input pins, constants, a clock; LEDs, probes, hex and 7-segment displays; AND, OR,
  NAND, NOR, XOR, XNOR (2–8 inputs, 1–32 bits), NOT, buffer, tri-state; multiplexer, demultiplexer, decoder; adder,
  subtractor, comparator; D, T and JK flip-flops, register, counter, program counter, ROM, RAM; splitter and merger.
- **RAM with byte addressing**: in byte mode every address is a byte and a `size` input picks how many bytes a read or
  write moves (0 one, 1 two, 2 four, little-endian), like a CPU's load/store byte, half and word.
- **Tiny8** is an 8-bit accumulator CPU made from those parts: a program counter addresses a ROM, the instruction
  splits into an opcode (high nibble) and an operand `a` (low nibble), a decoder drives the RAM's write enable,
  the output register and the jumps, and a multiplexer picks the accumulator's next value from the RAM, the adder,
  the subtractor or the immediate. Instructions: `0 OUT`, `1 LDA a`, `2 ADD a`, `3 SUB a`, `4 STA a`, `5 LDI a`,
  `6 JMP a`, `7 JZ a`. Edit the program in the ROM's inspector (it shows each word's mnemonic).
- **Drawing**: parts are a `#node-part` slot with an `MFlowHandle` per pin (ids `i0`…, `o0`…), wires a
  `#edge-wire` slot (routed by `pathType: 'smoothstep'`) that reads the simulation directly, so a running clock never touches MFlow's nodes or edges
  (and undo only sees real edits). Only pins of the same width connect (`isValidConnection`).
- **Devices** (`devices.ts`): a **screen** (8×8 up to 256×256 pixels; color as 1 bit, RGB 3 bits, RGB 3-3-2, the
  NES's 64-color palette, RGB 4-4-4 or 24 bits; paints pixel (x, y) on a clock edge, optionally double buffered with a
  vsync input), a **joypad** (eight buttons as a byte, or a NES-style shift register: strobe, clk → data; click it and
  play with the keyboard), a **keyboard** (a queue of ASCII keys, read one per clock edge) and a **terminal**. The
  screen paints its pixels into a canvas at most once per frame, only when they changed.
- **The clock** goes from 0.5 Hz to 10 MHz, or Max. Each frame runs what's due for at most 12 ms so the page stays
  responsive; when a circuit can't keep up, the bar shows the frequency it really reaches.
- **Branching wires**: drag from any wire to another pin to wire the same output there (MFlow's `edgeBranching`).
- **Saving**: the circuit and its switches' positions as JSON, from the folder menu.
