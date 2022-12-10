import { importInput } from './utils/importInput'

type Command = { type: 'addx'; value?: number } | { type: 'noop' }

function formatInput(input: string): Command[] {
  return input
    .split('\n')
    .map((line) => {
      const [type, value] = line.split(' ')
      if (type === 'noop') {
        return { type: 'noop' }
      } else if (type === 'addx') {
        return { type: 'addx', value: parseInt(value) }
      }
      return null
    })
    .filter((command) => command !== null) as Command[]
}

const input = formatInput(importInput(10))
const sampleInput = formatInput(importInput(10.1))

function inputAsCycles(input: Command[]): Command[] {
  const cycles = input.reduce((acc, curr) => {
    if (curr.type === 'addx') {
      acc = acc.concat([{ type: 'addx' }, { type: 'addx', value: curr.value }])
    } else {
      acc = acc.concat([{ type: 'noop' }])
    }
    return acc
  }, [] as Command[])

  return cycles
}

function part1(input: Command[], captureSignalStrengthAtCycles: number[]) {
  let x = 1
  let currentCycle = 0

  let signalStrengths: number[] = []
  const cycles = inputAsCycles(input)
  function calculateSignalStrength(x: number, cycles: number) {
    if (captureSignalStrengthAtCycles.includes(cycles)) {
      const signalStrength = x * cycles
      signalStrengths.push(signalStrength)
    }
  }

  for (const cycle of cycles) {
    currentCycle++
    calculateSignalStrength(x, currentCycle)

    if (cycle.type === 'addx' && cycle.value) {
      x += cycle.value
    }
  }

  const sumOfSignalStrengths = signalStrengths.reduce(
    (acc, curr) => acc + curr,
    0
  )

  console.log(sumOfSignalStrengths)
}

class CRTScreen {
  readonly width = 40
  readonly height = 6
  readonly pixel = '█'
  readonly spriteWidth = 3

  cycle: number = 0
  x: number = 0
  spritePosition: number = 1
  row: number = 0

  private screen: string[][] = []

  constructor() {
    for (let i = 0; i < this.height; i++) {
      this.screen.push(Array(this.width).fill(' '))
    }
  }

  run(input: Command[]) {
    const cycles = inputAsCycles(input)
    for (const cycle of cycles) {
      this.cycle++
      this.draw()
      this.x++

      if (this.x > this.width - 1) {
        this.row++
        this.x = 0
      }

      if (cycle.type === 'addx' && cycle.value) {
        this.spritePosition += cycle.value
      }
    }
  }

  draw() {
    // if this.x is at sprite position +- 1, draw sprite
    if (Math.abs(this.x - this.spritePosition) <= 1) {
      this.screen[this.row][this.x] = this.pixel
    }
  }

  print() {
    console.log(this.screen.map((row) => row.join('')).join('\n'))
  }
}

function part2(input: Command[]) {
  const screen = new CRTScreen()
  screen.run(input)
  screen.print()
}
part1(input, [20, 60, 100, 140, 180, 220])
part2(input)
